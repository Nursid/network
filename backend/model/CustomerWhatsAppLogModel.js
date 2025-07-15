const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const CustomerWhatsAppLog = sequelize.define('CustomerWhatsAppLog', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        customer_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'customers',
                key: 'id'
            }
        },
        phone_number: {
            type: DataTypes.STRING,
            allowNull: false
        },
        message_type: {
            type: DataTypes.ENUM('payment_reminder', 'payment_confirmation', 'service_update', 'promotional', 'support', 'other'),
            allowNull: false,
            defaultValue: 'payment_reminder'
        },
        message_content: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        template_used: {
            type: DataTypes.STRING,
            allowNull: true
        },
        status: {
            type: DataTypes.ENUM('pending', 'sent', 'delivered', 'read', 'failed'),
            allowNull: false,
            defaultValue: 'pending'
        },
        sent_at: {
            type: DataTypes.DATE,
            allowNull: true
        },
        delivered_at: {
            type: DataTypes.DATE,
            allowNull: true
        },
        read_at: {
            type: DataTypes.DATE,
            allowNull: true
        },
        error_message: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        sent_by: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'admins',
                key: 'id'
            }
        },
        whatsapp_message_id: {
            type: DataTypes.STRING,
            allowNull: true
        },
        retry_count: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        scheduled_at: {
            type: DataTypes.DATE,
            allowNull: true
        }
    }, {
        timestamps: true,
        tableName: 'customer_whatsapp_logs',
        indexes: [
            {
                fields: ['customer_id']
            },
            {
                fields: ['phone_number']
            },
            {
                fields: ['status']
            },
            {
                fields: ['sent_at']
            },
            {
                fields: ['message_type']
            }
        ]
    });

    return CustomerWhatsAppLog;
}; 