const {
    DataTypes
} = require('sequelize');

module.exports = (sequelize) => {
    const CustomerReminder = sequelize.define('CustomerReminder', {

        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        customerId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        task: {
            type: DataTypes.STRING,
            allowNull: false
        },
        reminderDate: {
            type: DataTypes.DATE,
            allowNull: false
        },
        status: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },

    }, {
        timestamps: true,
        tableName: 'customer_reminders',
    });

    return CustomerReminder;
};