const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3001;
const JWT_SECRET = 'smart-ed-secret-2024';
const DB_FILE = path.join(__dirname, 'db.json');

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend')));

// ── DB helpers ──────────────────────────────────────────────
function readDB() {
  if (!fs.existsSync(DB_FILE)) return initDB();
  return JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
}
function writeDB(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}
function initDB() {
  const data = {
    users: [
      {
        id: 1, name: 'Rohan Sharma', email: 'student@demo.com',
        password: bcrypt.hashSync('demo123', 10),
        role: 'student', streak: 7, xp: 1240, level: 5,
        joinedAt: '2024-01-10'
      },
      {
        id: 2, name: 'Ms. Priya Mehta', email: 'teacher@demo.com',
        password: bcrypt.hashSync('demo123', 10),
        role: 'teacher', streak: 0, xp: 0, level: 0,
        joinedAt: '2024-01-01'
      }
    ],
    subjects: [
      { id: 1, name: 'Mathematics', icon: '📐', color: '#378ADD' },
      { id: 2, name: 'Physics', icon: '⚡', color: '#7F77DD' },
      { id: 3, name: 'Chemistry', icon: '⚗️', color: '#1D9E75' },
      { id: 4, name: 'English', icon: '📖', color: '#D85A30' },
      { id: 5, name: 'Computer Science', icon: '💻', color: '#5DCAA5' }
    ],
    progress: [
      { userId: 1, subjectId: 1, pct: 78, score: 82, quizzesDone: 14 },
      { userId: 1, subjectId: 2, pct: 52, score: 61, quizzesDone: 8 },
      { userId: 1, subjectId: 3, pct: 91, score: 94, quizzesDone: 20 },
      { userId: 1, subjectId: 4, pct: 55, score: 58, quizzesDone: 10 },
      { userId: 1, subjectId: 5, pct: 88, score: 90, quizzesDone: 18 }
    ],
    quizzes: [
      {
        id: 1, subjectId: 1, title: 'Trigonometry Basics',
        difficulty: 'medium', duration: 12, tag: 'weak',
        questions: [
          { q: 'What is sin(90°)?', options: ['0', '1', '-1', '0.5'], answer: 1 },
          { q: 'What is cos(0°)?', options: ['0', '1', '-1', '0.5'], answer: 1 },
          { q: 'tan(45°) equals?', options: ['0', '√2', '1', '2'], answer: 2 },
          { q: 'sin²θ + cos²θ = ?', options: ['0', '2', '1', 'θ'], answer: 2 },
          { q: 'What is sin(30°)?', options: ['1', '0.5', '√3/2', '√2/2'], answer: 1 }
        ]
      },
      {
        id: 2, subjectId: 3, title: 'Organic Reactions',
        difficulty: 'hard', duration: 18, tag: 'strong',
        questions: [
          { q: 'What is the functional group in alcohols?', options: ['-COOH', '-OH', '-NH2', '-CHO'], answer: 1 },
          { q: 'Ethanol formula?', options: ['CH4', 'C2H5OH', 'C3H7OH', 'C6H6'], answer: 1 },
          { q: 'Which is an aldehyde?', options: ['Acetone', 'Acetic acid', 'Formaldehyde', 'Ethanol'], answer: 2 },
          { q: 'Benzene molecular formula?', options: ['C6H12', 'C6H6', 'C6H8', 'C6H10'], answer: 1 },
          { q: 'Esterification produces?', options: ['Salt + Water', 'Ester + Water', 'Acid + Alcohol', 'Alkane'], answer: 1 }
        ]
      },
      {
        id: 3, subjectId: 2, title: 'Electrostatics Mock',
        difficulty: 'hard', duration: 25, tag: 'due',
        questions: [
          { q: "Coulomb's law: force is proportional to?", options: ['Distance', 'Product of charges', 'Sum of charges', 'Mass'], answer: 1 },
          { q: 'Unit of electric charge?', options: ['Volt', 'Ampere', 'Coulomb', 'Ohm'], answer: 2 },
          { q: 'Electric field unit?', options: ['N/C', 'J/C', 'C/N', 'V/m²'], answer: 0 },
          { q: 'A conductor in equilibrium has E inside = ?', options: ['Infinity', '1', '0', 'Varies'], answer: 2 },
          { q: 'Capacitance unit?', options: ['Henry', 'Farad', 'Tesla', 'Weber'], answer: 1 }
        ]
      },
      {
        id: 4, subjectId: 5, title: 'Data Structures',
        difficulty: 'easy', duration: 10, tag: 'strong',
        questions: [
          { q: 'Stack follows which principle?', options: ['FIFO', 'LIFO', 'Random', 'Priority'], answer: 1 },
          { q: 'Array index starts at?', options: ['1', '-1', '0', '2'], answer: 2 },
          { q: 'Linked list node contains?', options: ['Only data', 'Only pointer', 'Data + pointer', 'Neither'], answer: 2 },
          { q: 'Binary search requires data to be?', options: ['Unsorted', 'Sorted', 'Random', 'Unique'], answer: 1 },
          { q: 'Queue follows?', options: ['LIFO', 'FIFO', 'Random', 'Priority'], answer: 1 }
        ]
      }
    ],
    quizResults: [],
    materials: [
      { id: 1, subjectId: 1, title: 'Calculus Notes Ch.1-5', type: 'pdf', size: '2.4 MB', uploadedAt: '2024-03-10' },
      { id: 2, subjectId: 2, title: 'Mechanics Formula Sheet', type: 'pdf', size: '1.1 MB', uploadedAt: '2024-03-12' },
      { id: 3, subjectId: 3, title: 'Periodic Table Reference', type: 'pdf', size: '0.8 MB', uploadedAt: '2024-03-08' },
      { id: 4, subjectId: 5, title: 'Python Crash Course', type: 'pdf', size: '3.2 MB', uploadedAt: '2024-03-15' },
      { id: 5, subjectId: 4, title: 'Grammar & Composition Guide', type: 'pdf', size: '1.8 MB', uploadedAt: '2024-03-09' }
    ],
    announcements: [
      { id: 1, title: 'Mid-term exams next week', body: 'Please prepare chapters 1–8 for all subjects.', createdBy: 2, createdAt: '2024-03-18' },
      { id: 2, title: 'Physics lab cancelled', body: 'Lab session on Friday is cancelled. Study from notes.', createdBy: 2, createdAt: '2024-03-17' }
    ],
    activity: [
      { userId: 1, text: 'Scored 94% on Chemistry quiz', ts: Date.now() - 7200000 },
      { userId: 1, text: 'Completed integration worksheet', ts: Date.now() - 86400000 },
      { userId: 1, text: 'Viewed Calculus Notes', ts: Date.now() - 172800000 }
    ]
  };
  writeDB(data);
  return data;
}

