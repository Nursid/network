const { Sequelize, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    const Account = sequelize.define('accounts', {
        person_name: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        about_payment: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        type_payment: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
        },
        total_amount: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        online: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        cash: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        date: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        payment_mode: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        transection_id: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        order_no: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        balance: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        approve: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
        },
        remark: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        expense_remark: {
            type: DataTypes.STRING,
            allowNull: true,
        },

    }, {
        timestamps: true,
        tableName: 'accounts',
    });
    return Account;
};