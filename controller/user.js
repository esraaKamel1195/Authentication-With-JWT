const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../model/user");

// Register**************************************************
exports.register = async (req, res, next) => {

    // our register logic goes here...
    try {
        const { first_name, last_name, email, password } = req.body;

        if(!( email && first_name && last_name && password )) {

            var err = new Error("All inputs is required");
            err.status = 400;
            next(err);
        }

        const oldUser = await User.findOne({ email: email });

        if(oldUser) {

            var err = new Error('User ' + req.body.first_name + ' ' + req.body.last_name + ' already exists! Please Login');
            err.status = 403;
            next(err);
        }

        encryptedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            first_name,
            last_name,
            email: email.toLowerCase(),
            password: encryptedPassword,
            admin: req.body.admin || false
        })
        .then((user) => {
            const token = jwt.sign(
                {   user_id: user._id , email },
                    process.env.TOKEN_KEY,
                {
                    expiresIn: "2h",
                }
            );

            req.session.user = 'authenticated';

            user.token = token;

            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json({status: 'Registration Successful!', user: user});

        }, (err) => next(err))
        .catch((err) => next(err));

    } catch (err) {
        next(err);
    }
}

// login**************************************************

exports.login = async (req, res, next) => {
    // our login logic goes here
    try {
        const { email, password } = req.body;
    
        if (!(email && password)) {
           var err = new Error("All inputs is required");
            err.status = 400;
            next(err);
        }

        const user = await User.findOne({ email });

        if (user === null) {
            var err = new Error('User ' + email +  ' does not exist!');
            err.status = 403;
            return next(err);
        }
        else if ( !( await bcrypt.compare( password, user.password ))) {
            var err = new Error('Your password is incorrect!');
            err.status = 403;
            return next(err);
        }
        else if (user.email === email && ( await bcrypt.compare( password, user.password ))) {
            req.session.user = 'authenticated';
            const token = jwt.sign (
                { user_id: user._id, email },
                    process.env.TOKEN_KEY,
                {
                  expiresIn: "2h",
                }
            );
            user.token = token;

            res.statusCode = 200;
            res.setHeader('Content-Type', 'text/plain');
            res.json({status: 'Login Successful!', user: user});
        }
        
    } catch(err) {
        console.log(err);
    }
}

// logout**************************************************

exports.logout = ( req, res ) => {
    if (req.session && (req.body.token || req.query.token || req.headers["x-access-token"])) {
        req.session.destroy();
        res.clearCookie('session-id');
        req.body.token = req.query.token = req.headers["x-access-token"] = "";
        res.redirect('/');
    }
    else {
        var err = new Error('You are not logged in!');
        err.status = 403;
        next(err);
    }
}
