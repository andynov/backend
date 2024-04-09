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
                return { id: _id, ...rest };
            });

            
            const cartId = req.user.cart.toString();
            console.log(cartId);

            res.render("products", {
                productos: newArray,
                hasPrevPage,
                hasNextPage,
                prevPage: page > 1 ? parseInt(page) - 1 : null,
                nextPage: page < totalPages ? parseInt(page) + 1 : null,
                currentPage: parseInt(page),
                totalPages,
                cartId
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

            const productsInCart = cart.products.map(item => ({
                product: item.product.toObject(),
                quantity: item.quantity
            }));


            res.render("carts", { products: productsInCart });
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
}

module.exports = ViewsController;