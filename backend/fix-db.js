import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

async function fixDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Drop the problematic username index
    try {
      await mongoose.connection.db.collection('users').dropIndex('username_1');
      console.log('Dropped username_1 index');
    } catch (err) {
      console.log('Index might not exist:', err.message);
    }

    // Optionally, drop the entire users collection to start fresh
    await mongoose.connection.db.collection('users').drop();
    console.log('Dropped users collection - starting fresh');

    console.log('Database fixed! You can now register users.');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

fixDatabase();
