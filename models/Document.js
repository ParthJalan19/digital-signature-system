const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Document = sequelize.define('Document', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  owner_id: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  title: {
    type: DataTypes.STRING(200),
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
  },
  firebase_url: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  sha256_hash: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  blockchain_tx_hash: {
    type: DataTypes.TEXT,
  },
  status: {
    type: DataTypes.ENUM('pending', 'signed', 'rejected', 'expired'),
    defaultValue: 'pending',
  },
  signer_email: {
    type: DataTypes.STRING(100),
  },
  expires_at: {
    type: DataTypes.DATE,
  },
}, {
  tableName: 'documents',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false,
});

module.exports = Document;