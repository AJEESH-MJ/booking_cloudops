import { bookSlot } from '../services/booking.service.js';
import Booking from '../models/booking.model.js';

export async function createBooking(req, res, next) {
  try {
    const userId = req.user && req.user.id;
    const { netId, date, startAt, endAt, durationMinutes } = req.body;
    if (!userId) return res.status(401).json({ error: 'unauthenticated' });
    const booking = await bookSlot({ userId, netId, date, startAt, endAt, durationMinutes });
    res.status(201).json(booking);
  } catch (err) { next(err); }
}

export async function listMyBookings(req, res, next) {
  try {
    const userId = req.user && req.user.id;
    const bookings = await Booking.find({ user: userId }).populate('net').sort({ startAt: 1 }).lean();
    res.json(bookings);
  } catch (err) { next(err); }
}

export default { createBooking, listMyBookings };
