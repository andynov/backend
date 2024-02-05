// Guardo el SOCKET que había antes, por las dudas:

// SOCKET

const ProductManager = require("./controllers/product-manager.js");
const productManager = new ProductManager("./src/models/products.json");

const io = socket(server);


io.on("connection", async (socket) => {
    console.log("New client connected");


    socket.emit("products", await productManager.getProducts());

    socket.on("deleteProduct", async (id) => {
        await productManager.deleteProduct(id);
        io.sockets.emit("products", await productManager.getProducts());
    });

    socket.on("addProduct", async (product) => {
        await productManager.addProduct(product);
        io.sockets.emit("products", await productManager.getProducts());
    });
});

