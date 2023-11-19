const express = require("express");
const router = express.Router();
const { Op } = require("sequelize");
const Sprofile = require("../models/SprofileModel");
const Student = require("../models/StudentModel");
const Yunit = require("../models/YunitModel");
const Lesson = require("../models/LessonModel");
const Exercise = require("../models/ExerciseModel");
const CompletedExercise = require("../models/CompletedExerciseModel");
const CompletedLesson = require("../models/CompletedLessonModel");
const CompletedUnit = require("../models/CompletedUnitModel");

// Student login route
router.post("/login", async (req, res) => {
  const { firstname, lastname, username } = req.body;

  try {
    const student = await Student.findOne({
      where: { firstname, lastname, username },
    });

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    let studentProfile = await Sprofile.findOne({
      where: { studentId: student.studentId },
    });

    const currentDate = new Date();

    if (!studentProfile) {
      // First login, create a profile entry with profileId from StudentModel
      studentProfile = await Sprofile.create({
        studentId: student.studentId,
        profileId: student.profileId, // Use profileId from StudentModel
        firstLoginDate: currentDate,
        teacherId: student.teacherId,
      });

      return res.json({
        message: "First login, profile created",
        profile: studentProfile,
      });
    } else if (!studentProfile.firstLoginDate) {
      // Returning student, firstLoginDate is not set, update it
      await studentProfile.update({ firstLoginDate: currentDate });

      return res.json({
        message: "Returning student, firstLoginDate updated",
        profile: studentProfile,
      });
    } else {
      // Returning student, firstLoginDate is already set, no need to update
      return res.json({
        message: "Returning student, firstLoginDate is already set",
        profile: studentProfile,
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// Route to get the studentProfileId for a selected studentId
router.get("/get-student-profile/:studentId", async (req, res) => {
  const studentId = req.params.studentId;

  try {
    const student = await Student.findByPk(studentId);

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    if (!student.profileId) {
      return res
        .status(404)
        .json({ message: "Profile not found for the student" });
    }

    return res.json({ studentProfileId: student.profileId });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// Get student profile with additional information
router.get("/student-profile/:studentProfileId", async (req, res) => {
  const studentProfileId = req.params.studentProfileId;

  try {
    // Find the student profile based on the provided studentProfileId
    const studentProfile = await Sprofile.findOne({
      where: { profileId: studentProfileId },
    });

    if (!studentProfile) {
      return res.status(404).json({ message: "Student profile not found" });
    }

    // Use the student profile to find the associated student
    const student = await Student.findOne({
      where: { studentId: studentProfile.studentId },
    });

    // Use the student profile to find all completed exercises, lessons, and units
    const completedExercises = await CompletedExercise.findAll({
      where: { studentProfileId },
      include: {
        model: Exercise,
        attributes: ["exerciseTitle"],
      },
    });

    const completedLessons = await CompletedLesson.findAll({
      where: { studentProfileId },
      include: {
        model: Lesson,
        attributes: ["lessonTitle"],
      },
    });

    const completedUnits = await CompletedUnit.findAll({
      where: { studentProfileId },
      include: {
        model: Yunit,
        attributes: ["yunitTitle"],
      },
    });

    // Combine the fetched data into a single object
    const studentProfileWithInfo = {
      studentProfile,
      student,
      completedExercises,
      completedLessons,
      completedUnits,
    };

    return res.json(studentProfileWithInfo);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// Add new CompletedExercise or update if it already exists
router.post("/add-completed-exercise", async (req, res) => {
  try {
    const { exerciseId, starRating, studentProfileId } = req.body;

    const completionTime = new Date();

    // Check if the entry already exists
    const existingEntry = await CompletedExercise.findOne({
      where: { exerciseId, studentProfileId },
    });

    if (existingEntry) {
      // Entry exists, update starRating and completionTime
      await existingEntry.update({ starRating, completionTime });
      return res.json(existingEntry);
    }

    // Entry doesn't exist, create a new entry
    const completedExercise = await CompletedExercise.create({
      exerciseId,
      starRating,
      completionTime: completionTime,
      studentProfileId,
    });

    return res.json(completedExercise);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// Add new CompletedLesson entry or update existing entry
router.post("/add-completed-lesson", async (req, res) => {
  const { lessonId, studentProfileId } = req.body;

  try {
    // Check if an entry with the same lessonId and studentProfileId already exists
    const existingEntry = await CompletedLesson.findOne({
      where: {
        lessonId,
        studentProfileId,
      },
    });

    // Calculate the total starRating for exercises associated with this lesson
    const totalStarRating = await CompletedExercise.sum("starRating", {
      where: {
        studentProfileId,
      },
      include: {
        model: Exercise,
        where: {
          lessonId,
        },
      },
    });

    if (existingEntry) {
      // Entry exists, update the starRating
      await existingEntry.update({ starRating: totalStarRating });
      return res.json(existingEntry);
    } else {
      // Entry doesn't exist, create a new entry
      const completedLesson = await CompletedLesson.create({
        lessonId,
        starRating: totalStarRating,
        studentProfileId,
      });
      return res.json(completedLesson);
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// Add new CompletedUnit entry or update existing entry
router.post("/add-completed-yunit", async (req, res) => {
  const { yunitId, studentProfileId } = req.body;

  try {
    // Check if an entry with the same yunitId and studentProfileId already exists
    const existingEntry = await CompletedUnit.findOne({
      where: {
        yunitId,
        studentProfileId,
      },
    });

    // Calculate the total starRating for lessons associated with this teaching unit (yunit)
    const totalStarRating = await CompletedLesson.sum("starRating", {
      where: {
        studentProfileId,
      },
      include: {
        model: Lesson,
        where: {
          yunitId,
        },
      },
    });

    if (existingEntry) {
      // Entry exists, update the starRating
      await existingEntry.update({ starRating: totalStarRating });
      return res.json(existingEntry);
    } else {
      // Entry doesn't exist, create a new entry
      const completedUnit = await CompletedUnit.create({
        yunitId,
        starRating: totalStarRating,
        studentProfileId,
      });
      return res.json(completedUnit);
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// Add a route to get the entries with the least starRating for exercises, lessons, and units
router.get("/min-ratings/:studentProfileId", async (req, res) => {
  const studentProfileId = req.params.studentProfileId;

  try {
    // Find the exercise with the least starRating
    const minExercise = await CompletedExercise.findOne({
      where: { studentProfileId },
      order: [["starRating", "ASC"]],
      include: {
        model: Exercise,
        attributes: ["exerciseTitle"],
      },
    });

    // Find the lesson with the least starRating
    const minLesson = await CompletedLesson.findOne({
      where: { studentProfileId },
      order: [["starRating", "ASC"]],
      include: {
        model: Lesson,
        attributes: ["lessonTitle"],
      },
    });

    // Find the unit with the least starRating
    const minYunit = await CompletedUnit.findOne({
      where: { studentProfileId },
      order: [["starRating", "ASC"]],
      include: {
        model: Yunit,
        attributes: ["yunitTitle"],
      },
    });

    return res.json({
      minExercise,
      minLesson,
      minYunit,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
