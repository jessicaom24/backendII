// controllers/authController.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
require('dotenv').config();


const SALT_ROUNDS = parseInt(process.env.BCRYPT_SALT_ROUNDS || '10');


async function register(req, res) {
try {
const { first_name, last_name, email, age, password } = req.body;
if (!first_name || !last_name || !email || !password) {
return res.status(400).json({ error: 'Faltan campos obligatorios' });
}


const existing = await User.findOne({ email: email.toLowerCase().trim() });
if (existing) return res.status(409).json({ error: 'Email ya registrado' });


const hashed = bcrypt.hashSync(password, SALT_ROUNDS);


const newUser = new User({
first_name,
last_name,
email: email.toLowerCase().trim(),
age,
password: hashed
});


await newUser.save();


const u = newUser.toObject();
delete u.password;


return res.status(201).json({ message: 'Usuario creado', user: u });
} catch (err) {
console.error(err);
return res.status(500).json({ error: 'Error del servidor' });
}
}


function login(req, res) {
// passport 'login' debe haber autenticado y puesto req.user
const user = req.user;
const payload = { id: user._id, email: user.email, role: user.role };
const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '1h' });


const safe = {
id: user._id,
first_name: user.first_name,
last_name: user.last_name,
email: user.email,
role: user.role
};


return res.json({ message: 'Login correcto', token, user: safe });
}


module.exports = { register, login };