const { DataTypes } = require("sequelize");
const sequelize = require("../config/sequelize");
const Exercise = require("./ExerciseModel");
const { v4: uuidv4 } = require("uuid");

const Question = sequelize.define("Question", {
  questionId: {
    type: DataTypes.UUID,
    defaultValue: () => uuidv4(),
    primaryKey: true,
  },
  question_text: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  questionImage: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  answer_choices: {
    type: DataTypes.JSON,
    allowNull: false,
  },
  correct_answer: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  exerciseId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
});

Question.belongsTo(Exercise, {
  foreignKey: "exerciseId",
  onDelete: "CASCADE",
});

module.exports = Question;
