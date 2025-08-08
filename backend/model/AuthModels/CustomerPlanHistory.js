module.exports = (sequelize, DataTypes) => {
	const CustomerPlanHistory = sequelize.define('customer_plan_history', {
			id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
			customer_id: {
				type: DataTypes.INTEGER,
				allowNull: false
			},
			plan_id: {
				type: DataTypes.INTEGER,
				allowNull: false
			},
			start_date: { type: DataTypes.DATEONLY, allowNull: false },
			end_date: { type: DataTypes.DATEONLY, allowNull: false },
			billing_amount: { type: DataTypes.DECIMAL(10, 2), allowNull: true },
		discount: { type: DataTypes.DECIMAL(10, 2), allowNull: true },
		paid_amount: { type: DataTypes.DECIMAL(10, 2), allowNull: true },
		due_amount: { type: DataTypes.DECIMAL(10, 2), allowNull: true },
		payment_method: {
			type: DataTypes.ENUM('Cash', 'Online', 'Cheque', 'UPI'),
			allowNull: true
		},
		status: {
			type: DataTypes.ENUM('active', 'expired'),
			defaultValue: 'active',
		}
	}, {
		timestamps: true,
		tableName: 'customer_plan_history'
	});

	return CustomerPlanHistory;
};
