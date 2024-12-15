import { Schema, model } from "mongoose";
import paginate from "mongoose-paginate-v2";

const productSchema = new Schema({
    title: {
        index: { name: "idx_title" },
        type: String,
        required: [ true, "El nombre es obligatorio" ],
        uppercase: true,
        trim: true,
        minLength: [ 3, "El nombre debe tener al menos 3 caracteres" ],
        maxLength: [ 50, "El nombre debe tener como máximo 50 caracteres" ],
    },
    description: {
        type: String,
        required: [ true, "La descripción es obligatorio" ],
        uppercase: true,
        trim: true,
        minLength: [ 3, "La descripción debe tener al menos 3 caracteres" ],
        maxLength: [ 200, "La descripción debe tener como máximo 200 caracteres" ],
    },    
    code: {
        index: { name: "idx_code" },
        type: String,
        required: [ true, "El código es obligatorio" ],
        uppercase: true,
        trim: true,
        minLength: [ 3, "El código debe tener al menos 3 caracteres" ],
        maxLength: [ 15, "El código debe tener como máximo 15 caracteres" ],
    },    
    price: {
        type: Number,
        required: [ true, "El precio es obligatorio" ],
        min: [ 0, "El precio debe ser un valor positivo" ],
    },    
    stock: {
        type: Number,
        required: [ true, "El stock es obligatorio" ],
        min: [ 0, "El stock debe ser un valor positivo" ],
    },
    category: {
        index: { name: "idx_category" },
        type: String,
        required: [ true, "La categoría es obligatoria" ],
        uppercase: true,
        trim: true,
        minLength: [ 3, "La categoría debe tener al menos 3 caracteres" ],
        maxLength: [ 25, "La categoría debe tener como máximo 25 caracteres" ],
    },    
    status: {
        type: Boolean,
        required: [ true, "El estado es obligatorio" ],
    },    
    thumbnail: {
         type: String,
         trim: true,
    },
}, {
    timestamps: true, // Añade timestamps para generar createdAt y updatedAt
    versionKey: false, // Elimina el campo __v de versión
});

// Índice compuesto para nombre y apellido
productSchema.index({ category: 1, title: 1 }, { name: "idx_category_title" });

// Agrega mongoose-paginate-v2 para habilitar las funcionalidades de paginación.
productSchema.plugin(paginate);

const ProductModel = model("products", productSchema);

export default ProductModel;