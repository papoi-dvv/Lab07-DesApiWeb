import authService from '../services/AuthService.js';

class AuthController {

    async signUp(req, res, next) {
        try {
            const { email, password, name, lastName, phoneNumber, birthdate } = req.body;

            if (!email || !password || !lastName || !phoneNumber || !birthdate)
                return res.status(400).json({ message: 'Los campos email, password, lastName, phoneNumber y birthdate son requeridos' });

            // Password complexity: min 8, 1 upper, 1 digit, 1 special (# $ % & * @)
            const pwdRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[#\$%&\*@]).{8,}$/;
            if (!pwdRegex.test(password)) {
                return res.status(400).json({ message: 'Password debe tener mínimo 8 caracteres, una mayúscula, un dígito y un caracter especial (# $ % & * @)' });
            }

            const user = await authService.signUp({ email, password, name, lastName, phoneNumber, birthdate });
            return res.status(201).json(user);
        } catch (err) {
            next(err);
        }
    }

    async signIn(req, res, next) {
        try {
            const { email, password } = req.body;
            
            if (!email || !password) 
                return res.status(400).json({ message: 'El email y password son requeridos' });
            
            const token = await authService.signIn({ email, password });
            return res.status(200).json(token);
        } catch (err) {
            next(err);
        }
    }
}

export default new AuthController();

