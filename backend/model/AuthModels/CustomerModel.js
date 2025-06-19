const { Sequelize, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    const CustomerModel = sequelize.define('customers', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
          },
          address: {
            type: DataTypes.STRING
          },
          t_address: {
            type: DataTypes.STRING,
            
          },
          mobile: { 
            type: DataTypes.STRING,
            allowNull: false,
          },
          whatsapp_no: {
            type: DataTypes.STRING,
            
          },
          alternate_no: {
            type: DataTypes.STRING,
            
          },
          aadhar_no: {
            type: DataTypes.STRING,
            
          },
          other_id: {
            type: DataTypes.STRING,
            
          },
          pan_no: {
            type: DataTypes.STRING,
            
          },
          dob: {
            type: DataTypes.STRING,
            
          },
          doa: {
            type: DataTypes.STRING,
            
          },
          area: {
            type: DataTypes.STRING,
            
          },
          block: {
            type: DataTypes.STRING,
            
          },
          apartment: {
            type: DataTypes.STRING,
            
          },
          bill_date: {
            type: DataTypes.STRING,
            
          },
          image: {
            type: DataTypes.STRING,
            
          },
          cash: {
            type: DataTypes.BIGINT,
            
          },
          online: {
            type: DataTypes.BIGINT,
            
          },
          payment_method: {
            type: DataTypes.STRING,
            
          },
          frontAadharImage: {
            type: DataTypes.STRING,
            
          },
          backAadharImage: {
            type: DataTypes.STRING,
            
          },
          panImage: {
            type: DataTypes.STRING,
            
          },
          otherIdImage: {
            type: DataTypes.STRING,
            
          },
          signature: {
            type: DataTypes.STRING,
          },
          gender: {
            type: DataTypes.STRING,
          },
    }, 
   {
        timestamps: true,
        tableName: 'customers'
    });

    return CustomerModel;
};
