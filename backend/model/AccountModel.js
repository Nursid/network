const { Sequelize, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    const Account = sequelize.define('accounts', {
        date: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        cust_id: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        cust_name: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        vc_no: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        address: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        amount: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: true,
        },
        payment_mode: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        balance: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: true,
        },
        trans_id: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        partner_emp_id: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        auto_renew: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
            defaultValue: false,
        },
        recharge_status: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        recharge_days: {
            type: DataTypes.INTEGER,
            allowNull: true,
          },
          valid_till: {
            type: DataTypes.DATEONLY,
            allowNull: true,
          },
          collected_by: {
            type: DataTypes.INTEGER,
            allowNull: true,
          }
          
    }, {
        timestamps: true,
        tableName: 'accounts',
    });
    return Account;
};