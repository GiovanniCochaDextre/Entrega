import handlebars from "express-handlebars";
import paths from "../utils/paths.js";

// Configura el servidor para usar Handlebars como motor de plantillas
export const config = (app) => {
    // Registra el motor de plantillas Handlebars
    //app.engine("handlebars", handlebars.engine());

    app.engine(
        "handlebars",
        handlebars.engine({
            helpers: {
                multiply: (a, b) => a * b, // Multiplica dos valores
            },
            runtimeOptions: {
                allowProtoPropertiesByDefault: true, // Habilita acceso a propiedades heredadas
                allowProtoMethodsByDefault: true,    // Habilita acceso a métodos heredados
            },
        })
    );    

    // Establece la carpeta donde se encuentran las vistas
    app.set("views", paths.views);

    // Define Handlebars como el motor de vistas por defecto
    app.set("view engine", "handlebars");
};