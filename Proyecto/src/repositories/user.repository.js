const UserModel = require("../models/user.model.js");

class UserRepository {
    async findByEmail(email) {
        try {
            return await UserModel.findOne({ email });
        } catch (error) {
            throw error;
        }
    }

    async findById(id) {
        try {
            return await UserModel.findById(id);
        } catch (error) {
            throw error;
        }
    }

    async create(user) {
        try {
            return await user.save();
        } catch (error) {
            throw error;
        }
    }

    async save(user) {
        try {
            return await user.save();
        } catch (error) {
            throw error;
        }
    }

    async updateUserRole(userId, newRole) {
        try {
            const user = await UserModel.findById(userId);

            if (!user) {
                throw new Error("User didn't find");
            }

            const requiredDocuments = ['Identification', 'Proof of Adress', 'Proof of account status'];
            const userDocuments = user.documents.map(doc => doc.name);

            const hasRequiredDocuments = requiredDocuments.every(doc => userDocuments.includes(doc));

            if (!hasRequiredDocuments) {
                throw new Error('The user must to upload: Identification, Proof of Adress, Proof of account status');
            }

            return await UserModel.findByIdAndUpdate(userId, { role: newRole }, { new: true });
        } catch (error) {
            throw error;
        }
    }

}

module.exports = UserRepository;