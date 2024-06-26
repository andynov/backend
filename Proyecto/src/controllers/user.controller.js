const UserModel = require("../models/user.model.js");
const CartModel = require("../models/cart.model.js");
const jwt = require("jsonwebtoken");
const { createHash, isValidPassword } = require("../utils/hashBcrypt.js");
const UserDTO = require("../dto/user.dto.js");
const { generateResetToken } = require("../utils/tokenreset.js");
const UserRepository = require("../repositories/user.repository.js");
const userRepository = new UserRepository();
const EmailManager = require("../services/email.js");
const emailManager = new EmailManager();

class UserController {
    async register(req, res) {
        const { first_name, last_name, email, password, age } = req.body;
        try {
            const userExist = await userRepository.findByEmail(email);
            if (userExist) {
                return res.status(400).send("The user already exist");
            }

            const newCart = new CartModel();
            await newCart.save();

            const newUser = new UserModel({
                first_name,
                last_name,
                email,
                cart: newCart._id,
                password: createHash(password),
                age
            });

            await userRepository.create(newUser);

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
            const userFounded = await userRepository.findByEmail(email);

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

            userFounded.last_connection = new Date();
            await userFounded.save();

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
        try {
            const isPremium = req.user.role === 'premium';
            const userDto = new UserDTO(req.user.first_name, req.user.last_name, req.user.role);
            const isAdmin = req.user.role === 'admin';
            res.render("profile", { user: userDto, isPremium, isAdmin });
        } catch (error) {
            res.status(500).send('Internal Error Server');
        }
    }

    async logout(req, res) {
        if (req.user) {
            try {
                req.user.last_connection = new Date();
                await req.user.save();
            } catch (error) {
                console.error(error);
                res.status(500).send("Internal Error Server");
                return;
            }
        }

        res.clearCookie("coderCookieToken");
        res.redirect("/login");
    }

    async admin(req, res) {
        if (req.user.role !== "admin") {
            return res.status(403).send("Denegated Access");
        }
        res.render("admin");
    }


    async requestPasswordReset(req, res) {
        const { email } = req.body;

        try {
            const user = await userRepository.findByEmail(email);
            if (!user) {
                return res.status(404).send("User didn't find");
            }

            const token = generateResetToken();

            user.resetToken = {
                token: token,
                expiresAt: new Date(Date.now() + 3600000)
            };
            await userRepository.save(user);

            await emailManager.sendEmailReset(email, user.first_name, token);

            res.redirect("/confirmation-send");
        } catch (error) {
            console.error(error);
            res.status(500).send("Internal Error Server");
        }
    }

    async resetPassword(req, res) {
        const { email, password, token } = req.body;
        try {
            const user = await userRepository.findByEmail(email);
            if (!user) {
                return res.render("passwordchange", { error: "User didn't find" });
            }

            const resetToken = user.resetToken;
            if (!resetToken || resetToken.token !== token) {
                return res.render("passwordreset", { error: "Token to reset password is invalid" });
            }
            const now = new Date();
            if (now > resetToken.expiresAt) {
                return res.redirect("/passwordchange");
            }

            if (isValidPassword(password, user)) {
                return res.render("passwordchange", { error: "New password must be different from the previous one" });
            }
            user.password = createHash(password);
            user.resetToken = undefined;
            await userRepository.save(user);

            return res.redirect("/login");
        } catch (error) {
            console.error(error);
            return res.status(500).render("passwordreset", { error: "Internal error server" });
        }
    }

    async changeRolePremium(req, res) {
        try {
            const { uid } = req.params;

            const user = await userRepository.findById(uid);

            if (!user) {
                return res.status(404).json({ message: "User didn't find" });
            }

            const requiredDocuments = ['Identification', 'Proof of Adress', 'Proof of account status'];
            const userDocuments = user.documents.map(doc => doc.name);

            const hasRequiredDocuments = requiredDocuments.every(doc => userDocuments.includes(doc));

            if (!hasRequiredDocuments) {
                return res.status(400).json({ message: 'The user must to upload: Identification, Proof of Adress, Proof of account status' });
            }

            const newRole = user.role === 'user' ? 'premium' : 'user';

            const updated = await userRepository.updateUserRole(uid, newRole);
            res.json(updated);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal Error Server' });
        }
    }
}


module.exports = UserController;