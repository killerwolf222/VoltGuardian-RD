const db = require('../config/db');

async function listar() {
    const [filas] = await db.query('SELECT * FROM incidentes');
    return filas;
}

async function buscar(id) {
    const [filas] = await db.query(
        'SELECT * FROM incidentes WHERE id = ?', [id]
    );
    return filas[0];
}

async function crear(datos) {
    const [resultado] = await db.query(
        `INSERT INTO incidentes 
        (tipo, descripcion, ubicacion, fecha, duracion, estado)
        VALUES (?, ?, ?, ?, ?, ?)`,
        [
            datos.tipo,
            datos.descripcion,
            datos.ubicacion,
            datos.fecha,
            datos.duracion,
            datos.estado
        ]
    );
    return resultado.insertId;
}

async function actualizar(id, datos) {
    const [resultado] = await db.query(
        `UPDATE incidentes SET tipo = ?, descripcion = ?,
        ubicacion = ?, fecha = ?, duracion = ?, estado = ?
        WHERE id = ?`,
        [
            datos.tipo,
            datos.descripcion,
            datos.ubicacion,
            datos.fecha,
            datos.duracion,
            datos.estado,
            id
        ]
    );
    return resultado.affectedRows;
}

async function eliminar(id) {
    const [resultado] = await db.query(
        'DELETE FROM incidentes WHERE id = ?', [id]
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