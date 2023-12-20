const ProductManager = require("./ProductManager")

const manager = new ProductManager("./products.json")

const express = require("express");

const app = express();

const PUERTO = 8080;


// Limitar el número de elementos del array y mostrarlo:

app.get("/products", async (req, res) => {
    try{
        const arrayProducts = await manager.readProduct();
        let limit = parseInt(req.query.limit);

        if (limit) {
            const arrayLimited = arrayProducts.slice(0, limit);
            return res.send(arrayLimited)
        } else{
            return res.send(arrayProducts);
        }

    } catch(error) {
        console.log(error);
        return res.send("Error al procesar tu pedido")
    }
})

// Retornar un elemento del array por ID:

app.get("/products/:pid", async (req, res) => {
    try{
        let pid = parseInt(req.params.pid)
        const searched = await manager.getProductById(pid);

        if (searched) {
            return res.send(searched);
        } else{
            return res.send("ID de Producto incorrecto");
        }

    } catch(error){
        console.log(error);
        return res.send("Error al retornar el elemento")
    }
})

app.listen(PUERTO, () =>{
    console.log(`Escuchando en http://localhost:${PUERTO}`)
})


