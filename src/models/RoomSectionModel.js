const { DataTypes } = require("sequelize");
const sequelize = require("../config/sequelize");
const Teacher = require("./TeacherModel");

const RoomSection = sequelize.define("RoomSection", {
  sectionId: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  sectionName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  schoolYear: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  teacherId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  totalStudents: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

RoomSection.belongsTo(Teacher, {
  foreignKey: "teacherId",
});

module.exports = RoomSection;
