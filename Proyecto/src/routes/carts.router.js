const express = require("express");
const router = express.Router();
const CartController = require("../controllers/cart.controller.js");
const cartController = new CartController(); 

router.post("/", cartController.newCart);
router.get("/:cid", cartController.getProductsCart);
router.post("/:cid/product/:pid", cartController.addProductToCart);
router.delete('/:cid/product/:pid', cartController.deleteProductCart);
router.put('/:cid', cartController.updateProductCart);
router.put('/:cid/product/:pid', cartController.updateQuantity);
router.delete('/:cid', cartController.emptyCart);
router.post('/:cid/purchase', cartController.finishBuy);

module.exports = router;

// ROUTING

/*
router.post("/carts", async (req, res) =>{
    try{
        const newCart = await cartManager.addCart();
        res.json(newCart);

    } catch(error) {
        console.error("Error adding Cart", error)
        res.status(500).json({error: "Internal error server"});
    }
})

router.get("/carts/:cid", async (req, res) => {
    const cartId = req.params.cid;

    try {
        const cart = await CartModel.findById(cartId);
            
        if (!cart) {
            console.log("Doesn't exist a cart with this ID");
            return res.status(404).json({ error: "Cart didn't find" });
        }

        return res.json(cart.products);
    } catch (error) {
        console.error("Error getting the product", error);
        res.status(500).json({ error: "Internal Error Server" });
    }
});

router.post("/carts/:cid/products/:pid", async (req, res) => {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const quantity = req.body.quantity || 1;

    try {
        const updateCart = await cartManager.addProductToCart(cartId, productId, quantity);
        res.json(updateCart.products);

    } catch(error){
        console.error("Error adding product to cart")
        res.status(500).json({error: "Internal Error Server"})
    }
})


router.delete('/carts/:cid/products/:pid', async (req, res) => {
    try {
        const cartId = req.params.cid;
        const productId = req.params.pid;

        const updatedCart = await cartManager.deleteProductCart(cartId, productId);

        res.json({
            status: 'success',
            message: 'This product was deleted succesfully',
            updatedCart,
        });
    } catch (error) {
        console.error('Error deleting product', error);
        res.status(500).json({
            status: 'error',
            error: 'Internal Server Error',
        });
    }
});


router.put('/carts/:cid', async (req, res) => {
    const cartId = req.params.cid;
    const updatedProducts = req.body;

    try {
        const updatedCart = await cartManager.updateCart(cartId, updatedProducts);
        res.json(updatedCart);
    } catch (error) {
        console.error('Error updating the cart', error);
        res.status(500).json({
            status: 'error',
            error: 'Internal Error Server',
        });
    }
});


router.put('/carts/:cid/products/:pid', async (req, res) => {
    try {
        const cartId = req.params.cid;
        const productId = req.params.pid;
        const newQuantity = req.body.quantity;

        const updatedCart = await cartManager.updateProductQuantity(cartId, productId, newQuantity);

        res.json({
            status: 'success',
            message: 'Quantity updated!',
            updatedCart,
        });
    } catch (error) {
        console.error('Error updating product quantity', error);
        res.status(500).json({
            status: 'error',
            error: 'Internal Server Error',
        });
    }
});

router.delete('/carts/:cid', async (req, res) => {
    try {
        const cartId = req.params.cid;
        
        const updatedCart = await cartManager.emptyCart(cartId);

        res.json({
            status: 'success',
            message: 'The cart was emptied',
            updatedCart,
        });
    } catch (error) {
        console.error('Error emptying cart', error);
        res.status(500).json({
            status: 'error',
            error: 'Internal Server Error',
        });
    }
});

*/

