// models/ComplaintTask.js
module.exports = (sequelize, DataTypes) => {
    const ComplaintTask = sequelize.define("ComplaintTask", {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
  
      complaintId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
  
      title: {
        type: DataTypes.STRING,
        allowNull: false
      },
  
      description: {
        type: DataTypes.TEXT
      },
  
      taskType: {
        type: DataTypes.STRING
      },
  
      taskAssignTo: {
        type: DataTypes.STRING
      },
  
      dueDate: {
        type: DataTypes.DATE
      },
  
      status: {
        type: DataTypes.STRING,
        defaultValue: "PENDING"
      }
  
    }, {
      tableName: "complaint_tasks"
    });  
    return ComplaintTask;
  };
  