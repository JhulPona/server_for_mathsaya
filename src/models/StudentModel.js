const { DataTypes } = require("sequelize");
const sequelize = require("../config/sequelize");
const RoomSection = require("./RoomSectionModel");
const { v4: uuidv4 } = require("uuid");

const Student = sequelize.define("Student", {
  studentId: {
    type: DataTypes.UUID,
    defaultValue: () => uuidv4(),
    primaryKey: true,
  },
  firstname: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  lastname: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  gender: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  sectionId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  teacherId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  profileId: {
    type: DataTypes.UUID,
  },
});

Student.belongsTo(RoomSection, {
  foreignKey: "sectionId",
  onDelete: "CASCADE",
});

module.exports = Student;
