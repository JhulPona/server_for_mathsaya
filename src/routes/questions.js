const express = require("express");
const router = express.Router();
const Question = require("../models/QuestionModel");
const sequelize = require("../config/sequelize");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Define storage for uploaded files and ensure the 'uploads/questions' directory exists.
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, "../uploads/questions");
    fs.mkdirSync(uploadDir, { recursive: true }); // Create directory if it doesn't exist
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Generate a unique filename, e.g., using Date.now()
    const uniqueFileName = Date.now() + "-" + file.originalname;
    cb(null, uniqueFileName);
  },
});
const upload = multer({ storage: storage });

// Route for adding a new Question
router.post(
  "/add",
  upload.fields([{ name: "questionImage" }]),
  async (req, res) => {
    try {
      const { question_text, answer_choices, correct_answer, exerciseId } =
        req.body;

      const newQuestionData = {
        question_text,
        answer_choices,
        correct_answer,
        exerciseId,
      };

      // Check if an image file was uploaded
      if (req.files && req.files.questionImage) {
        newQuestionData.questionImage = req.files.questionImage[0].filename;
      }

      const newQuestion = await Question.create(newQuestionData);

      res.status(201).json(newQuestion);
    } catch (error) {
      console.error("Error during Question addition:", error);
      res.status(500).json({ error: "Question addition failed" });
    }
  }
);

// Route for viewing a Question by ID
router.get("/view/:questionId", async (req, res) => {
  try {
    const { questionId } = req.params;

    const question = await Question.findByPk(questionId);

    if (!question) {
      res.status(404).json({ error: "Question not found" });
    } else {
      res.json(question);
    }
  } catch (error) {
    console.error("Error during Question view:", error);
    res.status(500).json({ error: "Question retrieval failed" });
  }
});

// Route for editing (updating) a Question by ID
router.put("/edit/:questionId", async (req, res) => {
  try {
    const { questionId } = req.params;
    const updatedData = req.body;

    const question = await Question.findByPk(questionId);

    if (!question) {
      res.status(404).json({ error: "Question not found" });
      return;
    }

    await question.update(updatedData);

    res.json(question);
  } catch (error) {
    console.error("Error during Question edit:", error);
    res.status(500).json({ error: "Question edit failed" });
  }
});

// Route for deleting a Question by ID
router.delete("/delete/:questionId", async (req, res) => {
  try {
    const { questionId } = req.params;

    const question = await Question.findByPk(questionId);

    if (!question) {
      res.status(404).json({ error: "Question not found" });
      return;
    }

    // Attempt to delete the question from the database
    const deletedCount = await Question.destroy({ where: { questionId } });

    if (deletedCount === 0) {
      res.status(404).json({ error: "Question not found" });
    } else {
      // Check if the questionImage exists
      if (question.questionImage) {
        const imagePath = path.join(
          __dirname,
          "../uploads/questions",
          question.questionImage
        );

        // Delete the associated image file
        fs.unlinkSync(imagePath);
      }

      res.status(204).send();
    }
  } catch (error) {
    console.error("Error during Question deletion:", error);
    res.status(500).json({ error: "Question deletion failed" });
  }
});

// Route for getting all questions for a specific exercise
router.get("/questions/:exerciseId", async (req, res) => {
  try {
    const { exerciseId } = req.params;

    const questions = await Question.findAll({
      where: { exerciseId },
      order: sequelize.literal("RAND()"),
    });

    res.json(questions);
  } catch (error) {
    console.error("Error getting questions for an exercise:", error);
    res.status(500).json({ error: "Failed to get questions" });
  }
});

module.exports = router;
