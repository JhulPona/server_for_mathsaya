const { DataTypes } = require("sequelize");
const sequelize = require("../config/sequelize");
const Yunit = require("./YunitModel");
const Sprofile = require("./SprofileModel");

const CompletedUnit = sequelize.define("CompletedUnit", {
  starRating: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  yunitId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
});

CompletedUnit.belongsTo(Yunit, {
  foreignKey: "yunitId",
  onDelete: "CASCADE",
});

CompletedUnit.belongsTo(Sprofile, {
  foreignKey: "studentProfileId",
  onDelete: "CASCADE",
});
module.exports = CompletedUnit;
