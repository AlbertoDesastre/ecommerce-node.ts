# Proyecto de Node.js con TypeScript, MySQL y Autenticación JWT

![Node.js](https://img.shields.io/badge/Node.js-v14.x-green.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-v5.x-blue.svg)
![MySQL](https://img.shields.io/badge/MySQL-v8.x-blue.svg)
![JWT](https://img.shields.io/badge/JWT-Authentication-orange.svg)
![Swagger](https://img.shields.io/badge/Swagger-API%20Documentation-red.svg)

Este es un proyecto de ejemplo de una aplicación web backend desarrollada en Node.js, utilizando TypeScript como lenguaje de programación y MySQL como base de datos. La aplicación incluye pruebas unitarias y pruebas E2E para garantizar la calidad del código y la funcionalidad.

## Características Principales

- **TypeScript**: Desarrollado completamente en TypeScript para una mayor seguridad y claridad en el código.
- **MySQL**: Base de datos relacional para el almacenamiento de datos.
- **Autenticación JWT**: Implementa autenticación basada en tokens JWT para proteger las rutas y recursos.
- **Swagger**: Documentación de API generada automáticamente mediante Swagger para una fácil comprensión y prueba de la API.
- **Pruebas Unitarias**: Pruebas unitarias implementadas con Jest para garantizar la calidad del código.
- **Pruebas E2E**: Pruebas end-to-end con Supertest para verificar la funcionalidad de extremo a extremo.
- **Cobertura de Pruebas**: El proyecto tiene como objetivo alcanzar una cobertura de pruebas del 80% o más.
- **Buenas Prácticas de Programación**: Sigue principios de programación orientada a objetos (OOP) y utiliza buenas prácticas de codificación.
- **Escalabilidad**: Diseñado con la escalabilidad en mente, lo que facilita la adición de nuevas características y rutas.

## Instalación

1. Clona este repositorio en tu máquina local:

   ```bash
   git clone https://github.com/tuusuario/tu-proyecto.git

   ```

2. Instala las dependencias:

   ```bash
   cd tu-proyecto
   npm install
   ```

3. Configura el .env como tienes en el ejemplo. Observa para que funciona cada variable:

   ```bash
   PORT=8090 # Setea el puerto en el que correrá la API
   DB_PORT=4123 # Setea el puerto en el que correrá a conexión a BD
   DB_HOST=
   DB_USER=
   DB_PASSWORD=
   DB_TYPE=TEST # TEST / PROD . Dependiendo de qué modo pongas, las pruebas se ejecutarán en ese ambiente. NO realizar las pruebas E2E en ambiente de producción que ya los registros anteriores son eliminados constantemente.
   DB_NAME=some_name
   SECRET= # Secreto para tu aplicación, usado a la hora de crear JWT Tokens.
   EXAMPLE_TOKEN=  # Un ejemplo de Token JWT, para realizar ciertas pruebas E2E
   ```

4. Configura la base de datos MySQL en el archivo config/database.ts. Asegúrate de proporcionar la información de conexión adecuada.

5. Inicia la aplicación:
   ```bash
   npm run serve
   ```

## E2E Test

Las pruebas E2E están implementadas con Supertest y se pueden ejecutar con el siguiente comando:

```bash
npm run e2e
```

Esto ejecutará todas las pruebas end-to-end y proporcionará resultados detallados. Ten en cuenta que la conexión a la base de datos debe estar ya abierta.

## Test coverage

El proyecto tiene como objetivo alcanzar una cobertura de pruebas del 80%. Puedes generar un informe detallado de cobertura de pruebas con el siguiente comando:

```bash
npm run e2e:coverage
```

Esto generará un informe HTML que puedes encontrar en la carpeta coverage y que te ayudará a identificar áreas que requieren pruebas adicionales.

## API Documentation

La documentación de la API se genera automáticamente mediante Swagger y está disponible en http://localhost:\*\*\*\*/api-docs cuando la aplicación está en ejecución. Puedes explorar y probar las rutas API desde esta interfaz interactiva.

## Licencia

Este proyecto está bajo la licencia MIT. Consulta el archivo LICENSE para obtener más detalles.
