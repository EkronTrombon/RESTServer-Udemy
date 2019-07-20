// =================================
// Puerto
// =================================
process.env.PORT = process.env.PORT || 3000;

// =================================
// Entorno
// =================================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// =================================
// Vencimiento del token
// =================================
process.env.CADUCIDAD_TOKEN = '48h';

// =================================
// SEED (Semilla)
// =================================
process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo';

// =================================
// Base de datos (Url)
// =================================
let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = process.env.MONGO_URI;
}
process.env.URLDB = urlDB;

// =================================
// Google client Id
// =================================
process.env.CLIENT_ID = process.env.CLIENT_ID || '606321368262-cu3dj638pjosnc6f2kitijc8nlivt7t5.apps.googleusercontent.com';