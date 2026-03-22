const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Signature = sequelize.define('Signature', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  document_id: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  signer_id: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  signature_image_url: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  ip_address: {
    type: DataTypes.STRING(50),
  },
  otp_verified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
}, {
  tableName: 'signatures',
  timestamps: true,
  createdAt: 'signed_at',
  updatedAt: false,
});

module.exports = Signature;