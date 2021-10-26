const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../model/user");

// Register**************************************************
exports.register = async (req, res, next) => {

    // our register logic goes here...
    try {
        const { first_name, last_name, email, password, admin } = req.body;

        if(!( email && first_name && last_name && password )) {
            res.statusCode = 400;
            res.setHeader('Content-Type', 'application/json');
            res.send("All inputs is required");
        }
        else {
            const oldUser = await User.findOne({ email: email });

            if(oldUser) {
                res.statusCode = 403;
                res.setHeader('Content-Type', 'application/json');
                res.send({ status: "User already exists! Please Login" });

            } else {
                if(password) encryptedPassword = await bcrypt.hash(password, 10);

                const user = await User.create({
                    first_name,
                    last_name,
                    email: email.toLowerCase(),
                    password: encryptedPassword,
                    admin: admin
                })
                .then((user) => {
                    const token = jwt.sign(
                        {   
                            user_id: user._id ,
                            email: email,
                            role: admin? 'admin' : 'user'
                        },
                            process.env.TOKEN_KEY,
                        {
                            expiresIn: "2h",
                        }
                    );

                    req.session.user = 'authenticated';

                    user.token = token;

                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.send({status: 'Registration Successful!', user: user});
                }, (err) => next(err))
                .catch((err) => next(err));
            }
        }
    } catch (err) {
        next(err);
    }
}

// login**************************************************

exports.login = async (req, res, next) => {
    // login logic goes here
    try {
        const { email, password } = req.body;
    
        if (!(email && password)) {
            res.statusCode = 400;
            res.setHeader('Content-Type', 'application/json');
            res.json("All inputs is required");
        } else {
            const user = await User.findOne({ email });

            if (user === null) {
                res.statusCode = 403;
                res.setHeader('Content-Type', 'application/json');
                res.send({ status: "User does not exist! Please register" });
            }
            else if ( !( await bcrypt.compare( password, user.password ))) {
                res.statusCode = 403;
                res.setHeader('Content-Type', 'application/json');
                res.json({ status: "Your password is incorrect!" });
            }
            else if (user.email === email && ( await bcrypt.compare( password, user.password ))) {
                
                req.session.user = 'authenticated';
                
                const token = jwt.sign (
                    {   
                        user_id: user._id,
                        email: user.email,
                        role: user.admin? 'admin' : 'user'
                    },
                        process.env.TOKEN_KEY,
                    {
                        expiresIn: "2h",
                    }
                );
                
                user.token = token;
    
                res.statusCode = 200;
                res.setHeader('Content-Type', 'text/plain');
                res.send({status: 'Login Successful!', user: user});
            }
        }

    } catch(err) {
        console.log(err);
    }
}

// logout**************************************************

exports.logout = ( req, res ) => {
    console.log(req.session);
    console.log(req.body.token || req.query.token || req.headers["x-access-token"])
    if (req.session && (req.body.token || req.query.token || req.headers["x-access-token"])) {
        req.session.destroy();
        req.body.token = req.query.token = req.headers["x-access-token"] = "";
        res.send("You are logged out now!");
    }
    else {
        res.statusCode = 403;
        res.setHeader('Content-Type', 'application/json');
        res.send("You are not logged in!");
    }
}
