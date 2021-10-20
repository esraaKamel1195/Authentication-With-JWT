require("dotenv").config();
require("./config/database").connect();
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();

const User = require("./model/user");
const auth = require("./middleware/auth");

app.use(express.json());

// Register
app.post("/register", async (req, res) => {

    // our register logic goes here...
    try {
        const { first_name, last_name, email, password } = req.body;

        if(!( email && first_name && last_name && password )) {
            res.status(400).send("All inputs is required");
        }

        const oldUser = await User.findOne({ email });

        if(oldUser) {
            return res.status(409).send("User Already Exist. Please Login");
        }

        encryptedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            first_name,
            last_name,
            email: email.toLowerCase(),
            password: encryptedPassword
        });

        const token = jwt.sign(
            { user_id: user._id , email },
                process.env.TOKEN_KEY,
            {
                expiresIn: "2h",
            }
        );

        user.token = token;

        res.status(201).json(user);
    } catch (err) {
        console.log(err);
    }
});

// Login
app.post("/login", async (req, res) => {
    // our login logic goes here
    try {
        const { email, password } = req.body;
    
        if (!(email && password)) {
          res.status(400).send("All input is required");
        }

        const user = await User.findOne({ email });

        if ( user && ( await bcrypt.compare( password, user.password ))) {
            const token = jwt.sign (
                { user_id: user._id, email },
                    process.env.TOKEN_KEY,
                {
                  expiresIn: "2h",
                }
            );
        
            user.token = token;
        
            res.status(200).json(user);
        }

        res.status(400).send("Invalid Credentials");
        
    } catch(err) {
        console.log(err);
    }
});

app.post("/welcome", auth, (req, res) => {
    res.status(200).send("Welcome 🙌 ");
});

module.exports = app;
