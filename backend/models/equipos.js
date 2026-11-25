const db = require('../config/db');

async function listar() {
    const [filas] = await db.query(
        'SELECT * FROM equipos ORDER BY id DESC'
    );
    return filas;
}

async function buscar(id) {
    const [filas] = await db.query(
        'SELECT * FROM equipos WHERE id = ?', [id]
    );
    return filas[0];
}

async function crear(datos) {
    const [resultado] = await db.query(
        `INSERT INTO equipos
        (nombre, categoria, marca, modelo, numero_serie,
        precio, fecha_compra, vencimiento_garantia, estado, descripcion)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
            datos.nombre,
            datos.categoria,
            datos.marca,
            datos.modelo || null,
            datos.numero_serie || null,
            datos.precio,
            datos.fecha_compra,
            datos.vencimiento_garantia || null,
            datos.estado,
            datos.descripcion || null
        ]
    );

    return resultado.insertId;
}

async function actualizar(id, datos) {
    const [resultado] = await db.query(
        `UPDATE equipos SET
        nombre = ?, categoria = ?, marca = ?,
        modelo = ?, numero_serie = ?, precio = ?,
        fecha_compra = ?, vencimiento_garantia = ?,
        estado = ?, descripcion = ?
        WHERE id = ?`,
        [
            datos.nombre,
            datos.categoria,
            datos.marca,
            datos.modelo || null,
            datos.numero_serie || null,
            datos.precio,
            datos.fecha_compra,
            datos.vencimiento_garantia || null,
            datos.estado,
            datos.descripcion || null,
            id
        ]
    );

    return resultado.affectedRows;
}

async function eliminar(id) {
    const [resultado] = await db.query(
        'DELETE FROM equipos WHERE id = ?', [id]
    );

    return resultado.affectedRows;
}

module.exports = {
    listar,
    buscar,
    crear,
    actualizar,
    eliminar
};