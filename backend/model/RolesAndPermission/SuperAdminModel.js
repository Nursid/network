const { Sequelize, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const SuperAdminRolesModel = sequelize.define('super_admin_roles', {
    role: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    Dashboard: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    MonthlyService: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    Attendence: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    Availability: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    Tickets: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    AttendenceEmployee: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    AttendenceServiceProvider: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    AttendenceReport: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    AttendenceModify: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },  
    AccountTransaction: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    PaymentPending: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    CollectionTally: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    AllTransaction: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    ManageHR: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    ManageEmployee: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    ManageServiceProvider: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    ManageMonthService: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    ManageService: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    ManagePage: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    ManageTestimonial: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    ManageOffer: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    ManagePost: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    ManageAdvertisement: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    Customer: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    ManageCustomer: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    ManageHistory: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    MonthlyMembers: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    ManageEnquiry: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    OrderReports: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    RolesAndPermission: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    Profile: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    Network: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    Inventory: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
  },
  {
    timestamps: true,
    tableName: "super_admin_roles",
  }
  );

  return SuperAdminRolesModel;
};
