import mongoose from 'mongoose';
import Slot from '../models/slot.model.js';
import Booking from '../models/booking.model.js';

const SLOT_INTERVAL_MIN = parseInt(
  process.env.SLOT_INTERVAL_MINUTES || '60',
  10
);

export async function findAvailableOptions({
  date,
  durationMinutes,
  nets = [],
}) {
  const slotsNeeded = Math.ceil(durationMinutes / SLOT_INTERVAL_MIN);
  const query = { date, booked: false };
  if (nets.length) query.net = { $in: nets };

  const slots = await Slot.find(query).sort({ net: 1, startAt: 1 }).lean();
  const grouped = {};
  slots.forEach(s => {
    const netId = s.net.toString();
    grouped[netId] = grouped[netId] || [];
    grouped[netId].push(s);
  });

  const options = [];
  Object.keys(grouped).forEach(netId => {
    const list = grouped[netId];
    for (let i = 0; i <= list.length - slotsNeeded; i++) {
      let ok = true;
      for (let k = 1; k < slotsNeeded; k++) {
        if (
          new Date(list[i + k - 1].endAt).getTime() !==
          new Date(list[i + k].startAt).getTime()
        ) {
          ok = false;
          break;
        }
      }
      if (ok) {
        options.push({
          net: netId,
          startAt: list[i].startAt,
          endAt: list[i + slotsNeeded - 1].endAt,
        });
      }
    }
  });
  return options;
}

export async function bookSlot({
  userId,
  netId,
  date,
  startAt,
  endAt,
  durationMinutes,
}) {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const slots = await Slot.find({
      net: netId,
      date,
      startAt: { $gte: new Date(startAt) },
      endAt: { $lte: new Date(endAt) },
      booked: false,
    }).session(session);

    const slotsNeeded = Math.ceil(durationMinutes / SLOT_INTERVAL_MIN);
    if (slots.length < slotsNeeded) throw new Error('Not enough free slots');

    const [booking] = await Booking.create(
      [
        {
          user: userId,
          net: netId,
          date,
          startAt: new Date(startAt),
          endAt: new Date(endAt),
          durationMinutes,
        },
      ],
      { session }
    );

    const update = await Slot.updateMany(
      {
        net: netId,
        date,
        startAt: { $gte: new Date(startAt) },
        endAt: { $lte: new Date(endAt) },
        booked: false,
      },
      {
        $set: { booked: true, booking: booking._id },
      },
      { session }
    );

    // in some versions update.matchedCount may be undefined; use modifiedCount if matchedCount not present
    const matched = update.matchedCount ?? update.modifiedCount ?? 0;
    if (matched < slotsNeeded) throw new Error('Slots conflict');

    await session.commitTransaction();
    session.endSession();
    return booking;
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    throw err;
  }
}
