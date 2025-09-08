// seed.js
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';

dotenv.config();

import User from '../models/User.js';
import Deck from '../models/Deck.js';
import Feedback from '../models/Feedback.js';

const MONGO = process.env.MONGO_URI;
if (!MONGO) {
  console.error('MONGO_URI not set in .env. Copy .env.example to .env and update it.');
  process.exit(1);
}

const uploadsDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);

const sampleFilePath = path.join(uploadsDir, 'sample-deck.pdf');

async function createSampleFileIfMissing() {
  if (!fs.existsSync(sampleFilePath)) {
    // create a small placeholder PDF-like file (not a real PDF) so download links work for testing
    fs.writeFileSync(sampleFilePath, 'Sample deck placeholder — replace with real PDF/PPTX for production.', 'utf8');
    console.log('Created placeholder file:', sampleFilePath);
  } else {
    console.log('Sample file already exists:', sampleFilePath);
  }
}

async function seed() {
  try {
    await mongoose.connect(MONGO, { dbName: 'bd' });
    console.log('Connected to Mongo.');

    await createSampleFileIfMissing();

    // Passwords (cleartext for testing)
    const founderEmail = 'founder@example.com';
    const investorEmail = 'investor@example.com';
    const plainPassword = 'pass1234';

    // create founder
    let founder = await User.findOne({ email: founderEmail });
    if (!founder) {
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(plainPassword, salt);
      founder = await User.create({
        name: 'Sample Founder',
        email: founderEmail,
        password: hash,
        role: 'founder',
        company: { name: 'Sample Co', website: 'https://example.com', bio: 'Sample founder company' }
      });
      console.log('Created founder:', founderEmail, 'password:', plainPassword);
    } else {
      console.log('Founder already exists:', founderEmail);
    }

    // create investor
    let investor = await User.findOne({ email: investorEmail });
    if (!investor) {
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(plainPassword, salt);
      investor = await User.create({
        name: 'Sample Investor',
        email: investorEmail,
        password: hash,
        role: 'investor'
      });
      console.log('Created investor:', investorEmail, 'password:', plainPassword);
    } else {
      console.log('Investor already exists:', investorEmail);
    }

    // create sample deck for founder
    const deckTitle = 'Sample Deck';
    let deck = await Deck.findOne({ title: deckTitle, founder: founder._id });
    if (!deck) {
      deck = await Deck.create({
        founder: founder._id,
        title: deckTitle,
        description: 'This is a sample deck created by the seed script. Replace with your real deck.',
        filename: path.basename(sampleFilePath),
        originalname: 'sample-deck.pdf',
        requiresNDA: true,
        allowedInvestors: [investor._id], // grant the sample investor access for easy testing
        views: 0,
      });
      console.log('Created sample deck:', deckTitle);
    } else {
      console.log('Sample deck already exists for this founder.');
      // ensure the sample investor is allowed (idempotent)
      if (!deck.allowedInvestors.some(id => id.equals(investor._1d || investor._id))) {
        deck.allowedInvestors.push(investor._id);
        await deck.save();
      }
    }

    // optional: create a sample feedback entry
    const existingFeedback = await Feedback.findOne({ deck: deck._id, investor: investor._id });
    if (!existingFeedback) {
      await Feedback.create({
        deck: deck._id,
        investor: investor._id,
        comment: 'Nice deck — good structure for a quick pitch.'
      });
      console.log('Added sample feedback from sample investor.');
    } else {
      console.log('Sample feedback already exists.');
    }

    console.log('\nSEED SUMMARY:');
    console.log('- Founder login:', founderEmail, ' /', plainPassword);
    console.log('- Investor login:', investorEmail, ' /', plainPassword);
    console.log('- Sample deck file:', `/uploads/${path.basename(sampleFilePath)}`);
    console.log('\nYou can now run the server and login via the client to test the flows.');

    process.exit(0);
  } catch (err) {
    console.error('Seed error', err);
    process.exit(1);
  }
}

seed();
