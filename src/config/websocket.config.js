import { Server } from "socket.io";
import ProductManager from "../managers/ProductManager.js";

const productManager = new ProductManager();

// Configura el servidor Socket.IO
export const config = (httpServer) => {
    // Crea una nueva instancia del servidor Socket.IO
    const socketServer = new Server(httpServer);

    // Escucha el evento de conexión de un nuevo cliente
    socketServer.on("connection", async (socket) => {
        socketServer.emit("products-list", { products : await productManager.getAll() })

        socket.on("insert-product", async (data) => {
            try {
                await productManager.insertOne(data);
                socketServer.emit("products-list", { products : await productManager.getAll() })
            } catch (error) {
                socketServer.emit("error-message", { message : error.message });
            }
        });

        socket.on("delete-product", async (data) => {
            try {
                await productManager.deleteOneById(data.id);
                socketServer.emit("products-list", { products : await productManager.getAll() })
            } catch (error) {
                socketServer.emit("error-message", { message : error.message });
            }
        });
    });

};