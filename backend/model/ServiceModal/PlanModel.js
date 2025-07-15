const { Sequelize, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const PlanModel = sequelize.define('plans', {
    connectionType: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    plan: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    code: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    basePrice: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    finalPrice: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    days: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },{
    timestamps: true,
    tableName: "plans"
  }
  
  );

  return PlanModel;
};
