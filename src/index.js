const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const sequelize = require("./config/sequelize");
const path = require("path");
const teachersRouter = require("./routes/teachers");
const sectionsRouter = require("./routes/sections");
const studentsRouter = require("./routes/students");
const sprofileRouter = require("./routes/sprofiles");
const dashboardRouter = require("./routes/dashboard");
const yunitsRouter = require("./routes/yunits");
const lessonsRouter = require("./routes/lessons");
const exercisesRouter = require("./routes/exercises");
const questionsRouter = require("./routes/questions");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

const corsOptions = {
  origin: "https://mathsaya-client.vercel.app",
  methods: "GET,PUT,POST,DELETE",
  credentials: true,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));

app.options("*", (req, res) => {
  console.log("Handling preflight request");
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  res.header("Access-Control-Allow-Credentials", "true");
  res.status(200).send();
});

app.use(bodyParser.json());

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/teachers", teachersRouter);
app.use("/sections", sectionsRouter);
app.use("/students", studentsRouter);
app.use("/sprofile", sprofileRouter);
app.use("/dashboard", dashboardRouter);
app.use("/yunits", yunitsRouter);
app.use("/lessons", lessonsRouter);
app.use("/exercises", exercisesRouter);
app.use("/questions", questionsRouter);

sequelize
  .sync({ force: false }) // Use { force: true } during development to drop and recreate tables
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Unable to connect to the database:", error);
  });