// ── Auth middleware ──────────────────────────────────────────
function auth(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token' });
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch { res.status(401).json({ error: 'Invalid token' }); }
}

// ── AUTH ROUTES ──────────────────────────────────────────────
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  const db = readDB();
  const user = db.users.find(u => u.email === email);
  if (!user || !bcrypt.compareSync(password, user.password))
    return res.status(401).json({ error: 'Invalid credentials' });
  const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
  res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role, streak: user.streak, xp: user.xp, level: user.level } });
});

app.post('/api/auth/register', (req, res) => {
  const { name, email, password, role } = req.body;
  const db = readDB();
  if (db.users.find(u => u.email === email))
    return res.status(400).json({ error: 'Email already exists' });
  const newUser = {
    id: db.users.length + 1, name, email,
    password: bcrypt.hashSync(password, 10),
    role: role || 'student', streak: 0, xp: 0, level: 1,
    joinedAt: new Date().toISOString().split('T')[0]
  };
  db.users.push(newUser);
  writeDB(db);
  const token = jwt.sign({ id: newUser.id, role: newUser.role }, JWT_SECRET, { expiresIn: '7d' });
  res.json({ token, user: { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role, streak: 0, xp: 0, level: 1 } });
});

// ── DASHBOARD ────────────────────────────────────────────────
app.get('/api/dashboard', auth, (req, res) => {
  const db = readDB();
  const user = db.users.find(u => u.id === req.user.id);
  if (!user) return res.status(404).json({ error: 'User not found' });

  if (user.role === 'student') {
    const progress = db.progress.filter(p => p.userId === user.id).map(p => {
      const subj = db.subjects.find(s => s.id === p.subjectId);
      return { ...p, subject: subj };
    });
    const activity = db.activity.filter(a => a.userId === user.id).slice(0, 5);
    const totalQuizzes = db.quizResults.filter(r => r.userId === user.id).length;
    const avgScore = progress.reduce((a, b) => a + b.score, 0) / (progress.length || 1);
    const weakSubjects = progress.filter(p => p.pct < 65);
    const recommended = db.quizzes.filter(q => weakSubjects.some(w => w.subjectId === q.subjectId)).slice(0, 3);
    if (recommended.length < 3) {
      db.quizzes.forEach(q => { if (recommended.length < 3 && !recommended.find(r => r.id === q.id)) recommended.push(q); });
    }
    res.json({ user, progress, activity, totalQuizzes, avgScore: Math.round(avgScore), announcements: db.announcements.slice(0, 3), recommended });
  } else {
    // Teacher dashboard
    const students = db.users.filter(u => u.role === 'student');
    const allProgress = db.progress;
    const subjectStats = db.subjects.map(s => {
      const progs = allProgress.filter(p => p.subjectId === s.id);
      const avg = progs.reduce((a, b) => a + b.score, 0) / (progs.length || 1);
      return { subject: s, avgScore: Math.round(avg), studentCount: progs.length };
    });
    res.json({ user, students, subjectStats, totalStudents: students.length, announcements: db.announcements, totalQuizzes: db.quizResults.length });
  }
});

