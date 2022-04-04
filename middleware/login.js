const { verify } = require('jsonwebtoken');
const jwt = require('jsonwebtoken');
const { token } = require('morgan');

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1]
        const decode =  jwt.verify(token, process.env.JWT_KEY);
        req.usuario = decode;
        next();
    } catch (e) {
        return res.status(404).send({error: e});
    }
}