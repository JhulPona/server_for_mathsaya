const { DataTypes } = require("sequelize");
const sequelize = require("../config/sequelize");
const Exercise = require("./ExerciseModel");
const Sprofile = require("./SprofileModel");

const CompletedExercise = sequelize.define("CompletedExercise", {
  starRating: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  completionTime: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  exerciseId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
});

CompletedExercise.belongsTo(Exercise, {
  foreignKey: "exerciseId",
  onDelete: "CASCADE",
});

CompletedExercise.belongsTo(Sprofile, {
  foreignKey: "studentProfileId",
  onDelete: "CASCADE",
});

module.exports = CompletedExercise;
