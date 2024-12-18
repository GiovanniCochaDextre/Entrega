document.addEventListener('DOMContentLoaded', () => {
    let currentPage = 1;
    let totalPages = 1; // Inicialmente asumimos que hay al menos una página
    let sortOrder = '';

    const productsList = document.getElementById("products-list");

    const updatePageInfo = () => {
        document.getElementById('page-info').innerText = `Página ${currentPage} de ${totalPages}`;
    };

    // Actualiza la lista de productos
    const updateProductList = (products) => {
        //productsList.innerHTML = '';  // Limpiar lista actual de productos

        while (productsList.firstChild) {
            productsList.removeChild(productsList.firstChild);
        }

        products.forEach(product => {
            const row = document.createElement('tr');

            const idCell = document.createElement('td');
            const titleCell = document.createElement('td');
            const priceCell = document.createElement('td');
            const actionCell = document.createElement('td');

            idCell.innerText = product.id;
            titleCell.innerText = product.title;
            priceCell.innerText = product.price;
            priceCell.classList.add('price-cell');

            // actionCell.innerHTML = `  
            //     <button class="view-more" data-id="${product.id}">I</button>
            //     <button class="add-to-cart" data-id="${product.id}">+</button>
            //     <button class="remove-from-cart" data-id="${product.id}">-</button>
            // `;

            //he colocado links porque me entiendo que son más eficientes que los botones
            const viewMoreLink = document.createElement('a');
            viewMoreLink.href = `/product/${product.id}`;
            viewMoreLink.classList.add('view-more');
            viewMoreLink.innerText = 'I';
    
            const addToCartLink = document.createElement('a');
            addToCartLink.href = '#';
            addToCartLink.classList.add('add-to-cart');
            addToCartLink.dataset.id = product.id;
            addToCartLink.innerText = '+';
    
            const removeFromCartLink = document.createElement('a');
            removeFromCartLink.href = '#';
            removeFromCartLink.classList.add('remove-from-cart');
            removeFromCartLink.dataset.id = product.id;
            removeFromCartLink.innerText = '-';
    
            // Agregar los enlaces a la celda de acciones
            actionCell.appendChild(viewMoreLink);
            actionCell.appendChild(addToCartLink);
            actionCell.appendChild(removeFromCartLink);            

            row.appendChild(idCell);
            row.appendChild(titleCell);
            row.appendChild(priceCell);
            row.appendChild(actionCell);
            productsList.appendChild(row);
        });




        // Añadir event listeners para los botones
        // document.querySelectorAll('.view-more').forEach(button => {
        //     button.addEventListener('click', (event) => { 
        //         const productId = event.target.dataset.id; 
        //         console.log(`Ver más detalles del producto ${productId}`); 
        //         window.location.href = `/product/${productId}`;
        //     });  // Asegura que el listener se aplique solo una vez
        // });

        // document.querySelectorAll('.add-to-cart').forEach(button => { 
        //     button.addEventListener('click', (event) => { 
        //         const productId = event.target.dataset.id; 
        //         console.log(`Agregar al carrito el producto ${productId}`); 
        //     });  // Asegura que el listener se aplique solo una vez
        // }); 

        // document.querySelectorAll('.remove-from-cart').forEach(button => { 
        //     button.addEventListener('click', (event) => { 
        //         const productId = event.target.dataset.id; 
        //         console.log(`Quitar del carrito el producto ${productId}`); 
        //     });  // Asegura que el listener se aplique solo una vez
        // });

    };

    //******************************************************************************************************************** */
    //* CARRITO DE COMPRAS */

    document.getElementById("view-cart").addEventListener("click", () => {
        const cartId = localStorage.getItem("cartId"); // Obtener el ID del carrito desde localStorage
        //console.log(`ID carrito activo: ${cartId}`);

        if (!cartId) {
            alert("No hay un carrito activo.");
            return;
        }
    
        // Redirigir a la página del carrito
        window.location.href = `/cart/${cartId}`;
    });



    const getOrCreateCart = async () => {
        // Verificar si ya existe un carrito en localStorage
        let cartId = localStorage.getItem("cartId");
    
        if (!cartId) {
            // Si no hay un carrito, llamar a insertOne a través de la API
            try {
                const response = await fetch("/api/carts", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ products: [] }), // Inicia el carrito vacío
                });
    
                const result = await response.json();
    
                if (response.ok) {
                    cartId = result.payload._id; // Captura el ID del carrito creado
                    localStorage.setItem("cartId", cartId); // Almacena el ID en localStorage
                    //console.log(`Nuevo carrito creado con ID: ${cartId}`);
                } else {
                    console.error("Error al crear el carrito:", result.message);
                    alert("Ocurrió un error al crear el carrito.");
                }
            } catch (error) {
                console.error("Error al comunicarse con el servidor:", error);
            }
        }
    
        return cartId;
    };

    document.addEventListener('click', async (event) => {
        if (event.target.classList.contains('add-to-cart')) {
            event.preventDefault(); // Solo prevenimos el comportamiento predeterminado aquí
            const productId = event.target.dataset.id;
            //console.log(`Agregar al carrito el producto ${productId}`);

            const cartId = await getOrCreateCart(); // Obtener o crear el carrito dinámicamente
    
            // Solicitar al usuario que ingrese la cantidad
            const quantity = parseInt(prompt("Ingresa la cantidad a agregar:"), 10);
    
            if (!quantity || quantity <= 0) {
                alert("Por favor, ingresa una cantidad válida mayor a 0.");
                return;
            }
    
            try {
                // Llamar a addOneProduct a través del API
                const response = await fetch(`/api/carts/${cartId}/products/${productId}`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ quantity }), // Enviar la cantidad al backend
                });
    
                const result = await response.json();
    
                if (response.ok) {
                    alert("Producto agregado al carrito correctamente.");
                    console.log(result);
                } else {
                    alert(`Error al agregar el producto: ${result.message}`);
                    console.error(result);
                }
            } catch (error) {
                //console.error("Error al agregar el producto al carrito:", error);
                alert("Ocurrió un error al intentar agregar el producto al carrito.");
            }
        }

        

        if (event.target.classList.contains('remove-from-cart')) {
            event.preventDefault(); // Solo prevenimos el comportamiento predeterminado aquí
            const productId = event.target.dataset.id;
            //console.log(`Quitar del carrito el producto ${productId}`);

            const cartId = localStorage.getItem("cartId"); // Obtener el ID del carrito desde localStorage

            if (!cartId) {
                alert("No hay un carrito activo.");
                return;
            }
    
            try {
                const response = await fetch(`/api/carts/${cartId}/products/${productId}`, {
                    method: "DELETE",
                });
    
                const result = await response.json();
    
                if (response.ok) {
                    alert("Producto eliminado del carrito correctamente.");
                    console.log(result);
                } else {
                    alert(`Error al eliminar el producto: ${result.message}`);
                    console.error(result);
                }
            } catch (error) {
                //console.error("Error al eliminar el producto del carrito:", error);
                alert("Ocurrió un error al intentar eliminar el producto del carrito.");
            }


        }
    });
    //************************************************************************************************************************** */


    const fetchProducts = async (page, sort) => {
        try {
            const response = await fetch(`/api/products?page=${page}&limit=10&sort=${sort}`, { method: "GET" });
            const data = await response.json();
            totalPages = data.payload.totalPages; // Actualiza el número total de páginas
            updatePageInfo();
            updateProductList(data.payload.docs);  // Actualiza la lista de productos
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    document.getElementById('first-page').addEventListener('click', () => {
        currentPage = 1;
        fetchProducts(currentPage, sortOrder);
    });

    document.getElementById('prev-page').addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            fetchProducts(currentPage, sortOrder);
        }
    });

    document.getElementById('next-page').addEventListener('click', () => {
        if (currentPage < totalPages) {
            currentPage++;
            fetchProducts(currentPage, sortOrder);
        }
    });

    document.getElementById('last-page').addEventListener('click', () => {
        currentPage = totalPages;
        fetchProducts(currentPage, sortOrder);
    });

    // Ordenar productos
    document.getElementById('sort-asc').addEventListener('click', () => {
        sortOrder = 'price_asc';
        fetchProducts(currentPage, sortOrder);
    });

    document.getElementById('sort-desc').addEventListener('click', () => {
        sortOrder = 'price_desc';
        fetchProducts(currentPage, sortOrder);
    });

    document.getElementById('sort-none').addEventListener('click', () => {
        sortOrder = '';
        fetchProducts(currentPage, sortOrder);
    });

    //console.log("Cargando productos...");
    fetchProducts(currentPage, sortOrder); // Carga inicial de la primera página
});

