const express = require("express");
const app = express();
const PUERTO = 8080;
const exphbs = require("express-handlebars");
const socket = require("socket.io");

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
app.use("/api", viewsRouter);

// SOCKET

const ProductManager = require("./controllers/product-manager.js");
const productManager = new ProductManager("./src/models/products.json");

const server = app.listen(PUERTO, () =>{
    console.log(`Escuchando en http://localhost:${PUERTO}`)
});

const io = socket(server);




io.on("connection", async (socket) => {
    console.log("Nuevo cliente conectado");


    socket.emit("products", await productManager.getProducts());

    socket.on("deleteProduct", async (id) => {
        await productManager.deleteProduct(id);
        io.sockets.emit("products", await productManager.getProducts());
    });
});

socket.on("addProduct", async (product) => {
    await productManager.addProduct(product);
    io.sockets.emit("products", await productManager.getProducts());
});

