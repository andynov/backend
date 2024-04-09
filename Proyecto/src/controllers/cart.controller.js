const CartRepository = require("../repositories/cart.repository.js");
const cartRepository = new CartRepository();

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
}

module.exports = CartController;