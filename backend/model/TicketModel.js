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
        allowNull: false,
    },
    timeSlot: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    technician: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    mobileNo: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false,
    }
}, {
    timestamps: true,
    tableName: 'Ticket', // You can specify the table name here
});
return TicketModel;
};