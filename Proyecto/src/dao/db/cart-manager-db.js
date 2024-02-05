const CartModel = require("../models/cart.model");

class CartManager {

    async addCart() {
        try {

        const newCart = new CartModel({products: []});
        await newCart.save();
        return newCart;
        } catch (error) {
            console.log("Error creating new cart", error);
        }
    }

    async getCartById(cartId){
        try{
            const cart = await CartModel.findById(cartId);
            if (!cart) {
                console.log("Doesn't exist a cart with this id");
                return null;
            }
            return cart;
        } catch (error) {
            console.log("Error getting cart by id", error);
        }
    }

    async addProductToCart(cartId, productId, quantity = 1) {
        try {
            const cart = await this.getCartById(cartId);
            const productExist = cart.products.find(item => item.product.toString() === productId);
            if (productExist){
                productExist.quantity += quantity;
            } else {
                cart.products.push({product: productId, quantity});
            }

            cart.markModified("products");
            await cart.save();
            return cart;

        } catch (error) {
            console.log("Error adding product to cart", error)

        }
    }
}

module.exports = CartManager;