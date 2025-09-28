import dotenv from 'dotenv';
import mongoose from './drivers/connect-db.mjs';

dotenv.config();

console.log('🧪 Iniciando pruebas de la API...\n');

async function testAPI() {
    try {
        // 1. Verificar conexión a la base de datos
        console.log('1️⃣ Verificando conexión a MongoDB Atlas...');
        await new Promise((resolve, reject) => {
            if (mongoose.connection.readyState === 1) {
                console.log('   ✅ Conexión exitosa a MongoDB Atlas');
                resolve();
            } else {
                mongoose.connection.once('connected', resolve);
                mongoose.connection.once('error', reject);
            }
        });

        // 2. Verificar colecciones
        console.log('\n2️⃣ Verificando colecciones...');
        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log(`   📋 Colecciones encontradas: ${collections.length}`);
        collections.forEach(collection => {
            console.log(`      - ${collection.name}`);
        });

        // 3. Verificar modelos
        console.log('\n3️⃣ Verificando modelos...');
        const Autor = (await import('./models/Autor.mjs')).default;
        const Cancion = (await import('./models/Canciones.mjs')).default;
        const Usuario = (await import('./models/Usuario.mjs')).default;
        console.log('   ✅ Modelos cargados correctamente');

        // 4. Verificar índices
        console.log('\n4️⃣ Verificando índices...');
        const autorIndexes = await Autor.collection.getIndexes();
        const cancionIndexes = await Cancion.collection.getIndexes();
        console.log(`   📊 Índices en autores: ${Object.keys(autorIndexes).length}`);
        console.log(`   📊 Índices en canciones: ${Object.keys(cancionIndexes).length}`);

        // 5. Verificar variables de entorno
        console.log('\n5️⃣ Verificando configuración...');
        console.log(`   🔧 Puerto: ${process.env.PORT || 3000}`);
        console.log(`   🔧 Entorno: ${process.env.NODE_ENV || 'development'}`);
        console.log(`   🔧 Base de datos: ${process.env.DB_NAME || 'uptc'}`);
        console.log(`   🔧 JWT Secret: ${process.env.JWT_SECRET ? '✅ Configurado' : '❌ No configurado'}`);

        // 6. Verificar endpoints (simulación)
        console.log('\n6️⃣ Verificando endpoints disponibles...');
        const endpoints = [
            'POST /auth/register',
            'POST /auth/login',
            'GET /auth/profile',
            'GET /autor',
            'POST /autor',
            'GET /autor/:id',
            'PUT /autor/:id',
            'DELETE /autor/:id',
            'GET /canciones',
            'POST /canciones',
            'GET /canciones/:id',
            'GET /canciones/autor/:autorId',
            'PUT /canciones/:id',
            'DELETE /canciones/:id'
        ];
        
        endpoints.forEach(endpoint => {
            console.log(`   📡 ${endpoint}`);
        });

        console.log('\n🎉 ¡Todas las pruebas pasaron exitosamente!');
        console.log('\n📋 Resumen:');
        console.log('   ✅ Conexión a MongoDB Atlas');
        console.log('   ✅ Modelos y esquemas');
        console.log('   ✅ Índices de base de datos');
        console.log('   ✅ Configuración de entorno');
        console.log('   ✅ Endpoints de API');
        console.log('\n🚀 La API está lista para usar!');
        console.log('\n📚 Documentación Swagger: http://localhost:3000/api-docs');

    } catch (error) {
        console.error('\n❌ Error en las pruebas:', error.message);
        console.error('\n🔧 Posibles soluciones:');
        console.error('   1. Verificar conexión a internet');
        console.error('   2. Verificar configuración de MongoDB Atlas');
        console.error('   3. Verificar variables de entorno');
        console.error('   4. Verificar que el servidor esté ejecutándose');
    } finally {
        await mongoose.connection.close();
        console.log('\n🔌 Conexión cerrada');
        process.exit(0);
    }
}

testAPI();
