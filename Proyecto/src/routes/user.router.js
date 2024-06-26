const express = require("express");
const router = express.Router();
const passport = require("passport");
const upload = require("../middleware/multer.js");
const UserController = require("../controllers/user.controller.js");
const UserRepository = require("../repositories/user.repository.js");
const userRepository = new UserRepository();

const userController = new UserController();

router.post("/register", userController.register);
router.post("/login", userController.login);
router.get("/profile", passport.authenticate("jwt", { session: false }), userController.profile);
router.post("/logout", userController.logout.bind(userController));
router.get("/admin", passport.authenticate("jwt", { session: false }), userController.admin);
router.post("/requestPasswordReset", userController.requestPasswordReset);
router.post('/reset-password', userController.resetPassword);
router.put("/premium/:uid", userController.changeRolePremium);

router.post('/:uid/documents', upload.fields([
    { name: 'document' }, { name: 'products' }, { name: 'profile' }]), async (req, res) => {
        const { uid } = req.params;
        const uploadedDocuments = req.files;

        try {
            const user = await userRepository.findById(uid);

            if (!user) {
                return res.status(404).send("Didn't find user");
            }

            if (uploadedDocuments) {
                if (uploadedDocuments.document) {
                    user.documents = user.documents.concat(uploadedDocuments.document.map(doc => ({
                        name: doc.originalname,
                        reference: doc.path
                    })));
                }
                if (uploadedDocuments.products) {
                    user.documents = user.documents.concat(uploadedDocuments.products.map(doc => ({
                        name: doc.originalname,
                        reference: doc.path
                    })));
                }
                if (uploadedDocuments.profile) {
                    user.documents = user.documents.concat(uploadedDocuments.profile.map(doc => ({
                        name: doc.originalname,
                        reference: doc.path
                    })));
                }
            }

            await user.save();

            res.status(200).send("Documents upload succesfully");
        } catch (error) {
            console.error(error);
            res.status(500).send('Internal Error Server');
        }
    });

module.exports = router;
