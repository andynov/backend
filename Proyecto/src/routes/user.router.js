const express = require("express");
const router = express.Router();
const passport = require("passport");
const generateToken = require("../utils/jsonwebtoken");
const UserModel = require("../dao/models/user.model.js");
const {createHash} = require("../utils/hashBcrypt.js")


/*
// JWT Register

router.post("/", async (req, res) => {
    const {first_name, last_name, email, password, age} = req.body;

    try {
        const userExist = await UserModel.findOne({email:email});
        if (userExist) {
            return res.status(400).send({error: "The user already exists"})
        }

        const newUser = await UserModel.create({first_name, last_name, email, age, password:createHash(password)});

        const token = generateToken({id: newUser._id});

        res.status(200).send({status: "success", message: "Create user successfully", token});

        
        
    } catch (error) {
        console.log("Authentication Error", error);
        res.status(500).send({status: "error", message: "Internal Server Error"})
    }
})

*/



// PASSPORT Register

router.post("/register", passport.authenticate("register", {
    failureRedirect: "/failedregister"
    }), async (req, res) => {
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

router.get("/failedregister", (req, res) => {
    res.send({error: "Register failed"});
})



module.exports = router;