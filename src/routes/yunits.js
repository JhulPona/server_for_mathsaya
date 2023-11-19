const express = require("express");
const router = express.Router();
const Yunit = require("../models/YunitModel");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Define storage for uploaded files and ensure the 'uploads/yunits' directory exists.
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, "../uploads/yunits");
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

// Route for adding a new Yunit with an uploaded image
router.post("/add", upload.single("yunitThumbnail"), async (req, res) => {
  try {
    const { yunitNumber, yunitName, teacherId } = req.body;

    // Check if a Yunit with the same yunitNumber and teacherId already exists
    const existingYunit = await Yunit.findOne({
      where: { yunitNumber, teacherId },
    });

    if (existingYunit) {
      return res.status(400).json({
        error: "Yunit with the same number and teacher already exists",
      });
    }

    const yunitTitle = `[${yunitNumber}] ${yunitName}`;

    const newYunitData = {
      yunitTitle,
      yunitNumber,
      yunitName,
      teacherId,
    };

    // Check if a file was uploaded
    if (req.file) {
      // If a file was uploaded, set the yunitThumbnail field to the filename
      newYunitData.yunitThumbnail = req.file.filename;
    }

    const newYunit = await Yunit.create(newYunitData);

    res.status(201).json(newYunit);
  } catch (error) {
    console.error("Error during Yunit addition:", error);
    res.status(500).json({ error: "Yunit addition failed" });
  }
});

// Route for viewing a Yunit by ID
router.get("/view/:yunitId", async (req, res) => {
  try {
    const { yunitId } = req.params;

    const yunit = await Yunit.findByPk(yunitId);

    if (!yunit) {
      res.status(404).json({ error: "Yunit not found" });
    } else {
      res.json(yunit);
    }
  } catch (error) {
    console.error("Error during Yunit view:", error);
    res.status(500).json({ error: "Yunit retrieval failed" });
  }
});

// Route for editing (updating) a Yunit by ID
router.put(
  "/edit/:yunitId",
  upload.single("yunitThumbnail"),
  async (req, res) => {
    try {
      const { yunitId } = req.params;
      const updatedData = req.body;

      const yunit = await Yunit.findByPk(yunitId);

      if (!yunit) {
        res.status(404).json({ error: "Yunit not found" });
        return;
      }

      // If a new file is uploaded, handle it
      if (req.file) {
        // Remove the old image file, if it exists
        if (yunit.yunitThumbnail) {
          const oldImageFilePath = path.join(
            __dirname,
            "../uploads/yunits",
            yunit.yunitThumbnail
          );
          fs.unlinkSync(oldImageFilePath);
        }

        // Set the yunitThumbnail field to the new filename
        updatedData.yunitThumbnail = req.file.filename;
      }

      // Update Yunit with the provided data
      await yunit.update(updatedData);

      res.json(yunit);
    } catch (error) {
      console.error("Error during Yunit edit:", error);
      res.status(500).json({ error: "Yunit edit failed" });
    }
  }
);

// Route for deleting a Yunit by ID
router.delete("/delete/:yunitId", async (req, res) => {
  try {
    const { yunitId } = req.params;

    // Find the Yunit by ID to get the associated thumbnail filename
    const yunit = await Yunit.findByPk(yunitId);

    if (!yunit) {
      res.status(404).json({ error: "Yunit not found" });
      return;
    }

    // Delete the Yunit from the database
    const deletedCount = await Yunit.destroy({ where: { yunitId } });

    if (deletedCount === 0) {
      res.status(404).json({ error: "Yunit not found" });
    } else {
      if (yunit.yunitThumbnail) {
        // Check if a thumbnail file is associated with the Yunit
        // Delete the associated thumbnail file
        const thumbnailPath = path.join(
          __dirname,
          "../uploads/yunits",
          yunit.yunitThumbnail
        );
        fs.unlinkSync(thumbnailPath);
      }
      res.status(204).send();
    }
  } catch (error) {
    console.error("Error during Yunit deletion:", error);
    res.status(500).json({ error: "Yunit deletion failed" });
  }
});

// Route to get all Yunits for a specific teacher
router.get("/yunits/:teacherId", async (req, res) => {
  try {
    const { teacherId } = req.params;

    const yunits = await Yunit.findAll({
      where: { teacherId },
      attributes: [
        "yunitId",
        "yunitTitle",
        "yunitNumber",
        "yunitName",
        "yunitThumbnail",
      ],
      order: [["yunitTitle", "ASC"]],
    });

    res.json(yunits);
  } catch (error) {
    console.error("Error getting Yunits for teacher:", error);
    res.status(500).json({ error: "Failed to get Yunits" });
  }
});

module.exports = router;
