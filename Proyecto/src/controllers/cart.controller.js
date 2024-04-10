const TicketModel = require("../models/ticket.model.js");
const UserModel = require("../models/user.model.js");
const CartRepository = require("../repositories/cart.repository.js");
const cartRepository = new CartRepository();
const ProductRepository = require("../repositories/product.repository.js");
const productRepository = new ProductRepository();
const { generateUniqueCode, calculateTotal } = require("../utils/cartutils.js");

class CartController {
    async newCart(req, res) {
        try {
            const newCart = await cartRepository.addCart();
            res.json(newCart);
        } catch (error) {
            res.status(500).send("Error");
        }
    }

    async getProductsCart(req, res) {
        const cartId = req.params.cid;
        try {
            const products = await cartRepository.getProductsCart(cartId);
            if (!products) {
                return res.status(404).json({ error: "Cart doesn't find" });
            }
            res.json(products);
        } catch (error) {
            res.status(500).send("Error");
        }
    }

    async addProductToCart(req, res) {
        const cartId = req.params.cid;
        const productId = req.params.pid;
        const quantity = req.body.quantity || 1;
        try {
            await cartRepository.addProductToCart(cartId, productId, quantity);
            const cartID = (req.user.cart).toString();
            
            res.redirect(`/carts/${cartID}`)
        } catch (error) {
            res.status(500).send("Error");
        }
    }

    async deleteProductCart(req, res) {
        const cartId = req.params.cid;
        const productId = req.params.pid;
        try {
            const updatedCart = await cartRepository.deleteProductCart(cartId, productId);
            res.json({
                status: 'success',
                message: 'Product deleted successfully',
                updatedCart,
            });
        } catch (error) {
            res.status(500).send("Error");
        }
    }

    async updateProductCart(req, res) {
        const cartId = req.params.cid;
        const updatedProducts = req.body;

        try {
            const updatedCart = await cartRepository.updateProductCart(cartId, updatedProducts);
            res.json(updatedCart);
        } catch (error) {
            res.status(500).send("Error");
        }
    }

    async updateQuantity(req, res) {
        const cartId = req.params.cid;
        const productId = req.params.pid;
        const newQuantity = req.body.quantity;
        try {
            const updatedCart = await cartRepository.updateProductQuantity(cartId, productId, newQuantity);

            res.json({
                status: 'success',
                message: 'Quantity updated succesfully',
                updatedCart,
            });

        } catch (error) {
            res.status(500).send("Error updating product quantity");
        }
    }

    async emptyCart(req, res) {
        const cartId = req.params.cid;
        try {
            const updatedCart = await cartRepository.deleteCart(cartId);

            res.json({
                status: 'success',
                message: 'All products were deleted succesfully',
                updatedCart,
            });

        } catch (error) {
            res.status(500).send("Error");
        }
    }

    async finishBuy(req, res) {
        const cartId = req.params.cid;
        try {
            const cart = await cartRepository.getProductsCart(cartId);
            const products = cart.products;

            const productsUnavailables = [];

            for (const item of products) {
                const productId = item.product;
                const product = await productRepository.getProductById(productId);
                if (product.stock >= item.quantity) {
                    product.stock -= item.quantity;
                    await product.save();
                } else {
                    productsUnavailables.push(productId);
                }
            }

            const userWithCart = await UserModel.findOne({ cart: cartId });

            const ticket = new TicketModel({
                code: generateUniqueCode(),
                purchase_datetime: new Date(),
                amount: calculateTotal(cart.products),
                purchaser: userWithCart._id
            });
            await ticket.save();

            cart.products = cart.products.filter(item => productosNoDisponibles.some(productId => productId.equals(item.product)));
            await cart.save();

            res.status(200).json({ productsUnavailables });
        } catch (error) {
            console.error('Error processing buying', error);
            res.status(500).json({ error: 'Internal Error Server' });
        }
    }

}


module.exports = CartController;