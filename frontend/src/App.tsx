
import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import Equipos from './components/Equipos';

import {
    Zap, Plus, Pencil, Trash2,
    Activity, Clock, CheckCircle, Search
} from 'lucide-react';

import {
    listarIncidentes,
    guardarIncidente,
    eliminarIncidente
} from './services/incidentes';

import type { Incidente } from './services/incidentes';

import './App.css';

const formularioInicial: Incidente = {
    tipo: 'Apagón eléctrico',
    descripcion: '',
    ubicacion: '',
    fecha: '',
    duracion: 0,
    estado: 'Pendiente'
};

function App() {

    const [incidentes, setIncidentes] = useState<Incidente[]>([]);
    const [formulario, setFormulario] = useState(formularioInicial);
    const [busqueda, setBusqueda] = useState('');
    const [mensaje, setMensaje] = useState('');
    const [error, setError] = useState('');
    const [modulo, setModulo] = useState('incidentes');

    async function cargarIncidentes() {
        try {
            const datos = await listarIncidentes();
            setIncidentes(datos);
            setError('');
        } catch {
            setError('No se pudo conectar con el servidor');
        }
    }

    useEffect(() => {
        cargarIncidentes();
    }, []);

    async function guardar(e: FormEvent) {
        e.preventDefault();

        try {
            await guardarIncidente(formulario);

            setMensaje(
                formulario.id
                    ? 'Incidente actualizado correctamente'
                    : 'Incidente registrado correctamente'
            );

            setFormulario(formularioInicial);
            await cargarIncidentes();

        } catch {
            setError('No se pudo guardar el incidente');
        }
    }

    function editar(incidente: Incidente) {
        setFormulario({
            ...incidente,
            fecha: incidente.fecha.slice(0, 16)
        });

        setMensaje('');
        setError('');

        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    async function eliminar(id: number) {
        if (!confirm('¿Deseas eliminar este incidente?')) {
            return;
        }

        try {
            await eliminarIncidente(id);
            setMensaje('Incidente eliminado correctamente');
            await cargarIncidentes();
        } catch {
            setError('No se pudo eliminar el incidente');
        }
    }

    const pendientes = incidentes.filter(
        i => i.estado === 'Pendiente'
    ).length;

    const resueltos = incidentes.filter(
        i => i.estado === 'Resuelto'
    ).length;

    const resultados = incidentes.filter(i =>
        `${i.tipo} ${i.ubicacion} ${i.descripcion} ${i.estado}`
            .toLowerCase()
            .includes(busqueda.toLowerCase())
    );

    return (
        <div className="aplicacion">

            <header className="encabezado">
                <div className="marca">
                    <div className="logo">
                        <Zap size={28} />
                    </div>

                    <div>
                        <h1>VoltGuardian RD</h1>
                        <p>Gestión de incidentes eléctricos</p>
                    </div>
                </div>
            </header>

           <main className="contenido">

    <nav className="navegacion">
        <button
            className={modulo === 'incidentes' ? 'activo' : ''}
            onClick={() => setModulo('incidentes')}
        >
            Incidentes eléctricos
        </button>

        <button
            className={modulo === 'equipos' ? 'activo' : ''}
            onClick={() => setModulo('equipos')}
        >
            Mis equipos
        </button>
    </nav>

    {modulo === 'equipos' && <Equipos />}

    {modulo === 'incidentes' && (
        <>
              

                <section className="bienvenida">
                    <span className="etiqueta">
                        VOLTGUARDIAN RD
                    </span>

                    <h2>Protege tu hogar</h2>

                    <p>
                        Registra y administra los incidentes
                        eléctricos de tu comunidad.
                    </p>
                </section>

                <section className="estadisticas">

                    <div className="tarjeta">
                        <Activity color="#60a5fa" />
                        <p>Total de incidentes</p>
                        <h2>{incidentes.length}</h2>
                    </div>

                    <div className="tarjeta">
                        <Clock color="#facc15" />
                        <p>Pendientes</p>
                        <h2>{pendientes}</h2>
                    </div>

                    <div className="tarjeta">
                        <CheckCircle color="#4ade80" />
                        <p>Resueltos</p>
                        <h2>{resueltos}</h2>
                    </div>

                </section>

                {mensaje && (
                    <div className="mensaje">{mensaje}</div>
                )}

                {error && (
                    <div className="error">{error}</div>
                )}

                <section className="panel">

                    <h2>
                        {formulario.id
                            ? 'Editar incidente'
                            : 'Registrar incidente'}
                    </h2>

                    <form onSubmit={guardar}>

                        <div className="formulario">

                            <div className="campo">
                                <label>Tipo de incidente</label>

                                <select
                                    value={formulario.tipo}
                                    onChange={e => setFormulario({
                                        ...formulario,
                                        tipo: e.target.value
                                    })}
                                >
                                    <option>Apagón eléctrico</option>
                                    <option>Fluctuación de voltaje</option>
                                    <option>Sobretensión</option>
                                    <option>Bajo voltaje</option>
                                    <option>Otro</option>
                                </select>
                            </div>

                            <div className="campo">
                                <label>Ubicación</label>

                                <input
                                    required
                                    placeholder="Sector, ciudad"
                                    value={formulario.ubicacion}
                                    onChange={e => setFormulario({
                                        ...formulario,
                                        ubicacion: e.target.value
                                    })}
                                />
                            </div>

                            <div className="campo">
                                <label>Fecha y hora</label>

                                <input
                                    type="datetime-local"
                                    required
                                    value={formulario.fecha}
                                    onChange={e => setFormulario({
                                        ...formulario,
                                        fecha: e.target.value
                                    })}
                                />
                            </div>

                            <div className="campo">
                                <label>Duración en minutos</label>

                                <input
                                    type="number"
                                    min="0"
                                    required
                                    value={formulario.duracion}
                                    onChange={e => setFormulario({
                                        ...formulario,
                                        duracion: Number(e.target.value)
                                    })}
                                />
                            </div>

                            <div className="campo">
                                <label>Estado</label>

                                <select
                                    value={formulario.estado}
                                    onChange={e => setFormulario({
                                        ...formulario,
                                        estado: e.target.value
                                    })}
                                >
                                    <option>Pendiente</option>
                                    <option>En revisión</option>
                                    <option>Resuelto</option>
                                </select>
                            </div>

                            <div className="campo completo">
                                <label>Descripción</label>

                                <textarea
                                    required
                                    placeholder="Describe lo ocurrido..."
                                    value={formulario.descripcion}
                                    onChange={e => setFormulario({
                                        ...formulario,
                                        descripcion: e.target.value
                                    })}
                                />
                            </div>

                        </div>

                        <div className="acciones">
                            <button className="boton-principal">
                                <Plus size={18} />

                                {formulario.id
                                    ? 'Guardar cambios'
                                    : 'Registrar incidente'}
                            </button>

                            {formulario.id && (
                                <button
                                    type="button"
                                    className="boton-secundario"
                                    onClick={() =>
                                        setFormulario(formularioInicial)
                                    }
                                >
                                    Cancelar
                                </button>
                            )}
                        </div>

                    </form>
                </section>

                <section className="panel">

                    <div className="cabecera-tabla">

                        <h2>Historial de incidentes</h2>

                        <div className="buscador">
                            <Search size={18} />

                            <input
                                placeholder="Buscar incidentes..."
                                value={busqueda}
                                onChange={e =>
                                    setBusqueda(e.target.value)
                                }
                            />
                        </div>

                    </div>

                    <div className="tabla-contenedor">

                        <table>

                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Tipo</th>
                                    <th>Ubicación</th>
                                    <th>Duración</th>
                                    <th>Estado</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>

                            <tbody>
                                {resultados.map(incidente => (
                                    <tr key={incidente.id}>

                                        <td>#{incidente.id}</td>
                                        <td>{incidente.tipo}</td>
                                        <td>{incidente.ubicacion}</td>
                                        <td>{incidente.duracion} min</td>

                                        <td>
                                            <span className={
                                                incidente.estado === 'Resuelto'
                                                    ? 'estado resuelto'
                                                    : incidente.estado === 'Pendiente'
                                                        ? 'estado pendiente'
                                                        : 'estado revision'
                                            }>
                                                {incidente.estado}
                                            </span>
                                        </td>

                                        <td>
                                            <div className="acciones">

                                                <button
                                                    className="editar"
                                                    title="Editar"
                                                    onClick={() => editar(incidente)}
                                                >
                                                    <Pencil size={18} />
                                                </button>

                                                <button
                                                    className="eliminar"
                                                    title="Eliminar"
                                                    onClick={() => eliminar(incidente.id!)}
                                                >
                                                    <Trash2 size={18} />
                                                </button>

                                            </div>
                                        </td>

                                    </tr>
                                ))}
                            </tbody>

                        </table>

                        {resultados.length === 0 && (
                            <p className="vacio">
                                No hay incidentes para mostrar.
                            </p>
                        )}

                    </div>

                                </section>

            </>
        )}

                <footer>
                    VoltGuardian RD — Gestión eléctrica doméstica
                </footer>

            </main>

        </div>
    );
}

export default App;