// ── SUBJECTS ─────────────────────────────────────────────────
app.get('/api/subjects', auth, (req, res) => {
  res.json(readDB().subjects);
});

// ── QUIZZES ──────────────────────────────────────────────────
app.get('/api/quizzes', auth, (req, res) => {
  const db = readDB();
  const quizzes = db.quizzes.map(q => ({ ...q, questions: undefined, questionCount: q.questions.length }));
  res.json(quizzes);
});

app.get('/api/quizzes/:id', auth, (req, res) => {
  const db = readDB();
  const quiz = db.quizzes.find(q => q.id === parseInt(req.params.id));
  if (!quiz) return res.status(404).json({ error: 'Quiz not found' });
  res.json(quiz);
});

app.post('/api/quizzes/:id/submit', auth, (req, res) => {
  const { answers } = req.body;
  const db = readDB();
  const quiz = db.quizzes.find(q => q.id === parseInt(req.params.id));
  if (!quiz) return res.status(404).json({ error: 'Not found' });

  let correct = 0;
  const details = quiz.questions.map((q, i) => {
    const isCorrect = answers[i] === q.answer;
    if (isCorrect) correct++;
    return { question: q.q, selected: answers[i], correct: q.answer, isCorrect };
  });
  const score = Math.round((correct / quiz.questions.length) * 100);

  const result = { id: db.quizResults.length + 1, userId: req.user.id, quizId: quiz.id, score, correct, total: quiz.questions.length, details, submittedAt: Date.now() };
  db.quizResults.push(result);

  // Update user XP
  const user = db.users.find(u => u.id === req.user.id);
  if (user) {
    user.xp += score;
    user.level = Math.floor(user.xp / 500) + 1;
  }

  // Log activity
  const subj = db.subjects.find(s => s.id === quiz.subjectId);
  db.activity.unshift({ userId: req.user.id, text: `Scored ${score}% on ${subj?.name} — ${quiz.title}`, ts: Date.now() });

  // Update progress
  const prog = db.progress.find(p => p.userId === req.user.id && p.subjectId === quiz.subjectId);
  if (prog) {
    prog.score = Math.round((prog.score + score) / 2);
    prog.quizzesDone++;
    prog.pct = Math.min(100, prog.pct + (score > 70 ? 3 : 1));
  }

  writeDB(db);
  res.json({ score, correct, total: quiz.questions.length, details });
});

// ── MATERIALS ────────────────────────────────────────────────
app.get('/api/materials', auth, (req, res) => {
  const db = readDB();
  const materials = db.materials.map(m => ({ ...m, subject: db.subjects.find(s => s.id === m.subjectId) }));
  res.json(materials);
});

// ── ANNOUNCEMENTS ────────────────────────────────────────────
app.get('/api/announcements', auth, (req, res) => {
  res.json(readDB().announcements);
});

app.post('/api/announcements', auth, (req, res) => {
  if (req.user.role !== 'teacher') return res.status(403).json({ error: 'Teachers only' });
  const { title, body } = req.body;
  const db = readDB();
  const ann = { id: db.announcements.length + 1, title, body, createdBy: req.user.id, createdAt: new Date().toISOString().split('T')[0] };
  db.announcements.unshift(ann);
  writeDB(db);
  res.json(ann);
});

// ── STUDENTS (teacher) ───────────────────────────────────────
app.get('/api/students', auth, (req, res) => {
  if (req.user.role !== 'teacher') return res.status(403).json({ error: 'Teachers only' });
  const db = readDB();
  const students = db.users.filter(u => u.role === 'student').map(u => {
    const progress = db.progress.filter(p => p.userId === u.id);
    const avg = progress.reduce((a, b) => a + b.score, 0) / (progress.length || 1);
    return { id: u.id, name: u.name, email: u.email, avgScore: Math.round(avg), streak: u.streak, xp: u.xp, level: u.level, progress };
  });
  res.json(students);
});

// ── PROFILE ──────────────────────────────────────────────────
app.get('/api/profile', auth, (req, res) => {
  const db = readDB();
  const user = db.users.find(u => u.id === req.user.id);
  const results = db.quizResults.filter(r => r.userId === req.user.id);
  const activity = db.activity.filter(a => a.userId === req.user.id);
  res.json({ user, quizResults: results, activity });
});

// ── SERVE FRONTEND ───────────────────────────────────────────
app.get('/{*splat}', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

app.listen(PORT, () => console.log(`Smart-ED running on http://localhost:${PORT}`));
