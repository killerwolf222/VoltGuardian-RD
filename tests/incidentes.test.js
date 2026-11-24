const request = require('supertest');
const app = require('../backend/server');
const db = require('../backend/config/db');

let id;

const incidente = {
    tipo: 'Apagón eléctrico',
    descripcion: 'Registro de prueba automatizada',
    ubicacion: 'Santo Domingo',
    fecha: '2026-11-24 19:00:00',
    duracion: 30,
    estado: 'Pendiente'
};

describe('CRUD de incidentes eléctricos', () => {

    test('Verificar conexión con la base de datos', async () => {
        const res = await request(app)
            .get('/api/health');

        expect(res.statusCode).toBe(200);
    });

    test('Registrar un incidente', async () => {
        const res = await request(app)
            .post('/api/incidentes')
            .send(incidente);

        expect(res.statusCode).toBe(201);
        expect(res.body.id).toBeDefined();

        id = res.body.id;
    });

    test('Listar incidentes', async () => {
        const res = await request(app)
            .get('/api/incidentes');

        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });

    test('Consultar incidente por ID', async () => {
        const res = await request(app)
            .get(`/api/incidentes/${id}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.id).toBe(id);
    });

    test('Actualizar un incidente', async () => {
        const res = await request(app)
            .put(`/api/incidentes/${id}`)
            .send({
                ...incidente,
                estado: 'Resuelto'
            });

        expect(res.statusCode).toBe(200);

        const consulta = await request(app)
            .get(`/api/incidentes/${id}`);

        expect(consulta.body.estado).toBe('Resuelto');
    });

    test('Rechazar datos incorrectos', async () => {
        const res = await request(app)
            .post('/api/incidentes')
            .send({});

        expect(res.statusCode).toBe(400);
    });

    test('Rechazar duración negativa', async () => {
        const res = await request(app)
            .post('/api/incidentes')
            .send({
                ...incidente,
                duracion: -10
            });

        expect(res.statusCode).toBe(400);
    });

    test('Eliminar un incidente', async () => {
        const res = await request(app)
            .delete(`/api/incidentes/${id}`);

        expect(res.statusCode).toBe(200);
    });

    test('Consultar un incidente eliminado', async () => {
        const res = await request(app)
            .get(`/api/incidentes/${id}`);

        expect(res.statusCode).toBe(404);
    });

});

afterAll(async () => {
    if (id) {
        await db.query(
            'DELETE FROM incidentes WHERE id = ?', [id]
        );
    }

    await db.end();
});