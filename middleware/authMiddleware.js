const jwt = require('jsonwebtoken');
const { secret } = require('../config.js');

module.exports = function (req, res, next) {
    if (req.method === 'OPTIONS') {
        next(); // сразу переадресуем в обработчик
    }

    try {
        const token = req.headers.authorization.split(' ')[1];
        if (!token) {
            return res.status(403).json({ message: 'Пользователь не авторизирован' })
        }
        const decodedData = jwt.verify(token, secret);  // КАК РАБОТАЕТ, Где используется дальше req.user?  
        req.user = decodedData;                         // НЕПОНЯТНО!    req.user = {_id, roles}
        next();
    } catch (e) {
        console.log(e);
        return res.status(403).json({ message: 'Пользователь не авторизирован' })
    }
} 
