const express = require("express");
const app = express();
const PUERTO = 8080;
const productsRouter = require("./routes/products.router.js");
const cartsRouter = require("./routes/carts.router.js")

// MIDDLEWARE

app.use(express.urlencoded({extended: true}));
app.use(express.json());

// ROUTES
app.use("/api", productsRouter);
app.use("/api", cartsRouter)



app.listen(PUERTO, () =>{
    console.log(`Escuchando en http://localhost:${PUERTO}`)
});


