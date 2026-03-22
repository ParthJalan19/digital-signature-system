const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');
const {
  getDocuments, getDocument,
  createDocument, deleteDocument, updateDocumentStatus
} = require('../controllers/documentController');

router.get('/', protect, getDocuments);
router.get('/:id', protect, getDocument);

router.post('/', protect, (req, res, next) => {
  upload.single('file')(req, res, (err) => {
    if (err) {
      console.error('❌ Multer/Cloudinary Upload Error:', err.message);
      return res.status(500).json({ message: err.message });
    }
    next();
  });
}, createDocument);

router.delete('/:id', protect, deleteDocument);
router.patch('/:id/status', protect, updateDocumentStatus);

module.exports = router;