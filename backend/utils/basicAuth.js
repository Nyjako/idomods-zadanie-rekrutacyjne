const basicAuth = require('basic-auth');

const USERNAME = process.env.BASIC_AUTH_USERNAME || 'admin';
const PASSWORD = process.env.BASIC_AUTH_PASSWORD || 'password';

module.exports = (req, res, next) => {
    const user = basicAuth(req);
    if (!user || user.name !== USERNAME || user.pass !== PASSWORD) {
        res.set('WWW-Authenticate', 'Basic realm="example"');
        return res.status(401).send('Uwierzytelnianie wymagane.');
    }
    return next();
};
