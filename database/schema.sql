CREATE DATABASE voltguardian;

USE voltguardian;

CREATE TABLE incidentes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tipo VARCHAR(100) NOT NULL,
    descripcion TEXT NOT NULL,
    ubicacion VARCHAR(150) NOT NULL,
    fecha DATETIME NOT NULL,
    duracion INT DEFAULT 0,
    estado VARCHAR(30) DEFAULT 'Pendiente',
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);



USE voltguardian;

CREATE TABLE equipos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    categoria VARCHAR(100) NOT NULL,
    marca VARCHAR(100) NOT NULL,
    modelo VARCHAR(100),
    numero_serie VARCHAR(100),
    precio DECIMAL(12,2) NOT NULL,
    fecha_compra DATE NOT NULL,
    vencimiento_garantia DATE,
    estado VARCHAR(30) DEFAULT 'Operativo',
    descripcion TEXT,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);