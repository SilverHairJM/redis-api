const redis = require('redis')

// Crear Cliente de redis
const redisClient = redis.createClient({
    url: process.env.REDIS_URL || 'redis://localhost:6379'
});

// Verificar conexion a redis
redisClient.connect().catch(err => {
    console.error('Error al conectar con Redis:', err);
});

redisClient.on('connect', () => {
    console.log('Conectado a Redis');
});

redisClient.on('error', (err) => {
    console.error('Error al conectar con Redis:', err);
});

// * Función para obtener detalles de una sucursal
// Función para buscar sucursales cercanas
exports.findNearbyBranches = async (req, res) => {
    const { latitude, longitude, radius } = req.query;

    try {
        // Usar GEOSEARCH para encontrar sucursales cercanas
        const nearbyBranches = await redisClient.geoSearch('SUCURSALES', {
            longitude: parseInt(longitude),
            latitude: parseInt(latitude)
        }, {
            radius: parseInt(radius),
            unit: 'km'  // metros
        });

        // Obtener detalles de las sucursales encontradas
        const branchDetails = await Promise.all(nearbyBranches.map(async (branchId) => {
            const details = await redisClient.hGetAll(`SUCURSAL:${branchId}`);
            return { id: branchId, ...details };
        }));

        res.json(branchDetails);
    } catch (error) {
        console.error('Error al buscar sucursales cercanas:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};
