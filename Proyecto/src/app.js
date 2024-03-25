const express = require("express");
const app = express();
const PUERTO = 8080;
const exphbs = require("express-handlebars");
const cookieParser = require("cookie-parser");
const session = require("express-session");
require("./database.js");
const MongoStore = require("connect-mongo");
const userRouter = require("./routes/user.router.js");
const sessionRouter = require("./routes/sessions.router.js");
const productsRouter = require("./routes/products.router.js");
const cartsRouter = require("./routes/carts.router.js");
const viewsRouter = require("./routes/views.router.js");
const passport = require("passport");
const initializePassport = require("./config/passport.config.js");

// MIDDLEWARE

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(express.static("./src/public"));
app.use(cookieParser());

// PASSPORT LOGIN
app.use(session({
    secret: "secretCoder",
	resave: true,
	saveUninitialized: true,
	store: MongoStore.create({
		mongoUrl: "mongodb+srv://andresnovmusica:coderhouse@cluster0.er55ipy.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=Cluster0",
		ttl: 90,
    })
}))

initializePassport();
app.use(passport.initialize());
app.use(passport.session());

// HANDLEBARS

app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");

// ROUTES
app.use("/api", productsRouter);
app.use("/api", cartsRouter);
app.use("/", viewsRouter);
app.use("/api/users", userRouter);
app.use("/api/sessions", sessionRouter);

app.get("/createcookie", (req, res) => {
    res.cookie("cookie", "This is a cookie").send("Cookie created");
})

app.get("/clearcookie", (req, res) => {
    res.clearCookie("cookie").send("Cookie cleared");
});

app.get("/login", (req, res) => {
    let user = req.query.user; 

    req.session.user = user; 
    res.send("Saving the user through query");
})

app.get("/user", (req, res) => {
    if(req.session.user) {
        return res.send(`The registered user is: ${req.session.user} `);
    }
    res.send("We don't have a registered user");
})

app.listen(PUERTO, () =>{
    console.log(`Escuchando en http://localhost:${PUERTO}`)
});
