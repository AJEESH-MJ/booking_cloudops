import { findAvailableOptions } from '../services/booking.service.js';

export async function availability(req, res, next) {
  try {
    const { date, duration, netIds } = req.query;
    if (!date || !duration)
      return res.status(400).json({ error: 'date and duration required' });
    const nets = netIds ? (Array.isArray(netIds) ? netIds : [netIds]) : [];
    const opts = await findAvailableOptions({
      date,
      durationMinutes: parseInt(duration, 10),
      nets,
    });
    res.json(opts);
  } catch (err) {
    next(err);
  }
}

export default { availability };
