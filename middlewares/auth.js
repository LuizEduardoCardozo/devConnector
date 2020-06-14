const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = (req,res,nxt) => {

    const token = req.header('x-auth-token');
    if(!token) res.status(400).json({err: "No token provided"});

    try {

        const decoded = jwt.verify(token, config.get('secret'));
        req.user = decoded.user;
        nxt();

    }catch (err) {

        if( err ) throw err.message;
        return res.status(401);

    }

};