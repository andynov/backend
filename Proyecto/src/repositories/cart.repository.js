const CartModel = require("../models/cart.model.js");
const TicketModel = require("../models/ticket.model.js");

class CartRepository {

    async addCart() {
        try {

        const newCart = new CartModel({products: []});
        await newCart.save();
        return newCart;
        } catch (error) {
            console.log("Error creating new cart", error);
        }
    }

    async getProductsCart(cartId){
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

    async addProduct(cartId, productId, quantity) {
        try {
            const cart = await this.getProductsCart(cartId);
            const productExist = cart.products.find(item => item.product._id.toString() === productId);
            if (productExist){
                productExist.quantity += quantity;
            } else {
                cart.products.push({product: productId, quantity});
            }

            cart.markModified("products");
            await cart.save();
            return cart;

        } catch (error) {
            console.log("Error adding product to cart", error);
            throw error;

        }
    }

    async deleteProduct(cartId, productId) {
        try {
            const cart = await CartModel.findById(cartId);

            if (!cart) {
                throw new Error("Cart didn't find");
            }


            cart.products = cart.products.filter(item => item.product._id.toString() !== productId);

            await cart.save();
            return cart;

        } catch (error) {
            console.error('Error deleting product in cart', error);
            throw error;
        }
    }

    async updateCart(cartId, updatedProducts) {
        try {
            const cart = await CartModel.findById(cartId);

            if (!cart) {
                throw new Error("Cart didn't find");
            }

            cart.products = updatedProducts;

            cart.markModified('products');
            await cart.save();
            return cart;

        } catch (error) {
            console.error('Error updating cart', error);
            throw error;
        }
    }

    async updateProductQuantity(cartId, productId, newQuantity) {
        try {
            const cart = await CartModel.findById(cartId);

            if (!cart) {
                throw new Error("Cart didn't find");
            }

            const productIndex = cart.products.findIndex(item => item.product._id.toString() === productId);

            if (productIndex !== -1) {
                cart.products[productIndex].quantity = newQuantity;


                cart.markModified('products');

                await cart.save();
                return cart;
            } else {
                throw new Error("Product didn't find in the cart");
            }
        } catch (error) {
            console.error('Error updating quantity product in cart', error);
            throw error;
        }
    }

    async emptyCart(cartId) {
        try {
            const cart = await CartModel.findByIdAndUpdate(
                cartId,
                { products: [] },
                { new: true }
            );

            if (!cart) {
                throw new Error("Cart didn't find");
            }

            return cart;
        } catch (error) {
            console.error('Error emptying cart', error);
            throw error;
        }
    }

    async addProductsToTicket(products, purchaser) {
        try {
            const ticket = new TicketModel({
                code: generateUniqueCode(),
                purchase_datetime: new Date(),
                amount: calculateTotal(products),
                purchaser
            });
            await ticket.save();
            return ticket;
        } catch (error) {
            throw new Error("Error adding Products to Ticket");
        }
    }
}



module.exports = CartRepository;