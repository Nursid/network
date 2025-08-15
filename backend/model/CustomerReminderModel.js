const {
    DataTypes
} = require('sequelize');

module.exports = (sequelize) => {
    const CustomerReminder = sequelize.define('reminder', {

        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        customer_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        reminder_date: {
            type: DataTypes.STRING,
            allowNull: false
        },
        note: {
            type: DataTypes.STRING,
            allowNull: false
        },
        reminder_type: {
            type: DataTypes.STRING,
            allowNull: false
        },
        created_by: {
            type: DataTypes.STRING,
            allowNull: false
        },

    }, {
        timestamps: true,
        tableName: 'reminders',
    });

    return CustomerReminder;
};