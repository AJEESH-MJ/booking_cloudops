import Net from '../models/nets.model.js';
import { generateSlotsForNet } from '../utils/slotGenerator.js'; 

export async function listNets(req, res, next) {
  try {
    const nets = await Net.find().lean();
    res.json(nets);
  } catch (err) {
    next(err);
  }
}

export async function createNet(req, res, next) {
  try {
    const net = await Net.create(req.body);

    generateSlotsForNet(net, parseInt(process.env.SLOT_DAYS_AHEAD || '30', 10))
      .then(created => {
        console.log(`generateSlotsForNet: created ${created.length} slots for net ${net._id}`);
      })
      .catch(err => {
        console.error('generateSlotsForNet error:', err);
      });

    // respond immediately
    res.status(201).json(net);
  } catch (err) {
    next(err);
  }
}

export default { listNets, createNet };
