const express = require("express");
const router = express.Router();
const RoomSection = require("../models/RoomSectionModel");
const Student = require("../models/StudentModel");
const Sprofile = require("../models/SprofileModel");
const Exercise = require("../models/ExerciseModel");
const Yunit = require("../models/YunitModel");
const Lesson = require("../models/LessonModel");
const CompletedExercise = require("../models/CompletedExerciseModel");

// Route to get the number of students for each section under a teacherId
router.get("/student-count/:teacherId", async (req, res) => {
  const teacherId = req.params.teacherId;

  try {
    const sections = await RoomSection.findAll({
      where: { teacherId },
    });

    const sectionStudentCounts = [];

    for (const section of sections) {
      const sectionId = section.sectionId;
      const sectionName = section.sectionName;

      const maleCount = await Student.count({
        where: { sectionId, gender: "Lalaki" },
      });

      const femaleCount = await Student.count({
        where: { sectionId, gender: "Babae" },
      });

      // Calculate the total student count for the section
      const totalStudents = maleCount + femaleCount;

      // Create an object with section information and counts
      const sectionInfo = {
        sectionId,
        sectionName,
        totalStudents,
        maleCount,
        femaleCount,
      };

      sectionStudentCounts.push(sectionInfo);
    }

    return res.json(sectionStudentCounts);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// Route to get the createdAt date of every unit entry along with the yunitName
router.get("/unit-created-at/:teacherId", async (req, res) => {
  const teacherId = req.params.teacherId;

  try {
    const unitsInfo = await Yunit.findAll({
      where: { teacherId },
      attributes: ["createdAt", "yunitName"],
    });

    res.json(unitsInfo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Route to get the createdAt date of every lesson entry along with the lessonName
router.get("/lesson-created-at/:teacherId", async (req, res) => {
  const teacherId = req.params.teacherId;

  try {
    const lessonsInfo = await Lesson.findAll({
      where: { teacherId },
      attributes: ["createdAt", "lessonName"],
    });

    res.json(lessonsInfo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Route to get the createdAt date of every exercise entry along with the exercise_name
router.get("/exercise-created-at/:teacherId", async (req, res) => {
  const teacherId = req.params.teacherId;

  try {
    const exercisesInfo = await Exercise.findAll({
      where: { teacherId },
      attributes: ["createdAt", "exercise_name"],
    });

    res.json(exercisesInfo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Route to get the completionTime and exercise_name for every CompletedExercise entry
router.get("/completed-exercises-info", async (req, res) => {
  try {
    const completedExercisesInfo = await CompletedExercise.findAll({
      include: {
        model: Exercise,
        attributes: ["exercise_name"],
      },
      attributes: ["completionTime", "exerciseId"],
    });

    return res.json(completedExercisesInfo);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// Route to get the firstLoginDate, firstname, and lastname for every student profile entry for a specific teacherId
router.get("/student-profiles-info/:teacherId", async (req, res) => {
  const teacherId = req.params.teacherId;

  try {
    const studentProfilesInfo = await Sprofile.findAll({
      include: {
        model: Student,
        attributes: ["firstname", "lastname"],
        where: { teacherId },
      },
      attributes: ["firstLoginDate", "studentId"],
    });

    return res.json(studentProfilesInfo);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
