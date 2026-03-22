const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const AuditLog = sequelize.define('AuditLog', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  document_id: {
    type: DataTypes.UUID,
  },
  user_id: {
    type: DataTypes.UUID,
  },
  action: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  ip_address: {
    type: DataTypes.STRING(50),
  },
  metadata: {
    type: DataTypes.JSONB,
  },
}, {
  tableName: 'audit_logs',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false,
});

module.exports = AuditLog;