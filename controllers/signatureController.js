const { Signature, Document, AuditLog } = require('../models');
const cloudinary = require('../config/cloudinary');

// Submit signature
const createSignature = async (req, res) => {
  try {
    const { document_id, signature_image } = req.body;

    if (!document_id || !signature_image) {
      return res.status(400).json({ message: 'Document ID and signature are required' });
    }

    // Find document
    const document = await Document.findByPk(document_id);
    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }
    if (document.status === 'signed') {
      return res.status(400).json({ message: 'Document already signed' });
    }

    // Upload signature image to Cloudinary
    const uploadResponse = await cloudinary.uploader.upload(signature_image, {
      folder: 'signatures',
      resource_type: 'image',
    });

    // Save signature to DB
    const signature = await Signature.create({
      document_id,
      signer_id: req.user.id,
      signature_image_url: uploadResponse.secure_url,
      ip_address: req.ip,
      otp_verified: false,
    });

    // Update document status to signed
    await document.update({ status: 'signed' });

    // Log action
    await AuditLog.create({
      document_id,
      user_id: req.user.id,
      action: 'signed',
      ip_address: req.ip,
      metadata: { signature_id: signature.id },
    });

    res.status(201).json({
      message: 'Document signed successfully!',
      signature,
    });
  } catch (error) {
    console.error('❌ Signature error:', error);
    res.status(500).json({ message: error.message || 'Failed to save signature' });
  }
};

// Get signatures for a document
const getSignatures = async (req, res) => {
  try {
    const signatures = await Signature.findAll({
      where: { document_id: req.params.document_id },
      order: [['signed_at', 'DESC']],
    });
    res.json({ signatures });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch signatures' });
  }
};

module.exports = { createSignature, getSignatures };