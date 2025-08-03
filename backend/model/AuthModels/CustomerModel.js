const { Sequelize, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    const CustomerModel = sequelize.define('customers', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        customer_id: {
            type: DataTypes.STRING(20),
            allowNull: true,
            unique: true
        },
        
        // Step 1: Basic Information
        name: {
            type: DataTypes.STRING(200),
            allowNull: false,
        },
        username: {
            type: DataTypes.STRING(50),
            allowNull: false,
            unique: true
        },
        gender: {
            type: DataTypes.ENUM('Male', 'Female', 'other'),
            allowNull: true,
        },
        address: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        installation_address: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
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
        email: {
            type: DataTypes.STRING(100),
            allowNull: true,
            validate: {
                isEmail: true
            }
        },
        
        // Step 2: Package Selection
        selected_package: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'plans',
                key: 'id'
            }
        },
        other_services: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        
        // Step 3: Inventory Items & KYC Records
        inventory_items: {
            type: DataTypes.TEXT,
            allowNull: true,
            get() {
                const rawValue = this.getDataValue('inventory_items');
                return rawValue ? JSON.parse(rawValue) : [];
            },
            set(value) {
                this.setDataValue('inventory_items', JSON.stringify(value));
            }
        },
        dob: {
            type: DataTypes.DATEONLY,
            allowNull: true,
        },
        doa: {
            type: DataTypes.DATEONLY,
            allowNull: true,
        },
        aadhar_card: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        pan_card: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        photo: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        
        // Step 4: Billing Details
        billing_amount: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: true,
            validate: {
                min: 0,
                max: 999999.99
            }
        },
        billing_cycle: {
            type: DataTypes.INTEGER,
            allowNull: true,
            defaultValue: 1,
        },
        other_charges: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: true,
        },
        previous_dues: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: true,
        },
        start_date: {
            type: DataTypes.DATEONLY,
            allowNull: true,
        },
        end_date: {
            type: DataTypes.DATEONLY,
            allowNull: true,
        },
        received_amount: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: true,
            defaultValue: 0,
        },
        received_date: {
            type: DataTypes.DATEONLY,
            allowNull: true,
        },
        discount: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: true,
        },
        payment_method: {
            type: DataTypes.ENUM('Cash', 'Online', 'Cheque', 'UPI'),
            allowNull: true,
        },
        
        // Legacy fields for backward compatibility
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
        bill_date: {
            type: DataTypes.DATEONLY,
            allowNull: true,
        },
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
        expiry_date: {
            type: DataTypes.DATEONLY,
            allowNull: true,
        },
        balance: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: true,
            defaultValue: 0,
        },
        cash: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: true,
        },
        online: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: true,
        },
    }, 
    {
        timestamps: true,
        tableName: 'customers',
    });

    return CustomerModel;
};


