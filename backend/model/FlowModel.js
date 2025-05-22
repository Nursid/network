const { Sequelize, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    const FlowModel = sequelize.define('flows', {
        name: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        olt_name: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        port: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        data: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        status: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
        }
    }, {
        timestamps: true,
        tableName: 'flows', // You can specify the table name here
    });

    return FlowModel;
};