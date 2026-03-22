const User = require('./User');
const Document = require('./Document');
const Signature = require('./Signature');
const AuditLog = require('./AuditLog');

// Associations
User.hasMany(Document, { foreignKey: 'owner_id' });
Document.belongsTo(User, { foreignKey: 'owner_id' });

Document.hasMany(Signature, { foreignKey: 'document_id' });
Signature.belongsTo(Document, { foreignKey: 'document_id' });

User.hasMany(Signature, { foreignKey: 'signer_id' });
Signature.belongsTo(User, { foreignKey: 'signer_id' });

Document.hasMany(AuditLog, { foreignKey: 'document_id' });
AuditLog.belongsTo(Document, { foreignKey: 'document_id' });

module.exports = { User, Document, Signature, AuditLog };