const express = require("express");
const router = express.Router();
const passport = require("passport");

router.post("/login", passport.authenticate("login", {failureRedirect: "/api/sessions/faillogin"}), async (req, res) => {
    if(!req.user) return res.status(400).send({status: "error", message: "Invalid credentials"});

    req.session.user = {
        first_name: req.user.first_name,
        last_name: req.user.last_name,
        age: req.user.age,
        email: req.user.email
    };

    req.session.login = true;

    res.redirect("/profile");
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

router.get("/github", passport.authenticate("github", {scope: ["user:email"]}) , async (req, res) => {})

router.get("/githubcallback", passport.authenticate("github", {failureRedirect: "/login"}), async (req, res) => {
    req.session.user = req.user;
    req.session.login = true;
    res.redirect("/profile");
})


module.exports = router;