const { DataTypes } = require("sequelize");
const sequelize = require("../config/sequelize");
const Lesson = require("./LessonModel");
const Sprofile = require("./SprofileModel");

const CompletedLesson = sequelize.define("CompletedLesson", {
  starRating: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  lessonId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
});

CompletedLesson.belongsTo(Lesson, {
  foreignKey: "lessonId",
  onDelete: "CASCADE",
});

CompletedLesson.belongsTo(Sprofile, {
  foreignKey: "studentProfileId",
  onDelete: "CASCADE",
});
module.exports = CompletedLesson;
