
import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';

import {
    Monitor, Wallet, ShieldCheck,
    AlertTriangle, Pencil, Trash2, Plus
} from 'lucide-react';

import {
    listarEquipos,
    guardarEquipo,
    eliminarEquipo
} from '../services/equipos';

import type { Equipo } from '../services/equipos';

const inicial: Equipo = {
    nombre: '',
    categoria: 'Televisor',
    marca: '',
    modelo: '',
    numero_serie: '',
    precio: 0,
    fecha_compra: '',
    vencimiento_garantia: '',
    estado: 'Operativo',
    descripcion: ''
};

function Equipos() {

    const [equipos, setEquipos] = useState<Equipo[]>([]);
    const [formulario, setFormulario] = useState(inicial);
    const [busqueda, setBusqueda] = useState('');
    const [mensaje, setMensaje] = useState('');
    const [error, setError] = useState('');

    async function cargar() {
        try {
            setEquipos(await listarEquipos());
            setError('');
        } catch {
            setError('Error al cargar los equipos');
        }
    }

    useEffect(() => {
        cargar();
    }, []);

    async function guardar(e: FormEvent) {
        e.preventDefault();

        setError('');
        setMensaje('');

        try {
            await guardarEquipo(formulario);

            setMensaje(
                formulario.id
                    ? 'Equipo actualizado'
                    : 'Equipo registrado correctamente'
            );

            setFormulario(inicial);
            await cargar();

        } catch {
            setError('No se pudo guardar el equipo');
        }
    }

    function editar(equipo: Equipo) {
        setFormulario({
            ...equipo,
            precio: Number(equipo.precio),
            modelo: equipo.modelo || '',
            numero_serie: equipo.numero_serie || '',
            descripcion: equipo.descripcion || '',
            fecha_compra: equipo.fecha_compra.slice(0, 10),
            vencimiento_garantia:
                equipo.vencimiento_garantia?.slice(0, 10) || ''
        });

        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    async function eliminar(id: number) {
        if (!confirm('¿Deseas eliminar este equipo?')) {
            return;
        }

        try {
            await eliminarEquipo(id);
            setMensaje('Equipo eliminado correctamente');
            await cargar();
        } catch {
            setError('No se pudo eliminar el equipo');
        }
    }

    function moneda(valor: number) {
        return new Intl.NumberFormat('es-DO', {
            style: 'currency',
            currency: 'DOP'
        }).format(valor);
    }

    const hoy = new Date().toLocaleDateString('en-CA');

    function garantiaActiva(equipo: Equipo) {
        return equipo.vencimiento_garantia &&
            equipo.vencimiento_garantia.slice(0, 10) >= hoy;
    }

    const valorTotal = equipos.reduce(
        (total, equipo) => total + Number(equipo.precio), 0
    );

    const garantias = equipos.filter(garantiaActiva).length;

    const danados = equipos.filter(
        equipo => equipo.estado === 'Dañado'
    ).length;

    const resultados = equipos.filter(equipo =>
        `${equipo.nombre} ${equipo.marca} ${equipo.categoria}`
            .toLowerCase()
            .includes(busqueda.toLowerCase())
    );

    return (
        <>
            <section className="bienvenida">
                <span className="etiqueta">
                    PATRIMONIO DOMÉSTICO
                </span>

                <h2>Pasaporte digital</h2>

                <p>
                    Registra y administra los
                    electrodomésticos de tu hogar.
                </p>
            </section>

            <section className="estadisticas equipos-estadisticas">

                <div className="tarjeta">
                    <Monitor color="#60a5fa" />
                    <p>Equipos registrados</p>
                    <h2>{equipos.length}</h2>
                </div>

                <div className="tarjeta">
                    <Wallet color="#facc15" />
                    <p>Valor patrimonial</p>
                    <h2>{moneda(valorTotal)}</h2>
                </div>

                <div className="tarjeta">
                    <ShieldCheck color="#4ade80" />
                    <p>Garantías activas</p>
                    <h2>{garantias}</h2>
                </div>

                <div className="tarjeta">
                    <AlertTriangle color="#f87171" />
                    <p>Equipos dañados</p>
                    <h2>{danados}</h2>
                </div>

            </section>

            {mensaje && <div className="mensaje">{mensaje}</div>}
            {error && <div className="error">{error}</div>}

            <section className="panel">

                <h2>
                    {formulario.id
                        ? 'Editar equipo'
                        : 'Registrar electrodoméstico'}
                </h2>

                <form onSubmit={guardar}>

                    <div className="formulario">

                        <div className="campo">
                            <label>Nombre del equipo</label>
                            <input required
                                value={formulario.nombre}
                                onChange={e => setFormulario({
                                    ...formulario,
                                    nombre: e.target.value
                                })}
                            />
                        </div>

                        <div className="campo">
                            <label>Categoría</label>
                            <select
                                value={formulario.categoria}
                                onChange={e => setFormulario({
                                    ...formulario,
                                    categoria: e.target.value
                                })}
                            >
                                <option>Televisor</option>
                                <option>Refrigerador</option>
                                <option>Aire acondicionado</option>
                                <option>Computadora</option>
                                <option>Consola</option>
                                <option>Lavadora</option>
                                <option>Microondas</option>
                                <option>Otro</option>
                            </select>
                        </div>

                        <div className="campo">
                            <label>Marca</label>
                            <input required
                                value={formulario.marca}
                                onChange={e => setFormulario({
                                    ...formulario,
                                    marca: e.target.value
                                })}
                            />
                        </div>

                        <div className="campo">
                            <label>Modelo</label>
                            <input
                                value={formulario.modelo}
                                onChange={e => setFormulario({
                                    ...formulario,
                                    modelo: e.target.value
                                })}
                            />
                        </div>

                        <div className="campo">
                            <label>Número de serie</label>
                            <input
                                value={formulario.numero_serie}
                                onChange={e => setFormulario({
                                    ...formulario,
                                    numero_serie: e.target.value
                                })}
                            />
                        </div>

                        <div className="campo">
                            <label>Precio RD$</label>
                            <input type="number"
                                min="0"
                                step="0.01"
                                required
                                value={formulario.precio}
                                onChange={e => setFormulario({
                                    ...formulario,
                                    precio: Number(e.target.value)
                                })}
                            />
                        </div>

                        <div className="campo">
                            <label>Fecha de compra</label>
                            <input type="date" required
                                value={formulario.fecha_compra}
                                onChange={e => setFormulario({
                                    ...formulario,
                                    fecha_compra: e.target.value
                                })}
                            />
                        </div>

                        <div className="campo">
                            <label>Vencimiento de garantía</label>
                            <input type="date"
                                min={formulario.fecha_compra}
                                value={formulario.vencimiento_garantia}
                                onChange={e => setFormulario({
                                    ...formulario,
                                    vencimiento_garantia: e.target.value
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
                                <option>Operativo</option>
                                <option>Dañado</option>
                                <option>En reparación</option>
                                <option>Reemplazado</option>
                            </select>
                        </div>

                        <div className="campo completo">
                            <label>Descripción</label>
                            <textarea
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
                                : 'Registrar equipo'}
                        </button>

                        {formulario.id && (
                            <button type="button"
                                className="boton-secundario"
                                onClick={() => setFormulario(inicial)}
                            >
                                Cancelar
                            </button>
                        )}

                    </div>

                </form>
            </section>

            <section className="panel">

                <div className="cabecera-tabla">
                    <h2>Mis equipos</h2>

                    <div className="buscador">
                        <input
                            placeholder="Buscar equipo..."
                            value={busqueda}
                            onChange={e =>
                                setBusqueda(e.target.value)
                            }
                        />
                    </div>
                </div>

                <div className="equipos-grid">

                    {resultados.map(equipo => (

                        <div className="equipo-card" key={equipo.id}>

                            <Monitor size={32} color="#60a5fa" />

                            <h3>{equipo.nombre}</h3>

                            <p>{equipo.marca} {equipo.modelo}</p>

                            <strong className="equipo-precio">
                                {moneda(Number(equipo.precio))}
                            </strong>

                            <hr />

                            <p>Categoría: {equipo.categoria}</p>

                            <p>
                                Serie: {equipo.numero_serie || 'No registrada'}
                            </p>

                            <p>
                                Garantía: {
                                    !equipo.vencimiento_garantia
                                        ? 'No registrada'
                                        : garantiaActiva(equipo)
                                            ? 'Activa'
                                            : 'Vencida'
                                }
                            </p>

                            <p>Estado: {equipo.estado}</p>

                            <div className="acciones">

                                <button className="editar"
                                    onClick={() => editar(equipo)}>
                                    <Pencil size={18} />
                                    Editar
                                </button>

                                <button className="eliminar"
                                    onClick={() => eliminar(equipo.id!)}>
                                    <Trash2 size={18} />
                                    Eliminar
                                </button>

                            </div>

                        </div>

                    ))}

                </div>

                {resultados.length === 0 && (
                    <p className="vacio">
                        No hay equipos para mostrar.
                    </p>
                )}

            </section>
        </>
    );
}

export default Equipos;
