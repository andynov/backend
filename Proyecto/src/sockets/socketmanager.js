const socket = require("socket.io");
const ProductRepository = require("../repositories/product.repository.js");
const productRepository = new ProductRepository(); 

class SocketManager {
    constructor(httpServer) {
        this.io = socket(httpServer);
        this.initSocketEvents();
    }

    async initSocketEvents() {
        this.io.on("connection", async (socket) => {
            console.log("A client is connected");
            
            socket.emit("products", await productRepository.getProducts() );

            socket.on("deleteProduct", async (id) => {
                await productRepository.deleteProduct(id);
                this.emitUpdatedProducts(socket);
            });

            socket.on("addProduct", async (product) => {
                await productRepository.addProduct(product);
                this.emitUpdatedProducts(socket);
            });

            });
    }

    async emitUpdatedProducts(socket) {
        socket.emit("products", await productRepository.getProducts());
    }
}

module.exports = SocketManager;