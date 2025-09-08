// server/scripts/cleanup_notifications.js
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Notification from '../models/Notification.js';

dotenv.config();

const MONGO = process.env.MONGO_URI;
if (!MONGO) {
  console.error('MONGO_URI not set in .env');
  process.exit(1);
}

async function cleanup() {
  await mongoose.connect(MONGO, { dbName: 'bd' });
  console.log('Connected to Mongo');

  // Find duplicates among unread view notifications
  // We'll group by deck + actor + type and keep the most recent one
  const pipeline = [
    { $match: { type: 'view' } }, // optionally only for type view; remove if you want for all types
    {
      $group: {
        _id: { deck: '$deck', actor: '$actor', type: '$type' },
        ids: { $push: { id: '$_id', createdAt: '$createdAt' } },
        count: { $sum: 1 }
      }
    },
    { $match: { count: { $gt: 1 } } }
  ];

  const groups = await Notification.aggregate(pipeline);

  let totalRemoved = 0;
  for (const g of groups) {
    const items = g.ids.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt));
    const keep = items[0].id; // keep the newest
    const remove = items.slice(1).map(x => x.id);

    // remove duplicates
    const res = await Notification.deleteMany({ _id: { $in: remove } });
    totalRemoved += res.deletedCount || 0;
    console.log(`For group ${JSON.stringify(g._id)} kept ${keep}, removed ${remove.length}`);
  }

  console.log('Cleanup done. Total removed:', totalRemoved);
  process.exit(0);
}

cleanup().catch(err => { console.error(err); process.exit(1); });
