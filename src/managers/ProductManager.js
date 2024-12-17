import ErrorManager from "./ErrorManager.js";
import { isValidID } from "../config/mongoose.config.js";
import ProductModel from "../models/product.model.js";
import { convertToBoolean } from "../utils/converter.js";

export default class ProductManager {
    #productModel;

    constructor() {
        this.#productModel = ProductModel;
    }

    // Busca un producte por su ID
    async #findOneById(id) {
        if (!isValidID(id)) {
            throw new ErrorManager("ID inválido", 400);
        }

        const product = await this.#productModel.findById(id);

        if (!product) {
            throw new ErrorManager("ID no encontrado", 404);
        }

        return product;
    }

    // Obtiene una lista de productos
    async getAll(params) {
        try {
            const $and = [];

            if (params?.title) $and.push({ title: { $regex: params.title, $options: "i" } });
            if (params?.category) $and.push({ category: { $regex: params.category, $options: "i" } });

            if (params?.status !== undefined) {
                const status = params.status.toLowerCase() === 'true' || params.status === '1' || params.status.toLowerCase() === 'on';   //status me indica disponibilidad = si viene true, 1, on => filtra todos los productos con status=true  = disponibles
                $and.push({ status: status }); 
            }

            if (params?.stock_gt) $and.push({ stock: { $gt: parseInt(params.stock_gt) } });  //filtro por stock, consultar stock > variable 

            const filters = $and.length > 0 ? { $and } : {};

            const sort = {   //ordenamiento por precio o titulo
                price_asc: { price: 1, title: 1 },   
                price_desc: { price: -1, title: 1 },
                title_asc: { title: 1, price: 1 },
                title_desc: { title: -1, price: 1 },
            };

            const sortOption = sort[params?.sort] ?? {};

            const paginationOptions = {
                limit: params?.limit || 10, // Número de documentos por página (por defecto 10)
                page: params?.page || 1, // Página actual (por defecto 1)
                sort: sortOption, // Ordenamiento (sin orden por defecto)
                lean: true, // Convertir los resultados en objetos planos
            };

            return await this.#productModel.paginate(filters, paginationOptions);
        } catch (error) {
            throw ErrorManager.handleError(error);
        }
    }

    // Obtiene un producto específico por su ID
    async getOneById(id) {
        try {
            return await this.#findOneById(id);
        } catch (error) {
            throw ErrorManager.handleError(error);
        }
    }

    // Inserta un producto
    async insertOne(data) {
        try {
            const product = await this.#productModel.create({
                ...data,
                status: convertToBoolean(data.status),
            });

            return product;
        } catch (error) {
            throw ErrorManager.handleError(error);
        }
    }

    // Actualiza un producto en específico
    async updateOneById(id, data) {
        try {
            const product = await this.#findOneById(id);
            const newValues = {
                ...product,
                ...data,
                status: data.status ? convertToBoolean(data.status) : product.status,
            };

            product.set(newValues);
            product.save();

            return product;
        } catch (error) {
            throw ErrorManager.handleError(error);
        }
    }

    // Elimina un producto en específico
    async deleteOneById(id) {
        try {
            const product = await this.#findOneById(id);
            await product.deleteOne();
        } catch (error) {
            throw ErrorManager.handleError(error);
        }
    }
}