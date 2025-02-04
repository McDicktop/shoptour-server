const User = require('../models/User.js')
const Role = require('../models/Role.js')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const { secret } = require('../config.js');

const sentEmail = require('../utils/emailTransporter.js');

const generateAccessToken = (id, roles) => {
    const payload = {
        id,
        roles
    }

    return jwt.sign(payload, secret, { expiresIn: '10h' });
}


class authController {

    async getUserById(req, res) {
        try{
            const user = await User.findById(req.user.id).select('id username email roles');
            if(!user) {
                return res.status(404).json({message: 'User not found'});
            }
            
            // console.log(user)

            return res.status(200).json({id: user._id, name: user.username, email: user.email ?? 'empty@mail.ru', roles: user.roles});
        }catch(error){
            console.error('Error verifying token: ', error);

        }
    }

    async registration(req, res) {
        try {
            const errors = validationResult(req);  // КАК ЭТО РАБОТАЕТ???
            if (!errors.isEmpty()) {
                return res.status(400).json({ message: 'Errors while registration: ', errors });
            }

            const { username, password } = req.body;
            const candidate = await User.findOne({ username });
            if (candidate) {
                return res.status(400).json({ message: 'User already exist!' })
            }

            const hashPassword = bcrypt.hashSync(password, 7);
            const userRole = await Role.findOne({ value: 'USER' });
            const user = new User({ username, password: hashPassword, roles: [userRole.value] });
            // const user = new User({ username, password: hashPassword, roles: ["USER"] });                //  ПОЧЕМУ ТАК НЕ СТОИТ ДЕЛАТЬ?
            await user.save();
            return res.json({ message: 'User was created.' })
        } catch (e) {
            console.log(e);
            res.status(400).json({ message: 'Registration error' });
        }
    }

    async login(req, res) {
        try {
            const { username, password } = req.body;
            const user = await User.findOne({ username });
            if (!user) {
                return res.status(400).json({ message: `User ${username} couldnt be found` })
            }
            const validPassword = bcrypt.compareSync(password, user.password);
            if (!validPassword) {
                return res.status(400).json({ message: `Invalid password` })
            }
            const token = generateAccessToken(user._id, user.roles);
            return res.json({ token, values: {_id: user._id, name: user.username, email: user.email ?? 'empty@mail.ru'} })      // ДАЛЬШЕ ЧТО ?
        } catch (e) {
            console.log(e);
            res.status(400).json({ message: 'Login error' });
        }
    }

    async getUsers(req, res) {
        try {
            const users = await User.find()
            res.json(users)
        } catch (e) {
            console.log(e);
        }
    }

    async testMailer(req, res) {
        try{
            const result = await sentEmail('mcdicktop@gmail.com', req.query.email, 'Example titile', '<p>Hello</p>')

            res.status(200).json({ message: 'Email was sent' });
            
        } catch(e) {
            console.error(e)
            res.status(500).json({ message: 'Internal error' });
        }
    }
}

module.exports = new authController();