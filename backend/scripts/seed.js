import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../src/models/user.model.js";
import Net from "../src/models/nets.model.js";
import Slot from "../src/models/slot.model.js";

dotenv.config();

const MONGO_URL = process.env.MONGO_URL || "mongodb://localhost:27017/cricket_seed";

async function seed() {
  console.log("🌱 Seeding database...");

  await mongoose.connect(MONGO_URL);
  await mongoose.connection.db.dropDatabase();

  // 1. Create admin user
  const admin = await User.create({
    name: "Admin User",
    email: "admin@test.com",
    passwordHash: "$2b$10$0s4/fakehash../fake..password..hash",
    role: "admin",
  });

  // 2. Create a few normal users
  await User.create([
    {
      name: "John Doe",
      email: "john@test.com",
      passwordHash: "$2b$10$0s4/fakehash../fake..password..hash",
      role: "user",
    },
    {
      name: "Emma Watson",
      email: "emma@test.com",
      passwordHash: "$2b$10$0s4/fakehash../fake..password..hash",
      role: "user",
    },
  ]);

  // 3. Create nets
  const nets = await Net.create([
    { name: "Net 1", capacity: 2 },
    { name: "Net 2", capacity: 3 },
  ]);

  // 4. Create slots (example: today’s 6–7 AM)
  await Slot.create({
    net: nets[0]._id,
    date: "13-11-2025",
    startAt: new Date("2025-11-13T06:00:00"),
    endAt: new Date("2025-11-13T07:00:00"),
    booked: false,
  });

  console.log("✨ Seeding complete!");
  await mongoose.connection.close();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
