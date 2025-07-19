module.exports = (sequelize, DataTypes) => {
	const CustomerPlanHistory = sequelize.define('customer_plan_history', {
		customer_id: {
			type: DataTypes.STRING,
			allowNull: false
		},
		plan_id: {
			type: DataTypes.INTEGER,
			allowNull: false
		},
		plan_name: {
			type: DataTypes.STRING,
			allowNull: true
		},
		amount: {
			type: DataTypes.DECIMAL(10, 2),
			allowNull: true
		},
		recharge_date: {
			type: DataTypes.DATEONLY,
			defaultValue: DataTypes.NOW
		},
		valid_from: {
			type: DataTypes.DATEONLY,
			allowNull: false
		},
		valid_till: {
			type: DataTypes.DATEONLY,
			allowNull: false
		},
		recharge_days: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
		remarks: {
			type: DataTypes.TEXT,
			allowNull: true
		}
	}, {
		timestamps: true,
		tableName: 'customer_plan_history'
	});

	return CustomerPlanHistory;
};
