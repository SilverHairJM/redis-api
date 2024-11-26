const redis = require('redis');
   
   // Crear cliente de Redis
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
   
   // Función para obtener los detalles del producto por ID
   exports.getProductDetails = async (req, res) => {
       const { productId } = req.params;
   
       // Armar la clave según el formato: producto:ID
       const redisKey = `IDPRODUCTO:${productId}`;
       console.log('Clave:', redisKey);
   
       try {
           // Usar await para obtener los detalles del producto
           const productDetails = await redisClient.hGetAll(redisKey);
   
           if (!productDetails || Object.keys(productDetails).length === 0) {
               return res.status(404).json({ message: 'Producto no encontrado en la lista' });
           }
   
           // Retornar los detalles del producto si se encuentra
           return res.status(200).json(productDetails);
       } catch (error) {
           console.error('Error:', error);
           return res.status(500).json({ message: 'Error al procesar la solicitud', error });
       }
   };