const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();

const Usuario = require('../models/usuario');
const Producto = require('../models/producto');
const fs = require('fs');
const path = require('path');

// default options
app.use(fileUpload({ useTempFiles: true }));

app.put('/upload/:tipo/:id', (req, res) => {
    let tipo = req.params.tipo;
    let id = req.params.id;
    if (!req.files) {
        return res.status(400).json({
            ok: false,
            error: { message: 'No hay ningún archivo para subir' }
        });
    }
    // Valida tipo
    let tiposValidos = ['productos', 'usuarios'];
    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            message: 'El tipo no está permitido. Los tipos permitidos son ' + tiposValidos.join(', ')
        });
    }
    let archivo = req.files.archivo;
    let nombreArchivo = archivo.name.split('.');
    let extension = nombreArchivo[nombreArchivo.length - 1];
    // Extensiones permitidas
    let extensionesValidas = ['png', 'jpg', 'gif', 'jpeg'];
    if (extensionesValidas.indexOf(extension) < 0) {
        return res.status(400).json({
            ok: false,
            message: 'El tipo de archivo no está permitido. Las extensiones permitidas son ' + extensionesValidas.join(', ')
        });
    }
    // Cambiar nombre de archivo
    let nuevoNombreArchivo = `${id}-${new Date().getMilliseconds()}.${extension}`;
    archivo.mv(`uploads/${tipo}/${nuevoNombreArchivo}`, (err) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                error: err
            });
        }
        if (tipo === 'usuarios') {
            imagenUsuario(id, res, nuevoNombreArchivo);
        } else {
            imagenProducto(id, res, nuevoNombreArchivo);
        }
    });
});

function imagenUsuario(id, res, nuevoNombreArchivo) {
    Usuario.findById(id, (err, usuarioDB) => {
        if (err) {
            borraArchivo(nuevoNombreArchivo, 'usuarios');
            return res.status(500).json({
                ok: false,
                error: err
            });
        }
        if (!usuarioDB) {
            borraArchivo(nuevoNombreArchivo, 'usuarios');
            return res.status(400).json({
                ok: false,
                error: { message: 'El usuario no existe!' }
            });
        }
        borraArchivo(usuarioDB.img, 'usuarios');
        usuarioDB.img = nuevoNombreArchivo;
        usuarioDB.save((err, usuarioGuardado) => {
            res.json({
                ok: true,
                usuario: usuarioGuardado,
                img: nuevoNombreArchivo
            });
        });
    });
}

function imagenProducto(id, res, nuevoNombreArchivo) {
    Producto.findById(id, (err, productoDB) => {
        if (err) {
            borraArchivo(nuevoNombreArchivo, 'productos');
            return res.status(500).json({
                ok: false,
                error: err
            });
        }
        if (!productoDB) {
            borraArchivo(nuevoNombreArchivo, 'productos');
            return res.status(400).json({
                ok: false,
                error: { message: 'El producto no existe!' }
            });
        }
        borraArchivo(productoDB.img, 'productos');
        productoDB.img = nuevoNombreArchivo;
        productoDB.save((err, productoGuardado) => {
            res.json({
                ok: true,
                producto: productoGuardado,
                img: nuevoNombreArchivo
            });
        });
    });
}

function borraArchivo(nombreImagen, tipo) {
    let pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${nombreImagen}`);
    if (fs.existsSync(pathImagen)) {
        fs.unlinkSync(pathImagen);
    }
}

module.exports = app;