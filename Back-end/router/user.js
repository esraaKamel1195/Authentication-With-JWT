var express = require('express');
var router = express.Router();
const UserController = require("../controller/user");
const _ = require('underscore');
const auth = require("../middleware/auth");


/* GET users listing. */
router.post('/register', UserController.register );

router.post('/login', UserController.login );

router.post('/logout', UserController.logout );

router.get("/welcome", auth , UserController.welcome);

// not work
// router.get("/welcome", _.partial(auth, ['admin','user']) , UserController.welcome);

module.exports = router;