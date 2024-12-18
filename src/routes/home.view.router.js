import { Router } from "express";

import ProductManager from "../managers/ProductManager.js";  //para mostrar detalle del producto
import CartManager from "../managers/CartManager.js"; 


const router = Router();
const productManager = new ProductManager(); //para mostrar detalle del producto
const cartManager = new CartManager();

router.get("/", async (req, res) => {
    try {
        res.render("home", { title: "Inicio" });
    } catch (error) {
        res.status(500).send(`<h1>Error</h1><h3>${error.message}</h3>`);
    }
});


router.get("/realTimeProducts", async (req, res) => {
    try {
        res.render("realTimeProducts", { title: "Inicio" });
    } catch (error) {
        res.status(500).send(`<h1>Error</h1><h3>${error.message}</h3>`);
    }
});


//nuevo pagina que muestra detalle del prducto
router.get("/product/:id", async (req, res) => {
    const productId = req.params.id;
    //console.log("Buscando producto con ID:", productId);  // Log para ver qué ID estás recibiendo

    try {
        const productResponse = await productManager.getOneById(productId);
        //console.log("Producto encontrado:", productResponse);  // Verifica la respuesta de la API

        if (productResponse) {
            const product = productResponse.toObject(); // Extrae 'payload' con los datos del producto
            res.render("productDetails", { title: "Detalles del Producto", product });
        } else {
            //console.log("Producto no encontrado con ID:", productId);  // Si no se encuentra el producto
            res.status(404).render("error404", { title: "Producto no encontrado" });
        }
    } catch (error) {
        //console.error("Error al obtener detalles del producto:", error);
        res.status(500).render("error404", { title: "Error Interno del Servidor", message: error.message });
    }
});

//obtener carrtito
router.get("/cart/:id", async (req, res) => {
    const cartId = req.params.id;

    try {
        const cart = await cartManager.getOneById(cartId);
        
        if (!cart || cart.products.length === 0) {
            return res.render("cartDetails", { title: "Carrito", cart: { products: [] } });
        }

        res.render("cartDetails", { title: "Detalles del Carrito", cart });
    } catch (error) {
        console.error("Error al obtener el carrito:", error);
        res.status(500).render("error404", { title: "Error Interno del Servidor", message: error.message });
    }
});


export default router;