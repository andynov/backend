const express = require("express");
const router = express.Router();
const CartManager = require("../dao/db/cart-manager-db.js");
const cartManager = new CartManager;

// ROUTING

router.post("/carts", async (req, res) =>{
    try{
        const newCart = await cartManager.addCart();
        res.json(newCart);

    } catch(error) {
        console.error("Error adding Cart", error)
        res.status(500).json({error: "Internal error server"});
    }
})

router.get("/carts/:cid", async (req, res) =>{
    const cartId = req.params.cid;
    try{
        const cart = await cartManager.getCartById(cartId);
        res.json(cart.products)
    } catch(error){
        console.error("Error getting cart", error)
        res.status(500).json({error: "Internal Error Server"})
    }
})

router.post("/carts/:cid/product/:pid", async (req, res) => {
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

module.exports = router;