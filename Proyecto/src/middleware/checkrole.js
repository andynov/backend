const jwt = require('jsonwebtoken');

const checkUserRole = (allowedRoles) => (req, res, next) => {
    const token = req.cookies.coderCookieToken;

    if (token) {
        jwt.verify(token, 'coderhouse', (err, decoded) => {
            if (err) {
                res.status(403).send('Access denegated. Invalid Token');
            } else {
                const userRole = decoded.user.role;
                if (allowedRoles.includes(userRole)) {
                    next();
                } else {
                    res.status(403).send('Access denegated.');
                }
            }
        });
    } else {
        res.status(403).send("Access denegated. We don't get a token");
    }
};

module.exports = checkUserRole;