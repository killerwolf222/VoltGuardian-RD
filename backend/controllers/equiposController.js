const equipos = require('../models/equipos');

function validar(datos) {
    return datos &&
        typeof datos.nombre === 'string' &&
        datos.nombre.trim() !== '' &&
        typeof datos.categoria === 'string' &&
        datos.categoria.trim() !== '' &&
        typeof datos.marca === 'string' &&
        datos.marca.trim() !== '' &&
        typeof datos.precio === 'number' &&
        Number.isFinite(datos.precio) &&
        datos.precio >= 0 &&
        datos.fecha_compra &&
        !isNaN(Date.parse(datos.fecha_compra)) &&
        (!datos.vencimiento_garantia ||
            (!isNaN(Date.parse(datos.vencimiento_garantia)) &&
            datos.vencimiento_garantia >= datos.fecha_compra)) &&
        [
            'Operativo',
            'Dañado',
            'En reparación',
            'Reemplazado'
        ].includes(datos.estado);
}

async function listar(req, res) {
    try {
        const datos = await equipos.listar();
        res.json(datos);
    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al listar los equipos'
        });
    }
}

async function buscar(req, res) {
    try {
        const equipo = await equipos.buscar(req.params.id);

        if (!equipo) {
            return res.status(404).json({
                mensaje: 'Equipo no encontrado'
            });
        }

        res.json(equipo);
    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al buscar el equipo'
        });
    }
}

async function crear(req, res) {
    try {
        if (!validar(req.body)) {
            return res.status(400).json({
                mensaje: 'Datos incorrectos o incompletos'
            });
        }

        const id = await equipos.crear(req.body);

        res.status(201).json({
            mensaje: 'Equipo registrado correctamente',
            id: id
        });
    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al registrar el equipo'
        });
    }
}

async function actualizar(req, res) {
    try {
        if (!validar(req.body)) {
            return res.status(400).json({
                mensaje: 'Datos incorrectos o incompletos'
            });
        }

        const existe = await equipos.buscar(req.params.id);

        if (!existe) {
            return res.status(404).json({
                mensaje: 'Equipo no encontrado'
            });
        }

        await equipos.actualizar(req.params.id, req.body);

        res.json({
            mensaje: 'Equipo actualizado correctamente'
        });
    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al actualizar el equipo'
        });
    }
}

async function eliminar(req, res) {
    try {
        const resultado = await equipos.eliminar(req.params.id);

        if (resultado === 0) {
            return res.status(404).json({
                mensaje: 'Equipo no encontrado'
            });
        }

        res.json({
            mensaje: 'Equipo eliminado correctamente'
        });
    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al eliminar el equipo'
        });
    }
}

module.exports = {
    listar,
    buscar,
    crear,
    actualizar,
    eliminar
};