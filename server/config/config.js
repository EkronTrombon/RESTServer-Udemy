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
// 60segs * 60mins * 24hrs * 30dias
// =================================
process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;

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