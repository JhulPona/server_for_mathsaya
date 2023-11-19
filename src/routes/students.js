const express = require("express");
const router = express.Router();
const Student = require("../models/StudentModel");
const RoomSection = require("../models/RoomSectionModel");
const { v4: uuidv4 } = require("uuid");

// Route for adding a new student
router.post("/add", async (req, res) => {
  try {
    const { firstname, lastname, username, gender, sectionId, teacherId } =
      req.body;
    const profileId = uuidv4();

    const newStudent = await Student.create({
      firstname,
      lastname,
      username,
      gender,
      sectionId,
      teacherId,
      profileId,
    });

    // Update the totalStudents count in the corresponding section
    const section = await RoomSection.findByPk(sectionId);
    if (section) {
      section.totalStudents += 1;
      await section.save();
    }

    res.status(201).json(newStudent);
  } catch (error) {
    console.error("Error during student addition:", error);
    res.status(500).json({ error: "Student addition failed" });
  }
});

// Route for viewing a student by ID
router.get("/view/:studentId", async (req, res) => {
  try {
    const { studentId } = req.params;

    const student = await Student.findByPk(studentId);

    if (!student) {
      res.status(404).json({ error: "Student not found" });
    } else {
      res.json(student);
    }
  } catch (error) {
    console.error("Error during student view:", error);
    res.status(500).json({ error: "Student retrieval failed" });
  }
});

// Route for editing (updating) a student by ID
router.put("/edit/:studentId", async (req, res) => {
  try {
    const { studentId } = req.params;
    const updatedData = req.body;

    const student = await Student.findByPk(studentId);

    if (!student) {
      res.status(404).json({ error: "Student not found" });
      return;
    }

    await student.update(updatedData);

    res.json(student);
  } catch (error) {
    console.error("Error during student edit:", error);
    res.status(500).json({ error: "Student edit failed" });
  }
});

// Route for deleting a student by ID
router.delete("/delete/:studentId", async (req, res) => {
  try {
    const { studentId } = req.params;

    const deletedStudent = await Student.findByPk(studentId);

    if (!deletedStudent) {
      res.status(404).json({ error: "Student not found" });
    } else {
      const { sectionId } = deletedStudent;

      // Delete the student
      await Student.destroy({ where: { studentId } });

      // Update the totalStudents count in the corresponding section
      const section = await RoomSection.findByPk(sectionId);
      if (section) {
        section.totalStudents -= 1;
        await section.save();
      }

      res.status(204).send();
    }
  } catch (error) {
    console.error("Error during student deletion:", error);
    res.status(500).json({ error: "Student deletion failed" });
  }
});

// Route to get all students for the current teacher
router.get("/students/:sectionId", async (req, res) => {
  try {
    const { sectionId } = req.params;

    const students = await Student.findAll({
      where: { sectionId },
      attributes: ["studentId", "firstname", "lastname", "gender", "username"],
      order: [["lastname", "ASC"]],
    });

    res.json(students);
  } catch (error) {
    console.error("Error getting students for section:", error);
    res.status(500).json({ error: "Failed to get students" });
  }
});

module.exports = router;
