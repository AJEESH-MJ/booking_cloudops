import express from 'express';
import * as adminCtrl from '../controllers/admin.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(authMiddleware.requireAdmin);

// users
router.get('/users', adminCtrl.listUsers);
router.get('/users/:id', adminCtrl.getUser);

// bookings
router.get('/bookings', adminCtrl.listBookings);
router.delete('/bookings/:id', adminCtrl.deleteBooking);

// slots
router.post('/slots', adminCtrl.createSlots);

// stats
router.get('/stats', adminCtrl.stats);

export default router;
