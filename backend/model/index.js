const dbConfig = require("../config/db");
const { Sequelize, DataTypes } = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  operationsAliases: false,
  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle,
  },
});
sequelize
  .authenticate()
  .then(() => {
    console.log("connected ....");
  })
  .catch((error) => {
    console.log("Error" + error);
  });

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.AdminModel = require("./AuthModels/AdminModel")(sequelize, DataTypes);
db.CustomerModel=require("./AuthModels/CustomerModel")(sequelize, DataTypes);
db.EmployeeModel=require("./AuthModels/EmployeeModel")(sequelize,DataTypes);
db.ServiceProviderModel=require("./AuthModels/ServiceProviderModel")(sequelize,DataTypes);
db.AdminRolesModel=require("./RolesAndPermission/AdminRolesModel")(sequelize,DataTypes)
db.SuperAdminRolesModel=require("./RolesAndPermission/SuperAdminModel")(sequelize,DataTypes);
db.ServiceModel=require("./ServiceModal/ServiceModal")(sequelize, DataTypes);
db.VerifyModel=require("./VerifyModel")(sequelize, DataTypes);
db.DepartmentsModel=require("./AuthModels/DepartmentsModel")(sequelize, DataTypes);
db.DesignationModel=require("./AuthModels/DesignationModel")(sequelize, DataTypes);
db.InventoryModel=require("./inventories")(sequelize,DataTypes);
db.AllotedItemsModel=require("./AllotedItemsModel")(sequelize,DataTypes);
db.Account= require("./AccountModel")(sequelize,DataTypes);
db.TimeSlotModel = require("./TimeSlotModel")(sequelize, DataTypes)
db.TicketModel = require("./TicketModel")(sequelize, DataTypes)
db.FlowModel = require("./FlowModel")(sequelize, DataTypes)


db.SupervisorAttendance = require("./AttendanceModels/SupervisorAttendance")(sequelize, DataTypes)

db.ServiceProviderAttendance = require("./AttendanceModels/ServiceProviderAttendance")(sequelize, DataTypes)
db.PlanModel = require("./ServiceModal/PlanModel")(sequelize, DataTypes)
db.TicketHead = require("./ServiceModal/TicketHead")(sequelize, DataTypes)
db.SalaryModel = require("./SalaryModel/SalaryModel")(sequelize, DataTypes)


db.SupervisorAttendance.belongsTo(db.EmployeeModel, { foreignKey: 'emp_id', targetKey: 'emp_id' });
db.ServiceProviderAttendance.belongsTo(db.ServiceProviderModel, { foreignKey: 'servp_id', targetKey: 'id'});


db.EmployeeModel.belongsTo(db.DepartmentsModel,{foreignKey: 'department_id'});
db.EmployeeModel.belongsTo(db.DesignationModel,{foreignKey: 'designation_id'});


db.TicketModel.belongsTo(db.CustomerModel, { foreignKey: 'mobileNo', targetKey: 'mobile' });

db.TicketModel.belongsTo(db.ServiceProviderModel, { foreignKey: 'technician', targetKey: 'id' });

// Salary model associations
// db.SalaryModel.belongsTo(db.EmployeeModel, { foreignKey: 'employee_id', as: 'employee' });


db.sequelize.sync({ force: false }).then(() => {
  console.log("re-sync done!");
});

module.exports = db;
