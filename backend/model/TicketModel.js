const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequalize');
module.exports = (sequelize) => {
const TicketModel = sequelize.define('Ticket', {
    ticketType: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    date: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    details: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    timeSlot: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    technician: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    mobileNo: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    status: {
        type: DataTypes.STRING,
        allowNull: true,
    }
}, {
    timestamps: true,
    tableName: 'Ticket', // You can specify the table name here
});
return TicketModel;
};