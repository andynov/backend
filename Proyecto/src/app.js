const express = require("express");
const app = express();
const PUERTO = 8080;
const exphbs = require("express-handlebars");
require("./database.js");

const productsRouter = require("./routes/products.router.js");
const cartsRouter = require("./routes/carts.router.js");
const viewsRouter = require("./routes/views.router.js")

// MIDDLEWARE

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(express.static("./src/public"));

// HANDLEBARS

app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");

// ROUTES
app.use("/api", productsRouter);
app.use("/api", cartsRouter);
app.use("/", viewsRouter);

app.listen(PUERTO, () =>{
    console.log(`Escuchando en http://localhost:${PUERTO}`)
});
