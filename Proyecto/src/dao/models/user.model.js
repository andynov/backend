const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    first_name: {
        type: String, 
        required: true
    },

    last_name : {
        type: String, 
        //required: true
    },

    email : {
        type: String, 
        required: true,
        index: true, 
        unique: true
    }, 

    password: {
        type: String, 
        //required: true
    },

    age : {
        type: Number, 
        //required: true
    },
    role: {
        type: String,
        default: "user"
    },
    cart: {
            type: mongoose.Schema.Types.ObjectId,
            ref:"Cart",
           // required: true
    }
});

userSchema.pre("findOne", function (next) {
    this.populate('carts.cart', 'id');
    next();
});

const UserModel = mongoose.model("user", userSchema);

module.exports = UserModel;
