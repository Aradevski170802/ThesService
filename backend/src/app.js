require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcrypt');
const User = require('./models/User');

const app = express();

// ensure uploads folder exists
const uploadsDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);
app.use('/uploads', express.static(uploadsDir));

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

// Swagger (optional)
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Public Infrastructure Maintenance API',
      version: '1.0.0',
      description: 'City issue tracking system',
    },
    servers: [{ url: 'http://localhost:5000' }],
  },
  apis: ['./src/routes/*.js'],
};
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerJsDoc(swaggerOptions)));

// Mongo + GridFS
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/PUBLIC_THESS';
mongoose.connect(MONGO_URI);
const conn = mongoose.connection;
conn.on('error', err => console.error('Mongo error:', err));
conn.once('open', async () => {
  console.log('Connected to MongoDB');

  // wire up GridFS bucket
  app.locals.gfsBucket = new mongoose.mongo.GridFSBucket(conn.db, { bucketName: 'photos' });

  // ─── BOOTSTRAP SINGLE ADMIN ─────────────────────────────────
  const adminEmail = process.env.ADMIN_EMAIL?.toLowerCase();
  const adminPass = process.env.ADMIN_PASS;
  if (adminEmail && adminPass) {
    try {
      const existing = await User.findOne({ email: adminEmail });
      if (!existing) {
        const hash = await bcrypt.hash(adminPass, 10);
        await User.create({
          name: 'Admin',
          surname: 'User',
          email: adminEmail,
          password: hash,
          role: 'admin',
          isVerified: true
        });
        console.log(`✅ Created admin ${adminEmail}`);
      } else if (existing.role !== 'admin') {
        existing.role = 'admin';
        existing.isVerified = true;
        await existing.save();
        console.log(`🔄 Upgraded ${adminEmail} to admin`);
      }
    } catch (e) {
      console.error('Error bootstrapping admin:', e);
    }
  }
});

// Routes
const authRoutes = require('./routes/authRoutes');
const reportRoutes = require('./routes/reportRoutes');
const adminRoutes = require('./routes/adminRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/admin', adminRoutes);

// root
app.get('/', (_, res) => res.send('Public Infrastructure Maintenance API'));

// start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server on ${PORT}`));
