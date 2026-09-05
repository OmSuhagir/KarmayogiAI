import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { fileURLToPath } from 'url';
import User from '../models/User.js';

dotenv.config({ path: fileURLToPath(new URL('../.env', import.meta.url)) });

const BASE = `http://localhost:${process.env.PORT || 5000}`;

const getFetch = async () => {
  if (globalThis.fetch) return globalThis.fetch;
  const mod = await import('node-fetch');
  return mod.default || mod;
};

const run = async () => {
  const fetch = await getFetch();
  console.log('Integration test starting against', BASE);

  const h = await fetch(`${BASE}/api/health`).then((r) => r.json().catch(() => null));
  console.log('health:', h);
  if (!h || h.status !== 'OK') {
    console.error('Server health not OK. Ensure server is running.');
    process.exit(2);
  }

  await mongoose.connect(process.env.MONGO_URI);
  const demoUser = await User.findOne({ email: 'rahul@example.com' }).select('_id').lean();
  if (!demoUser) {
    console.error('Seeded demo user not found. Run npm run seed first.');
    process.exit(3);
  }
  const demoUserId = String(demoUser._id);

  const assessmentsResp = await fetch(`${BASE}/api/assessments`).then((r) => r.json());
  console.log('assessments:', assessmentsResp.success ? assessmentsResp.data.length : assessmentsResp);
  if (!assessmentsResp.success || assessmentsResp.data.length === 0) {
    console.error('No assessments available to test.');
    process.exit(3);
  }

  const assessment = assessmentsResp.data[0];
  console.log('using assessment:', assessment.title, assessment._id);

  // start attempt
  const startResp = await fetch(`${BASE}/api/assessments/${assessment._id}/start`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId: demoUserId })
  }).then((r) => r.json());
  console.log('startResp:', startResp);
  if (!startResp.success) { console.error('Start failed'); process.exit(5); }

  const attemptId = startResp.data.attemptId;
  const questions = startResp.data.questions || [];
  console.log('questions count:', questions.length);
  if (questions.length === 0) {
    console.error('No questions assigned to assessment attempt.');
    process.exit(4);
  }
  if (questions.some((q) => Object.prototype.hasOwnProperty.call(q, 'correctAnswer'))) {
    console.error('Security failure: correctAnswer was returned to the client.');
    process.exit(7);
  }

  // prepare answers: pick first option for each question
  const answers = questions.map((q) => ({ questionId: q._id, selectedAnswer: (q.options && q.options[0] && q.options[0].id) || null }));

  const submitResp = await fetch(`${BASE}/api/assessments/${assessment._id}/submit`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ attemptId, userId: demoUserId, answers })
  }).then((r) => r.json().catch(() => null));
  console.log('submitResp:', submitResp);
  if (!submitResp || !submitResp.success) { console.error('Submit failed'); process.exit(6); }

  // fetch user
  const userResp = await fetch(`${BASE}/api/users/${demoUserId}`).then((r) => r.json());
  console.log('user fetch:', userResp.success ? 'ok' : userResp);

  // skill gaps
  const gapsResp = await fetch(`${BASE}/api/skill-gaps/user/${demoUserId}`).then((r) => r.json());
  console.log('skill gaps:', gapsResp.success ? gapsResp.data.length : gapsResp);

  // recommendations
  const recResp = await fetch(`${BASE}/api/recommendations/user/${demoUserId}`).then((r) => r.json());
  console.log('recommendations:', recResp.success ? recResp.data.length : recResp);

  console.log('Integration test completed.');
  process.exit(0);
};

run().catch((e) => { console.error('integration test error:', e); process.exit(1); });
