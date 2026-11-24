const incidentes = require('../models/incidentes');

async function listar(req, res) {
    try {
        const datos = await incidentes.listar();
        res.json(datos);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al listar' });
    }
}

async function buscar(req, res) {
    try {
        const dato = await incidentes.buscar(req.params.id);

        if (!dato) {
            return res.status(404).json({
                mensaje: 'Incidente no encontrado'
            });
        }

        res.json(dato);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al buscar' });
    }
}

function validar(datos) {
    return datos.tipo &&
        datos.descripcion &&
        datos.ubicacion &&
        datos.fecha &&
        !isNaN(Date.parse(datos.fecha)) &&
        Number.isInteger(datos.duracion) &&
        datos.duracion >= 0 &&
        ['Pendiente', 'En revisión', 'Resuelto'].includes(datos.estado);
}

async function crear(req, res) {
    try {
        if (!validar(req.body)) {
            return res.status(400).json({
                mensaje: 'Datos incorrectos o incompletos'
            });
        }

        const id = await incidentes.crear(req.body);

        res.status(201).json({
            mensaje: 'Incidente registrado',
            id: id
        });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al registrar' });
    }
}

async function actualizar(req, res) {
    try {
        if (!validar(req.body)) {
            return res.status(400).json({
                mensaje: 'Datos incorrectos o incompletos'
            });
        }

        const existe = await incidentes.buscar(req.params.id);

        if (!existe) {
            return res.status(404).json({
                mensaje: 'Incidente no encontrado'
            });
        }

        await incidentes.actualizar(req.params.id, req.body);

        res.json({ mensaje: 'Incidente actualizado' });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al actualizar' });
    }
}

async function eliminar(req, res) {
    try {
        const resultado = await incidentes.eliminar(req.params.id);

        if (resultado === 0) {
            return res.status(404).json({
                mensaje: 'Incidente no encontrado'
            });
        }

        res.json({ mensaje: 'Incidente eliminado' });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al eliminar' });
    }
}

module.exports = {
    listar,
    buscar,
    crear,
    actualizar,
    eliminar
};