// models/CustomerComplaint.js
module.exports = (sequelize, DataTypes) => {
    const CustomerComplaint = sequelize.define("CustomerComplaint", {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
  
      customerId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
  
      subject: {
        type: DataTypes.STRING,
        allowNull: false
      },

      complaintDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      
      assignTo: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      
      description: {
        type: DataTypes.TEXT,
        allowNull: false
      },
  
      category: {
        type: DataTypes.STRING
      },
  
      priority: {
        type: DataTypes.STRING
      },
  
      status: {
        type: DataTypes.STRING,
        defaultValue: "OPEN"
      }
  
    }, {
      tableName: "customer_complaints"
    });
  
    return CustomerComplaint;
  };
  