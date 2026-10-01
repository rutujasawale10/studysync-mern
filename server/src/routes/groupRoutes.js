const express = require('express');
const router = express.Router();
const {
  getGroups,
  getGroupById,
  createGroup,
  joinGroup,
  updateNotes,
  leaveGroup,
  deleteGroup
} = require('../controllers/groupController');
const { protect } = require('../middleware/auth');

// Public routes (Students can view directory and group details)
router.get('/', getGroups);
router.get('/:id', getGroupById);

// Protected routes (Require login)
router.post('/', protect, createGroup);
router.post('/:id/join', protect, joinGroup);
router.put('/:id/notes', protect, updateNotes);
router.post('/:id/leave', protect, leaveGroup);
router.delete('/:id', protect, deleteGroup);

module.exports = router;
