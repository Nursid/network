const { Sequelize, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    const CustomerModel = sequelize.define('customers', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
          },
          user_id: {
            type: DataTypes.BIGINT,
            allowNull: true
          },
          address: {
            type: DataTypes.STRING,
            allowNull: true
          },
          t_address: {
            type: DataTypes.STRING,
            allowNull: true
          },
          mobile: {
            type: DataTypes.STRING,
            allowNull: true
          },
          whatsapp_no: {
            type: DataTypes.STRING,
            allowNull: true
          },
          alternate_no: {
            type: DataTypes.STRING,
            allowNull: true
          },
          aadhar_no: {
            type: DataTypes.STRING,
            allowNull: true
          },
          other_id: {
            type: DataTypes.STRING,
            allowNull: true
          },
          pan_no: {
            type: DataTypes.STRING,
            allowNull: true
          },
          dob: {
            type: DataTypes.STRING,
            allowNull: true
          },
          doa: {
            type: DataTypes.STRING,
            allowNull: true
          },
          area: {
            type: DataTypes.STRING,
            allowNull: true
          },
          block: {
            type: DataTypes.STRING,
            allowNull: true
          },
          apartment: {
            type: DataTypes.STRING,
            allowNull: true
          },
          bill_date: {
            type: DataTypes.STRING,
            allowNull: true
          },
          image: {
            type: DataTypes.STRING,
            allowNull: true
          },
          cash: {
            type: DataTypes.BIGINT,
            allowNull: true
          },
          online: {
            type: DataTypes.BIGINT,
            allowNull: true
          },
          payment_method: {
            type: DataTypes.STRING,
            allowNull: true
          },
          front_aadhar_image: {
            type: DataTypes.STRING,
            allowNull: true
          },
          back_aadhar_image: {
            type: DataTypes.STRING,
            allowNull: true
          },
          pan_image: {
            type: DataTypes.STRING,
            allowNull: true
          },
          other_id_image: {
            type: DataTypes.STRING,
            allowNull: true
          },
          signature: {
            type: DataTypes.STRING,
            allowNull: true
          },
    }, 
   {
        timestamps: true,
        tableName: 'customers'
    });

    return CustomerModel;
};
