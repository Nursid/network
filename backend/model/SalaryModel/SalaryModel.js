const { Sequelize, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    const SalaryModel = sequelize.define('salary', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        employee_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'employees',
                key: 'id'
            }
        },
        month: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: 1,
                max: 12
            }
        },
        year: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: 2020,
                max: 2050
            }
        },
        amount: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
            validate: {
                min: 0
            }
        },
        remarks: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        is_approved: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        approved_by: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        approved_at: {
            type: DataTypes.DATE,
            allowNull: true
        },
        
    }, {
        timestamps: true,
        tableName: 'salaries',
    });

    return SalaryModel;
}; 