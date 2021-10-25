const jwt = require("jsonwebtoken");
const config = process.env;

const auth = (req, res, next) => {
    const token = req.body.token || req.query.token || req.headers["x-access-token"];
    
    if(!token && !req.session.user) {
        var err = new Error('You are not authenticated!');
        err.status = 403;
        return next(err);
    }
    else {
        if (req.session.user === 'authenticated') {
            try {
                const decoded = jwt.verify( token, config.TOKEN_KEY );
                console.log(decoded);
                req.user = decoded;
            }
            catch(err) {
               res.status(401).send("Invalid token");
            }
            return next();
        }
        else {
            var err = new Error('You are not authenticated!');
            err.status = 403;
            return next(err);
        }
    }
    
    return next();
}

module.exports = auth;
