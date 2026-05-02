import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Home page
router.get('/', (req, res) => {
  const token = req.headers.cookie?.includes('token=') ? true : false;
  res.render('home', { token });
});

// Pages
router.get('/signIn', (req, res) => res.render('signIn'));
router.get('/signUp', (req, res) => res.render('signUp'));
router.get('/profile', (req, res) => res.render('profile'));
router.get('/dashboard', (req, res) => res.render('dashboard'));
router.get('/admin', (req, res) => res.render('admin'));
router.get('/403', (req, res) => res.status(403).render('403'));

// 404 handler for web routes
router.use((req, res) => res.status(404).render('404'));

export default router;
