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

// Funcion para registrar una nueva venta

exports.addNewSale = async (req, res) => {
    const { ventaId, sucursalId, rfcCliente, nombreCliente, fecha, idProductos } = req.body;

    // Formato para la clave de la venta
    const saleKey = `VENTA:${ventaId}:SUCURSAL:${sucursalId}:RFC_CLIENTE:${rfcCliente}`;

    try {
        // Verificar si la venta ya existe
        const existingSale = await redisClient.hGetAll(saleKey);

        if (existingSale && Object.keys(existingSale).length > 0) {
            return res.status(400).json({ message: 'La venta ya existe' });
        }

        // Guardar los detalles de la venta en Redis
        await redisClient.hSet(saleKey, {
            IDVENTA: ventaId,
            IDSUCURSAL: sucursalId,
            NOMBRE_CLIENTE: nombreCliente,
            FECHA: fecha,
            IDPRODUCTOS: idProductos.join(',') // Asumiendo que idProductos es un array
        });

        return res.status(201).json({ message: 'Venta registrada exitosamente' });
    } catch (error) {
        console.error('Error al procesar la solicitud:', error);
        return res.status(500).json({ message: 'Error al procesar la solicitud', error });
    }
};

// * Funcion para obtener todos los clientes que han comprado en una sucursal en especifico
exports.getClientBranch = async (req, res) => {
    const { sucursalId } = req.params;

    try {
        // Patrón de búsqueda para todas las ventas de una sucursal
        const pattern = `VENTA:*:SUCURSAL:${sucursalId}:RFC_CLIENTE:*`;
        console.log('Clave:', pattern)
        // Usar KEYS para buscar claves que coincidan con el patrón
        const keys = await redisClient.keys(pattern);

        if (keys.length === 0) {
            return res.status(404).json({ message: 'No se encontraron ventas para esta sucursal' });
        }

        // Obtener detalles de todas las ventas encontradas
        const ventasDetails = await Promise.all(keys.map(async (key) => {
            const details = await redisClient.hGetAll(key);
            return { key, ...details };
        }));

        return res.status(200).json(ventasDetails);
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ message: 'Error al procesar la solicitud', error: error.toString() });
    }
};

// * Funcion para obtener el Registro histórico de los clientes que han hecho compras en cada sucursal
exports.getAll = async (req, res) => {
    

    try {
        // Patrón de búsqueda para todas las ventas de una sucursal
        const pattern = `VENTA:*:SUCURSAL:*:RFC_CLIENTE:*`;
        console.log('Clave:', pattern)
        // Usar KEYS para buscar claves que coincidan con el patrón
        const keys = await redisClient.keys(pattern);

        if (keys.length === 0) {
            return res.status(404).json({ message: 'No se encontraron Registros' });
        }

        // Obtener detalles de todas las ventas encontradas
        const ventasDetails = await Promise.all(keys.map(async (key) => {
            const details = await redisClient.hGetAll(key);
            return { key, ...details };
        }));

        return res.status(200).json(ventasDetails);
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ message: 'Error al procesar la solicitud', error: error.toString() });
    }
};