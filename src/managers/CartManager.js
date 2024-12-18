import ErrorManager from "./ErrorManager.js";
import { isValidID } from "../config/mongoose.config.js";
import CartModel from "../models/cart.model.js";

export default class CartManager {
    #cartModel;

    constructor() {
        this.#cartModel = CartModel;
    }

    // Busca una receta por su ID
    async #findOneByIdPopulate(id) {
        if (!isValidID(id)) {
            throw new ErrorManager("ID inválido", 400);
        }

        const cart = await this.#cartModel.findById(id).populate("products.product").lean();

        if (!cart) {
            throw new ErrorManager("ID no encontrado", 404);
        }

        return cart;
    }

    async #findOneById(id) {
        if (!isValidID(id)) {
            throw new ErrorManager("ID inválido", 400);
        }

        const cart = await this.#cartModel.findById(id);

        if (!cart) {
            throw new ErrorManager("ID no encontrado", 404);
        }

        return cart;
    }
    // Obtiene una lista de carritos
    async getAll(params) {
        try {
            const paginationOptions = {
                limit: params?.limit || 10, // Número de documentos por página (por defecto 10)
                page: params?.page || 1, // Página actual (por defecto 1)
                lean: true, // Convertir los resultados en objetos planos
            };

            return await this.#cartModel.paginate({}, paginationOptions);
        } catch (error) {
            throw ErrorManager.handleError(error);
        }
    }

    // Obtiene un carrito específico por su ID
    async getOneById(id) {
        try {
            return await this.#findOneByIdPopulate(id);
        } catch (error) {
            throw ErrorManager.handleError(error);
        }
    }

    // Inserta un carrito
    async insertOne(data) {
        try {
            const cart = await this.#cartModel.create(data);
            return cart;
        } catch (error) {
            throw ErrorManager.handleError(error);
        }
    }

    // Agrega un producto a un carrito o incrementa la cantidad de un producto existente
    async addOneProduct(id, productId, quantity) {
        try {
            const cart = await this.#findOneById(id);
            const productIndex = cart.products.findIndex((item) => item.product._id.toString() === productId);

            if (productIndex >= 0) {
                cart.products[productIndex].quantity = quantity;   //si existe se agrega la cantidad indicada
            } else {
                cart.products.push({ product: productId, quantity: quantity });  //si no existe se inserta la cantidad enviada
            }

            await cart.save();

            return cart;
        } catch (error) {
            throw new ErrorManager(error.message, error.code);
        }
    }

    //elimina todo el carrito
    async deleteOneById(id) {
        try {
            const cart = await this.#findOneById(id);
            await cart.deleteOne();
        } catch (error) {
            throw ErrorManager.handleError(error);
        }
    }   
    
    //elimina un producto del carrito
    async deleteOneProduct(id, productId) {
        try {
            const cart = await this.#findOneById(id);

            if (!cart) {
                throw new ErrorManager("Carrito no encontrado", 404);
            }

            const productIndex = cart.products.findIndex((item) => item.product._id.toString() === productId); 
            if (productIndex === -1) {
                throw new ErrorManager("ID del producto no encontrado", 404); 
            } 
            
            cart.products.splice(productIndex, 1); // Elimina el producto del array 
            await cart.save();

            return cart;

        } catch (error) {
            throw new ErrorManager(error.message, error.code);
        }
    }
}