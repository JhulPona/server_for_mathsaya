const express = require("express");
const router = express.Router();
const Exercise = require("../models/ExerciseModel");

// Route for adding a new Exercise
router.post("/add", async (req, res) => {
  try {
    const {
      exercise_number,
      exercise_name,
      exercise_description,
      lessonId,
      teacherId,
    } = req.body;

    // Check if an Exercise with the same exercise_number and teacherId already exists
    const existingExercise = await Exercise.findOne({
      where: { exercise_number, teacherId, lessonId },
    });

    if (existingExercise) {
      return res.status(400).json({
        error: "Exercise with the same number and teacher already exists",
      });
    }

    const exerciseTitle = `[${exercise_number}] ${exercise_name}`;

    const newExercise = await Exercise.create({
      exerciseTitle,
      exercise_number,
      exercise_name,
      exercise_description,
      lessonId,
      teacherId,
    });

    res.status(201).json(newExercise);
  } catch (error) {
    console.error("Error during Exercise addition:", error);
    res.status(500).json({ error: "Exercise addition failed" });
  }
});

// Route for viewing an Exercise by ID
router.get("/view/:exerciseId", async (req, res) => {
  try {
    const { exerciseId } = req.params;

    const exercise = await Exercise.findByPk(exerciseId);

    if (!exercise) {
      res.status(404).json({ error: "Exercise not found" });
    } else {
      res.json(exercise);
    }
  } catch (error) {
    console.error("Error during Exercise view:", error);
    res.status(500).json({ error: "Exercise retrieval failed" });
  }
});

// Route for editing (updating) an Exercise by ID
router.put("/edit/:exerciseId", async (req, res) => {
  try {
    const { exerciseId } = req.params;
    const updatedData = req.body;

    const exercise = await Exercise.findByPk(exerciseId);

    if (!exercise) {
      res.status(404).json({ error: "Exercise not found" });
      return;
    }

    await exercise.update(updatedData);

    res.json(exercise);
  } catch (error) {
    console.error("Error during Exercise edit:", error);
    res.status(500).json({ error: "Exercise edit failed" });
  }
});

// Route for deleting an Exercise by ID
router.delete("/delete/:exerciseId", async (req, res) => {
  try {
    const { exerciseId } = req.params;

    const deletedCount = await Exercise.destroy({ where: { exerciseId } });

    if (deletedCount === 0) {
      res.status(404).json({ error: "Exercise not found" });
    } else {
      res.status(204).send();
    }
  } catch (error) {
    console.error("Error during Exercise deletion:", error);
    res.status(500).json({ error: "Exercise deletion failed" });
  }
});

// Route for getting all exercises for a specific lesson
router.get("/exercises/:lessonId", async (req, res) => {
  try {
    const { lessonId } = req.params;

    const exercises = await Exercise.findAll({
      where: { lessonId },
      order: [["exerciseTitle", "ASC"]],
    });

    res.json(exercises);
  } catch (error) {
    console.error("Error getting exercises for a lesson:", error);
    res.status(500).json({ error: "Failed to get exercises" });
  }
});

module.exports = router;
