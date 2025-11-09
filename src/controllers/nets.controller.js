import Net from '../models/nets.model.js';

export async function listNets(req, res, next) {
  try {
    const nets = await Net.find().lean();
    res.json(nets);
  } catch (err) { next(err); }
}

export async function createNet(req, res, next) {
  try {
    const net = await Net.create(req.body);
    res.status(201).json(net);
  } catch (err) { next(err); }
}

export default { listNets, createNet };
