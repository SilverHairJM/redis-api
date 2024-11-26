const express = require('express');
const redis = require('redis');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const redisClient = redis.createClient({
    url: process.env.REDIS_URL || 'redis://localhost:6379'
});

redisClient.on('connect', () => {
    console.log('Connected to Redis');
});

app.get('/', (req, res) => {
    res.send('<h1>Laboratorio Redis - Backend</h1><p>Esta es la página de inicio.</p>');
});

app.use(express.json());

// Import routes
const productRoutes = require('./routes/products.js');
const clientRoutes = require('./routes/clients.js');
const salesRoutes = require('./routes/sales.js');
const branchRoutes = require('./routes/branches.js');

app.use('/products', productRoutes);
app.use('/clients', clientRoutes);
app.use('/sales', salesRoutes);
app.use('/branches', branchRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));