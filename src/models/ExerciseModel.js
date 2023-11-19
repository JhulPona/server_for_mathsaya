const { DataTypes } = require("sequelize");
const sequelize = require("../config/sequelize");
const Lesson = require("./LessonModel");
const { v4: uuidv4 } = require("uuid");

const Exercise = sequelize.define("Exercise", {
  exerciseId: {
    type: DataTypes.UUID,
    defaultValue: () => uuidv4(),
    primaryKey: true,
  },
  exerciseTitle: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  exercise_number: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  exercise_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  exercise_description: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  lessonId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  teacherId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

Exercise.belongsTo(Lesson, {
  foreignKey: "lessonId",
  onDelete: "CASCADE",
});

module.exports = Exercise;
