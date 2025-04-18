// backend/src/app.js
require('dotenv').config(); // Load environment variables from .env file
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const path = require('path');
const fs = require('fs');

const app = express();

const uploadsDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

app.use('/uploads', express.static(uploadsDir));

// 1) Create an Express app


// 2) Middlewares
app.use(cors()); // Allow cross-origin requests
app.use(express.json()); // Parse incoming JSON requests
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
// Serve the uploads directory as a static folder



app.use(cors({
    origin: 'http://localhost:3000',  // Frontend URL
    methods: ['GET', 'POST'],  // Allowed methods
    credentials: true  // If you need to send cookies or authorization headers
  }));

// 3) Swagger setup (API documentation)
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Public Infrastructure Maintenance System API',
            version: '1.0.0',
            description: 'API documentation for the city infrastructure issue tracking system',
        },
        servers: [
            {
                url: 'http://localhost:5000',  // Development server URL
                description: 'Development server',
            },
        ],
    },
    apis: ['./src/routes/*.js'], // Path to the route files (for Swagger annotations)
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs)); // Serve Swagger UI on /api-docs route

// 1) Connect to MongoDB
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/PUBLIC_THESS';
mongoose.connect(MONGO_URI);  // no need for deprecated options

// 2) Wire up GridFS bucket once the connection is open
const conn = mongoose.connection;
conn.on('error', err => console.error('MongoDB connection error:', err));
conn.once('open', () => {
  console.log('Connected to MongoDB successfully');
  // this is where we capture the underlying native db instance
  app.locals.gfsBucket = new mongoose.mongo.GridFSBucket(conn.db, {
    bucketName: 'photos'
  });
});
// 5) Import routes (authRoutes, reportRoutes, etc.)
const authRoutes = require('./routes/authRoutes'); // For user registration/login
const reportRoutes = require('./routes/reportRoutes'); // For handling reports (create, update status)
app.use('/api/auth', authRoutes);  // Mount auth routes at /api/auth
app.use('/api/reports', reportRoutes); // Mount report routes at /api/reports

// 6) Test route
app.get('/', (req, res) => {
    res.send('Public Infrastructure Maintenance System API');
});

// 7) Start the server
const PORT = process.env.PORT || 5000;  // Port from environment variable or default to 5000
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
