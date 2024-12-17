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

    // products.forEach((product) => {
    //     productsList.innerHTML += `<>${product.id} - Nombre: ${product.title}- Precio: ${product.price}</li>`;

    // });

    products.forEach((product) => { 
        const row = document.createElement('tr'); 
        const idCell = document.createElement('td'); 
        const titleCell = document.createElement('td'); 
        const priceCell = document.createElement('td'); 

        idCell.innerText = product.id; 
        titleCell.innerText = product.title; 
        priceCell.innerText = product.price; 
        priceCell.classList.add('price-cell'); 
        
        row.appendChild(idCell); 
        row.appendChild(titleCell); 
        row.appendChild(priceCell); 
        productsList.appendChild(row); 
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
    const id = inputProductId.value;

    inputProductId.value = "";
    errorMessage.innerText = "";

    if (id != "") {
        socket.emit("delete-product", { id });
    }
};


socket.on("error-message", (data) => {
    errorMessage.innerText = data.message;
});

