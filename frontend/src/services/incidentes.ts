const API = 'http://localhost:3000/api/incidentes';

export interface Incidente {
    id?: number;
    tipo: string;
    descripcion: string;
    ubicacion: string;
    fecha: string;
    duracion: number;
    estado: string;
}

export async function listarIncidentes() {
    const respuesta = await fetch(API);

    if (!respuesta.ok) {
        throw new Error('Error al obtener los incidentes');
    }

    return respuesta.json();
}

export async function guardarIncidente(datos: Incidente) {
    const url = datos.id ? `${API}/${datos.id}` : API;

    const respuesta = await fetch(url, {
        method: datos.id ? 'PUT' : 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(datos)
    });

    if (!respuesta.ok) {
        throw new Error('Error al guardar el incidente');
    }

    return respuesta.json();
}

export async function eliminarIncidente(id: number) {
    const respuesta = await fetch(`${API}/${id}`, {
        method: 'DELETE'
    });

    if (!respuesta.ok) {
        throw new Error('Error al eliminar el incidente');
    }

    return respuesta.json();
}