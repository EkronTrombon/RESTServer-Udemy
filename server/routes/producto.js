const express = require('express');

const { verificaToken } = require('../middlewares/autenticacion');

let app = express();
let Producto = require('../models/producto');

// =================================
// Obtener todos los productos
// =================================
app.get('/producto', verificaToken, (req, res) => {
    let desde = req.query.desde || 0;
    desde = Number(desde);
    let limite = req.query.limite || 5;
    limite = Number(limite);
    Producto.find({})
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .skip(desde)
        .limit(limite)
        .exec((err, productos) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    error: err
                });
            }
            Producto.count({}, (err, conteo) => {
                res.json({
                    ok: true,
                    total: conteo,
                    productos
                });
            });
        });
});

// =================================
// Obtener un producto por Id
// =================================
app.get('/producto/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    Producto.findById(id).populate('usuario', 'nombre email').populate('categoria', 'descripcion').exec((err, producto) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                error: err
            });
        }
        if (!producto) {
            return res.status(400).json({
                ok: false,
                error: { message: 'El producto solicitado no existe' }
            });
        }
        res.json({
            ok: true,
            producto
        });
    });
});

// =================================
// Buscar productos
// =================================
app.get('/producto/buscar/:termino', verificaToken, (req, res) => {
    let termino = req.params.termino;
    let regex = new RegExp(termino, 'i');
    Producto.find({ nombre: regex }).populate('categoria', 'descripcion').exec((err, productos) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                error: err
            });
        }
        res.json({
            ok: true,
            productos
        });
    });
});

// =================================
// Crear un nuevo producto
// =================================
app.post('/producto', verificaToken, (req, res) => {
    // Grabar el usuario
    // Grabar una categoria del listado
    let body = req.body;
    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        categoria: body.categoria,
        disponible: body.disponible,
        usuario: req.usuario._id
    });
    producto.save((err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                error: err
            });
        }
        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                error: err
            });
        }
        res.json({
            ok: true,
            producto: productoDB
        });
    });
});

// =================================
// Actualizar un producto
// =================================
app.put('/producto/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    let body = req.body;
    Producto.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                error: err
            });
        }
        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                error: err
            });
        }
        res.json({
            ok: true,
            producto: productoDB
        });
    });
});

// =================================
// Borrar un producto
// =================================
app.delete('/producto/:id', verificaToken, (req, res) => {
    // Cambiar el valor de 'Disponible' a false.
    let id = req.params.id;
    let cambiaEstado = { disponible: false };
    Producto.findByIdAndUpdate(id, cambiaEstado, { new: true }, (err, productoActualizado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                error: err
            });
        }
        if (!productoActualizado) {
            return res.status(400).json({
                ok: false,
                error: { message: 'Producto no encontrado' }
            });
        }
        res.json({
            ok: true,
            producto: productoActualizado
        });
    });
});

module.exports = app;