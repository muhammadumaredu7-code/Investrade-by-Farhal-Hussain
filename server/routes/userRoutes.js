import express from 'express';
import {
    deleteCurrentUser,
    deleteUserById,
    getCurrentUser,
    getUserById,
    listUsers,
    registerUser,
    updateCurrentUser,
    updateUserById
} from '../controller/userController.js';
import { adminAuth, requireUserProfile, userAuth } from '../middleware/Auth.js';

const router = express.Router();

router.post('/register', registerUser);

router.use(userAuth);

router.get('/me', requireUserProfile, getCurrentUser);
router.patch('/me', requireUserProfile, updateCurrentUser);
router.delete('/me', requireUserProfile, deleteCurrentUser);

router.get('/', adminAuth, listUsers);
router.get('/:userId', adminAuth, getUserById);
router.patch('/:userId', adminAuth, updateUserById);
router.delete('/:userId', adminAuth, deleteUserById);

export default router;