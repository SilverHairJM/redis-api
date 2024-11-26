# Documentación de la API Redis.

## Introducción.
Este es un ejemplo de una API que permite gestionar productos, clientes y sucursales utilizando redis como base de datos.

La api estara corriendo sobre http://localhost:3001/

### Contenido.
- [Documentación de la API Redis.](#documentación-de-la-api-redis)
  - [Introducción.](#introducción)
    - [Contenido.](#contenido)
  - [Endpoints.](#endpoints)
    - [Productos.](#productos)
      - [Get `/products/:keyValue`](#get-productskeyvalue)
    - [Clientes.](#clientes)
      - [Post `/clients/add`](#post-clientsadd)
    - [Ventas.](#ventas)
      - [Post `/sales/register`](#post-salesregister)
      - [Get `/sales/consultar/:keyValue`](#get-salesconsultarkeyvalue)
      - [Get `/sales/all`](#get-salesall)
    - [Sucursales.](#sucursales)
      - [Get `/branches/nearby?latitude=21&longitude=-104&radius=200`](#get-branchesnearbylatitude21longitude-104radius200)
  - [Cómo Ejecutar la API](#cómo-ejecutar-la-api)
  - [Cómo Ejecutar Desde un Docker Compose](#cómo-ejecutar-desde-un-docker-compose)
  
## Endpoints.
### Productos.
#### Get `/products/:keyValue`
- ** Descripción**: Obtiene información del producto con la clave proporcionada (keyValue) de Redis.
- **Parámetros**:
 - `keyValue`: Clave de redis para el producto. Ejemplo: `IDPRODUCTO:001`
- **Respuesta**:
```json
{
    "DESCRIPCION": "Cemento Portland 50kg",
    "PRECIO": "180",
    "CATEGORIA": "Cementos",
    "DATOS_ADICIONALES": "Alta resistencia"
}
```

### Clientes.
#### Post `/clients/add`
- **Descripción**: Añade un nuevo cliente a una sucursal específica.
- **Cuerpo de la solicitud**:
```json
{
    "rfc": "xoasdpas000",
    "nombre": "Ana Rodriguez Vargas",
    "sucursalId": "003"
}
```

- **Respuesta**:
```json
{
    "message": "Cliente añadido exitosamente"
}
```
### Ventas.
#### Post `/sales/register`
- **Descripción**: Añade una nueva venta a la base de datos de Redis.
- **Cuerpo de la solicitud:**
```json
{
  "ventaId": "027",
  "sucursalId": "001",
  "rfcCliente": "ABC123456H12",
  "nombreCliente": "Ana Rodriguez Vargas",
  "fecha": "2024-10-02",
  "idProductos": ["001"]
}
```

- **Respuesta**:
```json
{
    "message": "Venta registrada exitosamente"
}
```

#### Get `/sales/consultar/:keyValue`
- ** Descripción**: Obtiene los datos de todas las ventas que se hicieron en una sucursal con la clave proporcionada (keyValue) de Redis.
- **Parámetros**:
 - `keyValue`: Clave de redis para el producto. Ejemplo: `SUCURSAL:001`
- **Respuesta**:
```json
[
{
        "key": "VENTA:010:SUCURSAL:002:RFC_CLIENTE:BCD258369S90",
        "IDVENTA": "010",
        "IDSUCURSAL": "002",
        "NOMBRE_CLIENTE": "Laura Sanchez Jimenez",
        "FECHA": "2024-09-22",
        "IDPRODUCTOS": "009"
    },
    {
        "key": "VENTA:006:SUCURSAL:002:RFC_CLIENTE:PQR963852O12",
        "IDVENTA": "006",
        "IDSUCURSAL": "002",
        "NOMBRE_CLIENTE": "Roberto Torres Ramirez",
        "FECHA": "2024-09-22",
        "IDPRODUCTOS": "005"
    }
]
```

#### Get `/sales/all`
- ** Descripción**: Obtiene el registro historico de todas las ventas que se han realizado.
- **Respuesta**:
```json
[
    {
        "key": "VENTA:010:SUCURSAL:002:RFC_CLIENTE:BCD258369S90",
        "IDVENTA": "010",
        "IDSUCURSAL": "002",
        "NOMBRE_CLIENTE": "Laura Sanchez Jimenez",
        "FECHA": "2024-09-22",
        "IDPRODUCTOS": "009"
    },
    {
        "key": "VENTA:027:SUCURSAL:001:RFC_CLIENTE:ABC123456H12",
        "IDVENTA": "027",
        "IDSUCURSAL": "001",
        "NOMBRE_CLIENTE": "Ana Rodriguez Vargas",
        "FECHA": "2024-10-02",
        "IDPRODUCTOS": "001"
    },
]
```

### Sucursales.
#### Get `/branches/nearby?latitude=21&longitude=-104&radius=200`
- **Descripción**: Obtiene las sucursales que estan en una ubicación geográfica espécifica.
- **Parámetros**: Para esta consulta ocupamos los parámetros, latitud, longitud y un radio, este caso el radio lo manejamos en kilómetros.
- **Respuesta**:
```json
[
    {
        "id": "ID:001:NOMBRE:Ferreteria Metalye"
    },
    {
        "id": "ID:001:NOMBRE:Ferreteria Rey Nayar"
    },
    {
        "id": "ID:002:NOMBRE:Ferreteria avenida"
    },
    {
        "id": "ID:001:NOMBRE:FERREMATERIALES DEL PACIFICO"
    },
    {
        "id": "ID:001:NOMBRE:Ferreteria La Palma de Tepic Suc. Insurgentes"
    }
]
```

## Cómo Ejecutar la API

1. Instala las dependencias:
    ```bash
    npm install
    ```
2. Ejecuta el servidor:
    ```bash
    npm run start
    ```

## Cómo Ejecutar Desde un Docker Compose
Para ejecutar esta api desde un Docker Compose, copia el siguiente código en un archivo **.yml** con el dombre "docker-compose", en tu terminal navega hasta la ruta donde tienes guardado el archivo y ejecuta el siguiente comando "docker compose up -d".
```bash
services:
  app:
    image: silverhair/01_requisito_lap-app
    container_name: node_app
    ports:
      - "3001:4000"
    environment:
      - REDIS_URL=redis://redis:6379
    depends_on:
      - redis
    volumes:
      - .:/usr/src/app
      - /usr/src/app/node_modules
    command: npm start
  redis:
    image: redis/redis-stack:latest
    container_name: lab-redis
    ports:
      - "6379:6379"
      - "8001:8001"
    volumes:
      - /home/user/Documents/redis_data:/data
```

La api estara corriendo sobre http://localhost:3001/