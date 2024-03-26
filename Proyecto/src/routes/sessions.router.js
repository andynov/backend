const express = require("express");
const router = express.Router();
const passport = require("passport");
const UserModel = require("../dao/models/user.model.js");
const { isValidPassword } = require("../utils/hashBcrypt.js");
const generateToken = require("../utils/jsonwebtoken");

/*
// JWT LOGIN

router.post("/login", async (req, res) => {
    const {email, password} = req.body;
    try {
        const user = await UserModel.findOne({email:email});
        if (!user) {
            return res.status(400).send({status: "error", message: "The user isn't exist"});
        }
        if (!isValidPassword(password, user)) {
            return res.status(400).send({status: "error", message: "Invalid credentials"})
        }

        const token = generateToken({
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            id: user._id,
        });

        res.send({status: "success", token});

        
    } catch (error) {
        console.log("Authentication error");
        res.status(500).send({status: "error", message: "Internal Server Error"});
    }
})

*/


// PASSPORT



router.post("/login", passport.authenticate("login", {failureRedirect: "/api/sessions/faillogin"}), async (req, res) => {
    if(!req.user) return res.status(400).send({status: "error", message: "Invalid credentials"});

    req.session.user = {
        first_name: req.user.first_name,
        last_name: req.user.last_name,
        age: req.user.age,
        email: req.user.email
    };

    req.session.login = true;

    res.redirect("/products");
})

router.get("/logout", (req, res) => {
    if(req.session.login) {
        req.session.destroy();
    }
    res.redirect("/login");
})


router.get("/faillogin", async (req, res ) => {
    console.log("Error in login")
    res.send({error: "Internal login error"});
})

// GITHUB LOGIN

router.get("/githubcallback", passport.authenticate("github", {failureRedirect: "/login"}), async (req, res) => {
    req.session.user = req.user;
    req.session.login = true;
    res.redirect("/products");
})



module.exports = router;