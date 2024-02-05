const express = require("express");
const app = express();
const PUERTO = 8080;
const exphbs = require("express-handlebars");
const socket = require("socket.io");
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

const httpServer = app.listen(PUERTO, () =>{
    console.log(`Escuchando en http://localhost:${PUERTO}`)
});


// Para el desafío, agregamos el chat:

const MessageModel = require("./dao/models/message.model.js")

const io = new socket.Server(httpServer);


let messages = []; 


io.on("connection", (socket) => {
    console.log("Nuevo usuario conectado");

    socket.on("message", async data => {
        await MessageModel.create(data);
        const messages = await MessageModel.find();
        io.sockets.emit("message", messages)
    })
})
