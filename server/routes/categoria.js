const express = require('express');

let { verificaToken, verificaAdminRole } = require('../middlewares/autenticacion');

let app = express();

let Categoria = require('../models/categoria');

// =================================
// Mostrar todas las categorias
// =================================
app.get('/categoria', verificaToken, (req, res) => {
    Categoria.find({}, 'descripcion usuario').sort('descripcion').populate('usuario', 'nombre email').exec((err, categorias) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                error: err
            });
        }
        Categoria.count({}, (err, conteo) => {
            res.json({
                ok: true,
                total: conteo,
                categorias
            });
        });
    });
});

// =================================
// Mostrar una categoria por ID
// =================================
app.get('/categoria/:id', (req, res) => {
    // Categoria.findById
    let id = req.params.id;
    Categoria.findById(id, (err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                error: err
            });
        }
        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err: { message: 'La categoría no existe' }
            });
        }
        res.json({
            ok: true,
            categoria: categoriaDB
        });
    });
});

// =================================
// Crear una nueva categoria
// =================================
app.post('/categoria', verificaToken, (req, res) => {
    // regresa la nueva categoria
    // req.usuario._id
    let body = req.body;
    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id
    });
    categoria.save((err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                error: err
            });
        }
        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                error: err
            });
        }
        res.json({
            ok: true,
            categoria: categoriaDB
        });
    });
});

// =================================
// Actualiza una categoria
// =================================
app.put('/categoria/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    let body = req.body;
    let descCategoria = {
        descripcion: req.descripcion
    }
    Categoria.findByIdAndUpdate(id, descCategoria, { new: true, runValidators: true }, (err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                error: err
            });
        }
        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                error: err
            });
        }
        res.json({
            ok: true,
            categoria: categoriaDB
        });
    });
});

// =================================
// Borrar una categoria
// =================================
app.delete('/categoria/:id', [verificaToken, verificaAdminRole], (req, res) => {
    // Sólo un admin puede borrar
    let id = req.params.id;
    Categoria.findByIdAndRemove(id, (err, categoriaBorrada) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                error: err
            });
        }
        if (!categoriaBorrada) {
            return res.status(400).json({
                ok: false,
                err: { message: 'La categoría no existe' }
            });
        }
        res.json({
            ok: true,
            message: 'Categoria eliminada!'
        });
    });
});

module.exports = app;