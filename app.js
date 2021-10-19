require("dotenv").config();
require("./config/database").connect();
const express = require("express");
const bcrypt = require("bcryptjs");
const jWt = require("jsonwebtoken");

const app = express();

const User = require("./model/user");

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

        const token = jWt.sign(
            { user_id: user._id , email },
            'secret',
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
app.post("/login", (req, res) => {
    // our login logic goes here
});

module.exports = app;
