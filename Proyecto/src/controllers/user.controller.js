const UserModel = require("../models/user.model.js");
const CartModel = require("../models/cart.model.js");
const jwt = require("jsonwebtoken");
const { createHash, isValidPassword } = require("../utils/hashBcrypt.js");
const UserDTO = require("../dto/user.dto.js");

class UserController {
    async register(req, res) {
        const { first_name, last_name, email, password, age } = req.body;
        try {
            const userExist = await UserModel.findOne({ email });
            if (userExist) {
                return res.status(400).send("El usuario ya existe");
            }

            const newCart = new CartModel();
            await newCart.save();

            const newUser = new UserModel({
                first_name,
                last_name,
                email,
                cart: nuevoCarrito._id, 
                password: createHash(password),
                age
            });

            await newUser.save();

            const token = jwt.sign({ user: newUser }, "coderhouse", {
                expiresIn: "1h"
            });

            res.cookie("coderCookieToken", token, {
                maxAge: 3600000,
                httpOnly: true
            });

            res.redirect("/api/users/profile");
        } catch (error) {
            console.error(error);
            res.status(500).send("Internal Server Error");
        }
    }

    async login(req, res) {
        const { email, password } = req.body;
        try {
            const userFounded = await UserModel.findOne({ email });

            if (!userFounded) {
                return res.status(401).send("User not valid");
            }

            const isValid = isValidPassword(password, userFounded);
            if (!isValid) {
                return res.status(401).send("Incorrect Password");
            }

            const token = jwt.sign({ user: userFounded }, "coderhouse", {
                expiresIn: "1h"
            });

            res.cookie("coderCookieToken", token, {
                maxAge: 3600000,
                httpOnly: true
            });

            res.redirect("/api/users/profile");
        } catch (error) {
            console.error(error);
            res.status(500).send("Internal Error Server");
        }
    }

    async profile(req, res) {

        const userDto = new UserDTO(req.user.first_name, req.user.last_name, req.user.role);
        const isAdmin = req.user.role === 'admin';
        res.render("profile", { user: userDto, isAdmin });
    }

    async logout(req, res) {
        res.clearCookie("coderCookieToken");
        res.redirect("/login");
    }

    async admin(req, res) {
        if (req.user.user.role !== "admin") {
            return res.status(403).send("Denegated Access");
        }
        res.render("admin");
    }
}

module.exports = UserController;