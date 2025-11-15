import moment from 'moment';
import Net from '../models/nets.model.js';
import Slot from '../models/slot.model.js';

const SLOT_DAYS_AHEAD = parseInt(process.env.SLOT_DAYS_AHEAD || '30', 10);
const SLOT_INTERVAL_MIN = parseInt(
  process.env.SLOT_INTERVAL_MINUTES || '60',
  10
);
const BUSINESS_START = process.env.BUSINESS_START || '06:00';
const BUSINESS_END = process.env.BUSINESS_END || '22:00';

function timeParts(t) {
  const [hh, mm] = t.split(':').map(Number);
  return { hh, mm };
}

export async function generateSlotsForNet(net, daysAhead = SLOT_DAYS_AHEAD) {
  const { hh: startH, mm: startM } = timeParts(BUSINESS_START);
  const { hh: endH, mm: endM } = timeParts(BUSINESS_END);

  for (let d = 0; d < daysAhead; d++) {
    const date = moment().add(d, 'days').format('YYYY-MM-DD');
    const ptr = moment(date).hour(startH).minute(startM).second(0);
    const endOfDay = moment(date).hour(endH).minute(endM).second(0);

    while (ptr.isBefore(endOfDay)) {
      const startAt = ptr.toDate();
      const endAt = ptr.clone().add(SLOT_INTERVAL_MIN, 'minutes').toDate();

      try {
        // upsert (create only if not exists)
        // Using updateOne with upsert to avoid duplicates

        await Slot.updateOne(
          { net: net._id, date, startAt },
          {
            $setOnInsert: { net: net._id, date, startAt, endAt, booked: false },
          },
          { upsert: true }
        );
      } catch (err) {
        // ignore unique conflicts
      }
      ptr.add(SLOT_INTERVAL_MIN, 'minutes');
    }
  }
}

export async function generateSlotsForAllNets(daysAhead = SLOT_DAYS_AHEAD) {
  const nets = await Net.find({ active: true });
  for (const n of nets) {
    await generateSlotsForNet(n, daysAhead);
  }
}
