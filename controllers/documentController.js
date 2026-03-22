const { Document, AuditLog } = require('../models');
const cloudinary = require('../config/cloudinary');
const { hashBuffer } = require('../utils/hashDocument');

// GET all documents for logged-in user
const getDocuments = async (req, res) => {
  try {
    const documents = await Document.findAll({
      where: { owner_id: req.user.id },
      order: [['created_at', 'DESC']],
    });
    res.json({ documents });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch documents' });
  }
};

// GET single document
const getDocument = async (req, res) => {
  try {
    const doc = await Document.findOne({ where: { id: req.params.id } });
    if (!doc) return res.status(404).json({ message: 'Document not found' });
    res.json({ document: doc });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch document' });
  }
};

// CREATE document with file upload
const createDocument = async (req, res) => {
  try {
    const { title, description, signer_email, expires_at } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: 'PDF file is required' });
    }
    if (!title) {
      return res.status(400).json({ message: 'Title is required' });
    }

    // Get file URL from Cloudinary
    const firebase_url = req.file.path;

    // Generate hash from file buffer
    const sha256_hash = hashBuffer(req.file.buffer || Buffer.from(req.file.filename));

    const document = await Document.create({
      owner_id: req.user.id,
      title,
      description,
      firebase_url,
      sha256_hash,
      signer_email,
      expires_at: expires_at || null,
      status: 'pending',
    });

    await AuditLog.create({
      document_id: document.id,
      user_id: req.user.id,
      action: 'uploaded',
      ip_address: req.ip,
      metadata: { title },
    });

    res.status(201).json({ message: 'Document uploaded successfully', document });
  } catch (error) {
    console.error('❌ Create document error FULL:', error);
    res.status(500).json({ message: error.message || 'Failed to create document' });
  }
};

// DELETE document
const deleteDocument = async (req, res) => {
  try {
    const doc = await Document.findOne({
      where: { id: req.params.id, owner_id: req.user.id },
    });
    if (!doc) return res.status(404).json({ message: 'Document not found' });
    await doc.destroy();
    res.json({ message: 'Document deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete document' });
  }
};

// UPDATE status
const updateDocumentStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const doc = await Document.findByPk(req.params.id);
    if (!doc) return res.status(404).json({ message: 'Document not found' });
    await doc.update({ status });
    res.json({ message: 'Status updated', document: doc });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update status' });
  }
};

module.exports = { getDocuments, getDocument, createDocument, deleteDocument, updateDocumentStatus };