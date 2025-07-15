const {
    DataTypes
} = require('sequelize');

module.exports = (sequelize) => {
    const CustomerComplaint = sequelize.define('CustomerComplaint', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        customerId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        subject: {
            type: DataTypes.STRING,
            allowNull: false
        },
        description: {
            type: DataTypes.TEXT
        },
        status: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    }, {
        timestamps: true,
        tableName: 'customer_complaints',
    });

    return CustomerComplaint;
};