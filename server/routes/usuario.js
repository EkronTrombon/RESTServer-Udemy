const express = require('express');
const app = express();
const Usuario = require('../models/usuario');
const bcrypt = require('bcrypt');
const _ = require('underscore');
const { verificaToken, verificaAdminRole } = require('../middlewares/autenticacion');

app.get('/usuario', verificaToken, (req, res) => {
    let desde = req.query.desde || 0;
    desde = Number(desde);
    let limite = req.query.limite || 5;
    limite = Number(limite);
    Usuario.find({ estado: true }, 'nombre email role estado google img').skip(desde).limit(limite).exec((err, usuarios) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                error: err
            });
        }
        Usuario.count({ estado: true }, (err, conteo) => {
            res.json({
                ok: true,
                total: conteo,
                usuarios
            });
        });
    });
});

app.post('/usuario', [verificaToken, verificaAdminRole], (req, res) => {
    let body = req.body;
    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });
    usuario.save((err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                error: err
            });
        }
        // usuarioDB.password = ';)';
        res.json({
            ok: true,
            usuario: usuarioDB
        });
    });
});

app.put('/usuario/:id', [verificaToken, verificaAdminRole], (req, res) => {
    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);
    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                error: err
            });
        }
        res.json({
            ok: true,
            usuario: usuarioDB
        });

    });
});

app.delete('/usuario/:id', [verificaToken, verificaAdminRole], (req, res) => {
    let id = req.params.id;
    let cambiaEstado = { estado: false };
    Usuario.findByIdAndUpdate(id, cambiaEstado, { new: true }, (err, usuarioActualizado) => {
        // Usuario.findByIdAndRemove(id, (err, usuarioEliminado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                error: err
            });
        }
        if (!usuarioActualizado) {
            return res.status(400).json({
                ok: false,
                error: { message: 'Usuario no encontrado' }
            });
        }
        res.json({
            ok: true,
            usuario: usuarioActualizado
        });
    });
});

module.exports = app;