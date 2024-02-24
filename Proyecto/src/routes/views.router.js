const express = require("express");
const router = express.Router();
const ProductManager = require("../dao/db/product-manager-db.js");
const CartManager = require("../dao/db/cart-manager-db.js");
const productManager = new ProductManager();
const cartManager = new CartManager();

router.get("/products", async (req, res) => {
   try {
      const { page = 1, limit = 2 } = req.query;
      const products = await productManager.getProducts({
         page: parseInt(page),
         limit: parseInt(limit)
      });

      const newArray = products.docs.map(product => {
         const { _id, ...rest } = product.toObject();
         return rest;
      });

      res.render("products", {
         products: newArray,
         hasPrevPage: products.hasPrevPage,
         hasNextPage: products.hasNextPage,
         prevPage: products.prevPage,
         nextPage: products.nextPage,
         currentPage: products.page,
         totalPages: products.totalPages
      });

   } catch (error) {
      console.error("Error getting products", error);
      res.status(500).json({
         status: 'error',
         error: "Internal error server"
      });
   }
});

router.get("/carts/:cid", async (req, res) => {
   const cartId = req.params.cid;

   try {
      const cart = await cartManager.getCartById(cartId);

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
});

router.get("/login", (req, res) => {
   if (req.session.login) {
       return res.redirect("/profile");
   }

   res.render("login");
});

router.get("/register", (req, res) => {
   if (req.session.login) {
       return res.redirect("/profile");
   }
   res.render("register");
});

router.get("/profile", (req, res) => {
   if (!req.session.login) {
       return res.redirect("/login");
   }

   res.render("profile", { user: req.session.user });
});

module.exports = router; 