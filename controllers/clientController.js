const redis = require('redis');
   
   // Crear cliente de Redis
   const redisClient = redis.createClient({
     url: process.env.REDIS_URL || 'redis://localhost:6379'
   });
   
   redisClient.on('connect', () => {
     console.log('Conectado a Redis');
   });
   
   redisClient.on('error', (err) => {
     console.error('Error al conectar con Redis:', err);
   });
   
   // Verificar la conexion a Redis
   (async () => {
     try {
       if (!redisClient.isOpen) {
         await redisClient.connect();
       }
     } catch (error) {
       console.error('Error al conectar el cliente Redis:', error);
     }
   })();
   
   // Función para añadir un nuevo cliente
   exports.addNewClient = async (req, res) => {
     const { rfc, nombre, sucursalId } = req.body;
   
     // Formato para la clave global del cliente y la clave por sucursal
     // ** Mi formato ID: ID-SUCURSAL_CLIENTE:XXX
     // ** Formato al guardar en el set: RFC:XXX:NOMBRE:XXX:SUCURSAL:XXX
     const clientKey = `RFC:${rfc} NOMBRE_CLIENTE:${nombre} SUCURSAL:${sucursalId}`;
     const sucursalKey = `SUCURSAL_CLIENTE:${sucursalId}`;
   
     try {
      const isClientExists = await redisClient.sIsMember(sucursalKey, clientKey);

      if (isClientExists) {
        return res.status(400).json({ message: 'El cliente ya está registrado en la sucursal' });
      }
  
      // Verificar si ya hay 5 clientes en la sucursal
      const numClientes = await redisClient.sCard(sucursalKey);
  
      if (numClientes >= 5) {
        return res.status(400).json({ message: 'La sucursal ya tiene 5 clientes registrados' });
      }
  
      // Añadir el cliente al set de la sucursal
      await redisClient.sAdd(sucursalKey, clientKey);
   
       return res.status(201).json({ message: 'Cliente añadido exitosamente' });
     } catch (error) {
       console.error('Error al procesar la solicitud:', error);
       return res.status(500).json({ message: 'Error al procesar la solicitud', error });
     }
   };