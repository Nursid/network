const { Sequelize, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    const CustomerModel = sequelize.define('customers', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        // Basic Information
        name: {
            type: DataTypes.STRING(200),
            allowNull: false,
        },
        username: {
            type: DataTypes.STRING(50),
            allowNull: false,
            unique: true
        },
        email: {
            type: DataTypes.STRING(100),
            allowNull: true,
            validate: {
                isEmail: true
            }
        },
        gender: {
            type: DataTypes.ENUM('Male', 'Female', 'other'),
            allowNull: true,
        },
        // Address Information
        address: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        t_address: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        area: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        block: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        apartment: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        // Contact Information
        mobile: { 
            type: DataTypes.STRING(10),
            allowNull: false,
            validate: {
                len: [10, 10],
                isNumeric: true
            }
        },
        whatsapp_no: {
            type: DataTypes.STRING(10),
            allowNull: true,
            validate: {
                len: [10, 10],
                isNumeric: true
            }
        },
        alternate_no: {
            type: DataTypes.STRING(10),
            allowNull: true,
            validate: {
                len: [10, 10],
                isNumeric: true
            }
        },
        // Personal Information
        dob: {
            type: DataTypes.DATEONLY,
            allowNull: true,
        },
        doa: {
            type: DataTypes.DATEONLY,
            allowNull: true,
        },
        // KYC Information
        aadhar_no: {
            type: DataTypes.STRING(12),
            allowNull: true,
            validate: {
                len: [12, 12],
                isNumeric: true
            }
        },
        other_id: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        pan_no: {
            type: DataTypes.STRING(10),
            allowNull: true,
            validate: {
                len: [10, 10],
                is: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/
            }
        },
        // Package Information
        selectedPackage: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'plans',
                key: 'id'
            }
        },
        packageDetails: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        // Inventory Items (JSON string)
        selectedItems: {
            type: DataTypes.TEXT,
            allowNull: true,
            get() {
                const rawValue = this.getDataValue('selectedItems');
                return rawValue ? JSON.parse(rawValue) : [];
            },
            set(value) {
                this.setDataValue('selectedItems', JSON.stringify(value));
            }
        },
        // Billing Information
        bill_date: {
            type: DataTypes.DATEONLY,
            allowNull: true,
        },
        billing_amount: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: true,
            validate: {
                min: 0,
                max: 999999.99
            }
        },
        payment_method: {
            type: DataTypes.ENUM('Cash', 'Online', 'Cheque', 'UPI'),
            allowNull: true,
        },
        // Image/Document Fields
        image: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        frontAadharImage: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        backAadharImage: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        panImage: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        otherIdImage: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        signature: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        // Status and Metadata
        status: {
            type: DataTypes.ENUM('active', 'inactive', 'suspended'),
            defaultValue: 'active',
        },
        customerType: {
            type: DataTypes.ENUM('individual', 'business'),
            defaultValue: 'individual',
        },
        registrationDate: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
    }, 
    {
        timestamps: true,
        tableName: 'customers',
    });

    return CustomerModel;
};

