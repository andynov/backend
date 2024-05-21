const ProductModel = require("../models/product.model.js");
const CartRepository = require("../repositories/cart.repository.js");
const cartRepository = new CartRepository();

class ViewsController {
    async renderProducts(req, res) {
        try {
            const { page = 1, limit = 3 } = req.query;

            const skip = (page - 1) * limit;

            const products = await ProductModel
                .find()
                .skip(skip)
                .limit(limit);

            const totalProducts = await ProductModel.countDocuments();

            const totalPages = Math.ceil(totalProducts / limit);

            const hasPrevPage = page > 1;
            const hasNextPage = page < totalPages;


            const newArray = products.map(product => {
                const { _id, ...rest } = product.toObject();
                return { _id: _id, ...rest };
            });

            
            const cartId = req.user.cart.toString();

            res.render("products", {
                products: newArray,
                hasPrevPage,
                hasNextPage,
                prevPage: page > 1 ? parseInt(page) - 1 : null,
                nextPage: page < totalPages ? parseInt(page) + 1 : null,
                currentPage: parseInt(page),
                totalPages,
                cartId,
                user: {first_name: req.user.first_name, last_name: req.user.last_name}
            });

        } catch (error) {
            console.error("Error getting products", error);
            res.status(500).json({
                status: 'error',
                error: "Internal Error Server"
            });
        }
    }

    async renderCart(req, res) {
        const cartId = req.params.cid;
        try {
            const cart = await cartRepository.getProductsCart(cartId);

            if (!cart) {
                console.log("Doesn't exist a cart with this ID");
                return res.status(404).json({ error: "Cart didn't find" });
            }

            let totalBuying = 0;

            const productsInCart = cart.products.map(item => {
                const product = item.product.toObject();
                const quantity = item.quantity;
                const totalPrice = product.price * quantity;
                totalBuying += totalPrice;
                return {
                    product: { ...product, totalPrice },
                    quantity,
                    cartId
                };
            });


            res.render("carts", { products: productsInCart, totalBuying, cartId });
        } catch (error) {
            console.error("Error getting cart", error);
            res.status(500).json({ error: "Internal Error Server" });
        }
    }

    async renderLogin(req, res) {
        res.render("login");
    }

    async renderRegister(req, res) {
        res.render("register");
    }

    async renderRealTimeProducts(req, res) {
        try {
            res.render("realtimeproducts");
        } catch (error) {
            console.log("Error in Real Time View", error);
            res.status(500).json({ error: "Internal Error Server" });
        }
    }

    async renderChat(req, res) {
        res.render("chat");
    }

    async renderHome(req, res) {
        res.render("home");
    }

    async renderResetPassword(req, res) {
        res.render("passwordreset");
    }

    async renderCambioPassword(req, res) {
        res.render("passwordchange");
    }

    async renderConfirmation(req, res) {
        res.render("confirmation-send");
    }

    async renderPremium(req, res) {
        res.render("panel-premium");
    }
}

module.exports = ViewsController;