import express from 'express';
import dotenv from 'dotenv';
import cors from "cors";
import mongoose from 'mongoose';
import path from 'path';

// Importación de rutas y utilidades
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/users.routes.js';
import webRoutes from './routes/web.routes.js';
import seedRoles from './utils/seedRoles.js';
import seedUsers from './utils/seedUsers.js';

// 1. Cargar configuración de entorno primero
dotenv.config();

// 2. Inicializar la aplicación
const app = express();

// 3. Configuraciones de Express (Views, Static, Middleware)
app.set('view engine', 'ejs');
app.set('views', path.join(process.cwd(), 'src', 'views'));

// Servir archivos estáticos
app.use('/static', express.static(path.join(process.cwd(), 'src', 'public')));

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Recomendado si usas formularios EJS

// 4. Definición de Rutas
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/', webRoutes);

// Validar estado del servidor
app.get('/health', (req, res) => res.status(200).json({ ok: true }));

// 5. Manejador global de errores
app.use((err, req, res, next) => {
    console.error(err);
    res.status(err.status || 500).json({ message: err.message || 'Error interno del servidor' });
});

// 6. Conexión a Base de Datos y Arranque
const PORT = process.env.PORT || 3000;

mongoose.connect(process.env.MONGODB_URI, { autoIndex: true })
    .then(async () => {
        console.log('✅ Mongo connected');
        
        // Ejecutar semillas
        await seedRoles();
        await seedUsers();
        
        app.listen(PORT, () => {
            console.log(`🚀 Servidor corriendo en https://lab07-desapiweb.onrender.com`);
        });
    })
    .catch(err => {
        console.error('❌ Error al conectar con Mongo:', err);
        process.exit(1);
    });