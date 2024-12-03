const { Sequelize, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const  TicketHead = sequelize.define('tiketHeads', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    shortCode: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    connectionType: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    Type: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    TAT: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },{
    timestamps: true,
    tableName: "tiketHeads"
  }
  );

  return TicketHead;
};
