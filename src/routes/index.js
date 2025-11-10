import express from 'express';
import netsCtrl from '../controllers/nets.controller.js';
import availCtrl from '../controllers/availability.controller.js';
import bookingsCtrl from '../controllers/bookings.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';
import authRoutes from './auth.routes.js';
import adminRoutes from './admin.routes.js';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/admin', adminRoutes);

router.get('/nets', netsCtrl.listNets);
router.post('/nets', authMiddleware.requireAdmin, netsCtrl.createNet);

router.get('/availability', availCtrl.availability);

router.post('/bookings', authMiddleware.requireAuth, bookingsCtrl.createBooking);
router.get('/bookings/me', authMiddleware.requireAuth, bookingsCtrl.listMyBookings);

export default router;
