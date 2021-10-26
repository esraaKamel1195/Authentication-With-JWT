const jwt = require("jsonwebtoken");
const config = process.env;

const auth = (req, res, next) => {
    const token = req.body.token || req.query.token || req.headers["x-access-token"];
    console.log(req.session.user);
    if(!token && !req.session.user) {
        console.log("step 1");
        res.status(403).json({ message: 'You are not authenticated!' });
    }
    else {
        if (req.session.user === 'authenticated') {
            console.log("step 2");
            try {
                console.log("step 3");
                const decoded = jwt.verify( token, config.TOKEN_KEY );
                console.log(decoded);
                req.user = decoded;
            }
            catch(err) {
                console.log("step 4");
               res.status(401).send("Invalid token");
            }
            return next();
        }
        else {
            console.log("step 5");
            res.status(403).json({ message: 'You are not authenticated!' });
        }
    }
}

module.exports = auth;
