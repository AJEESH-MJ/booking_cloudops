import 'dotenv/config';
import mongoose from 'mongoose';
import { generateSlotsForAllNets } from './slotGenerator.js';
import './config/database.js';

// Run slot generation
async function runSlotGen() {
  try {
    await generateSlotsForAllNets();
    console.log('🎯 Slot generation complete');
  } catch (err) {
    console.error('❌ Slot generation failed:', err);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 MongoDB disconnected');
    process.exit(0);
  }
}

runSlotGen();
