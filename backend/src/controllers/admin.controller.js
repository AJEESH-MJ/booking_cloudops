import User from '../models/user.model.js';
import Booking from '../models/booking.model.js';
import Net from '../models/nets.model.js';
import Slot from '../models/slot.model.js';

export async function listUsers(req, res, next) {
  try {
    const users = await User.find()
      .select('-passwordHash -refreshToken')
      .lean();
    res.json(users);
  } catch (err) {
    next(err);
  }
}

export async function getUser(req, res, next) {
  try {
    const { id } = req.params;
    const user = await User.findById(id)
      .select('-passwordHash -refreshToken')
      .lean();
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    next(err);
  }
}

export async function listBookings(req, res, next) {
  try {
    const { date, netId, userId } = req.query;
    const q = {};
    if (date) q.date = date;
    if (netId) q.net = netId;
    if (userId) q.user = userId;
    const bookings = await Booking.find(q)
      .populate('user net')
      .sort({ startAt: -1 })
      .lean();
    res.json(bookings);
  } catch (err) {
    next(err);
  }
}

export async function deleteBooking(req, res, next) {
  try {
    const { id } = req.params;
    const bk = await Booking.findByIdAndDelete(id);
    if (!bk) return res.status(404).json({ error: 'Booking not found' });

    // clear booked flags on slots that reference this booking
    await Slot.updateMany(
      { booking: bk._id },
      { $set: { booked: false, booking: null } }
    );

    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
}

/*
 Create slots for a plain list or a range.
 Request body options:
 - netId (required)
 - date (YYYY-MM-DD) and times: either
    - startTime (HH:mm) and endTime (HH:mm) with intervalMinutes (30)
    - OR slots: array of { startAtISO, endAtISO } for explicit slots
*/
export async function createSlots(req, res, next) {
  try {
    const {
      netId,
      date,
      startTime,
      endTime,
      intervalMinutes = 30,
      slots,
    } = req.body;
    if (!netId) return res.status(400).json({ error: 'netId required' });

    const net = await Net.findById(netId);
    if (!net) return res.status(404).json({ error: 'Net not found' });

    const created = [];

    if (Array.isArray(slots) && slots.length) {
      // create explicit slots
      for (const s of slots) {
        const slot = await Slot.updateOne(
          { net: netId, startAt: new Date(s.startAt) },
          {
            $setOnInsert: {
              net: netId,
              date: new Date(s.startAt).toISOString().slice(0, 10),
              startAt: new Date(s.startAt),
              endAt: new Date(s.endAt),
              booked: false,
            },
          },
          { upsert: true }
        );
        created.push(s);
      }
    } else if (date && startTime && endTime) {
      // build slots from range
      const [sh, sm] = startTime.split(':').map(Number);
      const [eh, em] = endTime.split(':').map(Number);
      const base = new Date(`${date}T00:00:00`);
      base.setHours(sh, sm, 0, 0);
      const end = new Date(`${date}T00:00:00`);
      end.setHours(eh, em, 0, 0);
      let ptr = new Date(base);
      while (ptr < end) {
        const s = new Date(ptr);
        const e = new Date(ptr);
        e.setMinutes(e.getMinutes() + Number(intervalMinutes));
        await Slot.updateOne(
          { net: netId, startAt: s },
          {
            $setOnInsert: {
              net: netId,
              date,
              startAt: s,
              endAt: e,
              booked: false,
            },
          },
          { upsert: true }
        );
        created.push({ startAt: s.toISOString(), endAt: e.toISOString() });
        ptr = e;
      }
    } else {
      return res.status(400).json({ error: 'invalid slot creation payload' });
    }

    res.status(201).json({ created });
  } catch (err) {
    next(err);
  }
}

export async function stats(req, res, next) {
  try {
    const totalBookings = await Booking.countDocuments();
    const todays = new Date().toISOString().slice(0, 10);
    const bookingsToday = await Booking.countDocuments({ date: todays });
    const activeNets = await Net.countDocuments({ active: true });
    res.json({ totalBookings, bookingsToday, activeNets });
  } catch (err) {
    next(err);
  }
}
