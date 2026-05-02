import userRepository from '../repositories/UserRepository.js';
import roleRepository from '../repositories/RoleRepository.js';
import bcrypt from 'bcryptjs';

export default async function seedUsers() {
    const adminEmail = process.env.SEED_ADMIN_EMAIL || 'admin@example.com';
    const existing = await userRepository.findByEmail(adminEmail);
    if (existing) return;

    const adminRole = await roleRepository.findByName('admin');
    const userRole = await roleRepository.findByName('user');

    const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS ?? '10', 10);
    const hashed = await bcrypt.hash(process.env.SEED_ADMIN_PASSWORD || 'Admin#123', saltRounds);

    const userData = {
        name: 'Admin',
        lastName: 'User',
        email: adminEmail,
        password: hashed,
        phoneNumber: '0000000000',
        birthdate: new Date('1990-01-01'),
        url_profile: '',
        adress: 'Admin address',
        roles: [adminRole?._id, userRole?._id].filter(Boolean)
    };

    await userRepository.create(userData);
    console.log('Seeded admin user:', adminEmail);
}
