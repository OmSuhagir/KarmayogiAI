import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';

// load backend .env explicitly
dotenv.config({ path: new URL('../.env', import.meta.url).pathname });

const MONGO_URI = process.env.MONGO_URI;

const run = async () => {
  await mongoose.connect(MONGO_URI);
  const user = await User.findOne({ email: 'rahul@example.com' }).lean();
  console.log(JSON.stringify(user, null, 2));
  process.exit(0);
};

run().catch((e)=>{console.error(e); process.exit(1)});
