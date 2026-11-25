const API = 'http://localhost:3000/api/equipos';

export interface Equipo {
    id?: number;
    nombre: string;
    categoria: string;
    marca: string;
    modelo: string;
    numero_serie: string;
    precio: number;
    fecha_compra: string;
    vencimiento_garantia: string;
    estado: string;
    descripcion: string;
}

export async function listarEquipos(): Promise<Equipo[]> {
    const respuesta = await fetch(API);

    if (!respuesta.ok) {
        throw new Error('Error al obtener equipos');
    }

    return respuesta.json();
}

export async function guardarEquipo(datos: Equipo) {
    const url = datos.id ? `${API}/${datos.id}` : API;

    const respuesta = await fetch(url, {
        method: datos.id ? 'PUT' : 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(datos)
    });

    if (!respuesta.ok) {
        throw new Error('Error al guardar el equipo');
    }

    return respuesta.json();
}

export async function eliminarEquipo(id: number) {
    const respuesta = await fetch(`${API}/${id}`, {
        method: 'DELETE'
    });

    if (!respuesta.ok) {
        throw new Error('Error al eliminar el equipo');
    }

    return respuesta.json();
}