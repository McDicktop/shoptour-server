const jwt = require('jsonwebtoken');
const { secret } = require('../config.js');

module.exports = function (roles) {
    return function (req, res, next) {
        if (req.method === 'OPTIONS') {
            next();
        }

        try {
            const token = req.headers.authorization.split(' ')[1];
            if (!token) {
                return res.status(403).json({ message: 'Пользователь не авторизирован' })
            }

            const { id, roles: userRoles } = jwt.verify(token, secret);
            let hasRole = false;
            userRoles.forEach(role => {
                if (roles.includes(role)) {
                    hasRole = true;
                }
            });
            if (!hasRole) {
                return res.status(403).json({ message: `Invalid user's role` })
            }
            req.user = {
                id,         //  ГДЕ ИСПОЛЬЗУЕТСЯ ДАЛЬШЕ ???
            };
            next();
        } catch (e) {
            console.log(e);
            return res.status(403).json({ message: 'Пользователь не авторизирован' })
        }
    }
}


