const express = require("express");
const app = express();
const PUERTO = 8080;
const exphbs = require("express-handlebars");
const cookieParser = require("cookie-parser");
require("./database.js");
const userRouter = require("./routes/user.router.js");
const productsRouter = require("./routes/products.router.js");
const cartsRouter = require("./routes/carts.router.js");
const viewsRouter = require("./routes/views.router.js");
const passport = require("passport");
const initializePassport = require("./config/passport.config.js");

// MIDDLEWARE

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(express.static("./src/public"));

// PASSPORT
app.use(cookieParser());
app.use(passport.initialize());
initializePassport();

// HANDLEBARS

app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");

// AUTHMIDDLEWARE
const authMiddleware = require("./middleware/authmiddleware.js");
app.use(authMiddleware);

// ROUTES
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/api/users", userRouter);
app.use("/", viewsRouter);


const httpServer = app.listen(PUERTO, () =>{
    console.log(`Listen in http://localhost:${PUERTO}`)
});

///Websockets: 
const SocketManager = require("./sockets/socketmanager.js");
new SocketManager(httpServer);