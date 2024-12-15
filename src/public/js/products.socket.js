// Establece la conexión con el servidor usando Socket.IO
const socket = io();

// // Evento que se activa al conectar con el servidor
// socket.on("connect", () => {
//     // Indica que la conexión fue exitosa
//     console.log("Conectado al Server");
// });

// // Evento que se activa al desconectarse del servidor
// socket.on("disconnect", () => {
//     // Indica que se perdió la conexión
//     console.log("Se desconecto el server");
// });


const productsList = document.getElementById("products-list");
const productsForm = document.getElementById("products-form");
const inputProductId = document.getElementById("input-product-id");
const btnDeleteProduct = document.getElementById("btn-delete-product");
const errorMessage = document.getElementById("error-message")

socket.on("products-list", (data) => {
    const products = data.products.docs ?? [];

    productsList.innerText = "";

    products.forEach((product) => {
        productsList.innerHTML += `<li>${product.id} - Nombre: ${product.title} </li>`;
    });
});

productsForm.onsubmit = (event) => {
    event.preventDefault();
    const form = event.target;
    const formdata = new FormData(form);

    errorMessage.innerText = "";
    form.reset();

    socket.emit("insert-product", {
        title: formdata.get("title"),
        description: formdata.get("description"),
        code: formdata.get("code"),
        price: formdata.get("price"),
        category: formdata.get("category"),
        status: formdata.get("status") || "off",
        stock: formdata.get("stock"),
    });
    
};

btnDeleteProduct.onclick = () => {
    const id = Number(inputProductId.value);
    inputProductId.innerText = "";
    errorMessage.innerText = "";

    if (id > 0) {
        socket.emit("delete-product", { id });
    }
};


socket.on("error-message", (data) => {
    errorMessage.innerText = data.message;
});

