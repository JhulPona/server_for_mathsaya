const express = require("express");
const router = express.Router();
const Teacher = require("../models/TeacherModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

router.post("/signup", async (req, res) => {
  try {
    const { firstname, lastname, email, password, gender } = req.body;

    const existingTeacher = await Teacher.findOne({ where: { email } });
    if (existingTeacher) {
      return res.status(400).json({ error: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newTeacher = await Teacher.create({
      firstname,
      lastname,
      email,
      password: hashedPassword,
      gender,
    });

    const token = jwt.sign({ id: newTeacher.id }, "your-secret-key");

    res.status(201).json({ user: newTeacher, token });
  } catch (error) {
    console.error("Error during teacher signup:", error);
    res.status(500).json({ error: "Teacher signup failed" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const teacher = await Teacher.findOne({ where: { email } });

    if (!teacher) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const passwordMatch = await bcrypt.compare(password, teacher.password);

    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const token = jwt.sign({ id: teacher.id }, "your-secret-key");

    res.status(200).json({ user: teacher, token });
  } catch (error) {
    console.error("Error during teacher login:", error);
    res.status(500).json({ error: "Teacher login failed" });
  }
});

router.put("/edit/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    const teacher = await Teacher.findByPk(id);

    if (!teacher) {
      return res.status(404).json({ error: "Teacher not found" });
    }

    if (updatedData.email && updatedData.email !== teacher.email) {
      const existingTeacher = await Teacher.findOne({
        where: { email: updatedData.email },
      });
      if (existingTeacher) {
        return res.status(400).json({ error: "Email already exists" });
      }
    }

    if (updatedData.password) {
      updatedData.password = await bcrypt.hash(updatedData.password, 10);
    }

    await teacher.update(updatedData);

    res.json(teacher);
  } catch (error) {
    console.error("Error during teacher edit:", error);
    res.status(500).json({ error: "Teacher edit failed" });
  }
});

router.get("/teacher/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const teacher = await Teacher.findByPk(id);

    if (!teacher) {
      return res.status(404).json({ error: "Teacher not found" });
    }

    res.json(teacher);
  } catch (error) {
    console.error("Error during fetching teacher information:", error);
    res.status(500).json({ error: "Fetching teacher information failed" });
  }
});

module.exports = router;
