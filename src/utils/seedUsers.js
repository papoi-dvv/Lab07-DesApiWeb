import userRepository from '../repositories/UserRepository.js';
import roleRepository from '../repositories/RoleRepository.js';
import bcrypt from 'bcryptjs';

export default async function seedUsers() {
    const adminRole = await roleRepository.findByName('admin');
    const userRole = await roleRepository.findByName('user');

    const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS ?? '10', 10);

    const usersToSeed = [
        {
            name: 'Admin',
            lastName: 'User',
            email: process.env.SEED_ADMIN_EMAIL || 'admin@example.com',
            password: process.env.SEED_ADMIN_PASSWORD || 'Admin#123',
            phoneNumber: '0000000000',
            birthdate: new Date('1990-01-01'),
            url_profile: '',
            adress: 'Admin address',
            roles: [adminRole?._id, userRole?._id].filter(Boolean)
        },
        {
            name: 'John',
            lastName: 'Doe',
            email: 'john.doe@example.com',
            password: 'User#123',
            phoneNumber: '1111111111',
            birthdate: new Date('1985-05-15'),
            url_profile: '',
            adress: '123 Main St',
            roles: [userRole?._id].filter(Boolean)
        },
        {
            name: 'Jane',
            lastName: 'Smith',
            email: 'jane.smith@example.com',
            password: 'User#456',
            phoneNumber: '2222222222',
            birthdate: new Date('1992-08-20'),
            url_profile: '',
            adress: '456 Elm St',
            roles: [userRole?._id].filter(Boolean)
        },
        {
            name: 'Bob',
            lastName: 'Johnson',
            email: 'bob.johnson@example.com',
            password: 'User#789',
            phoneNumber: '3333333333',
            birthdate: new Date('1988-12-10'),
            url_profile: '',
            adress: '789 Oak St',
            roles: [userRole?._id].filter(Boolean)
        }
    ];

    for (const userData of usersToSeed) {
        const existing = await userRepository.findByEmail(userData.email);
        if (!existing) {
            const hashed = await bcrypt.hash(userData.password, saltRounds);
            const userToCreate = { ...userData, password: hashed };
            await userRepository.create(userToCreate);
            console.log('Seeded user:', userData.email);
        }
    }
}
