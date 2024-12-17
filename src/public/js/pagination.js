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
        productsList.innerHTML = '';  // Limpiar lista actual de productos

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

            actionCell.innerHTML = `  
                <button class="view-more" data-id="${product.id}">I</button>
                <button class="add-to-cart" data-id="${product.id}">+</button>
                <button class="remove-from-cart" data-id="${product.id}">-</button>
            `;

            row.appendChild(idCell);
            row.appendChild(titleCell);
            row.appendChild(priceCell);
            row.appendChild(actionCell);
            productsList.appendChild(row);
        });

        // Añadir event listeners para los botones
        document.querySelectorAll('.view-more').forEach(button => {
            button.addEventListener('click', (event) => { 
                const productId = event.target.dataset.id; 
                console.log(`Ver más detalles del producto ${productId}`); 
            }); 
        }); 
        
        document.querySelectorAll('.add-to-cart').forEach(button => { 
            button.addEventListener('click', (event) => { 
                const productId = event.target.dataset.id; 
                console.log(`Agregar al carrito el producto ${productId}`); 
            }); 
        }); 
        
        document.querySelectorAll('.remove-from-cart').forEach(button => { 
            button.addEventListener('click', (event) => { 
                const productId = event.target.dataset.id; 
                console.log(`Quitar del carrito el producto ${productId}`); 
            }); 
        });
    };

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

    fetchProducts(currentPage, sortOrder); // Carga inicial de la primera página
});


// document.addEventListener('DOMContentLoaded', () => {
//     let currentPage = 1;
//     let totalPages = 1; // Inicialmente asumimos que hay al menos una página
//     let sortOrder = '';

//     const productsList = document.getElementById("products-list");

//     const updatePageInfo = () => {
//         document.getElementById('page-info').innerText = `Página ${currentPage} de ${totalPages}`;
//     };

//     const fetchProducts = async (page, sort) => {
//         try {
//             const response = await fetch(`/api/products?page=${page}&limit=10&sort=${sort}`, { method: "GET" });
//             const data = await response.json();
//             totalPages = data.payload.totalPages; // Actualiza el número total de páginas
//             updatePageInfo();

//             productsList.innerHTML = '';

//             data.payload.docs.forEach(product => {
//                 const row = document.createElement('tr');
//                 const idCell = document.createElement('td');
//                 const titleCell = document.createElement('td');
//                 const priceCell = document.createElement('td');
//                 const actionCell = document.createElement('td');

//                 idCell.innerText = product.id;
//                 titleCell.innerText = product.title;
//                 priceCell.innerText = product.price;
//                 priceCell.classList.add('price-cell');

//                 actionCell.innerHTML = ` 
//                     <button class="view-more" data-id="${product.id}">I</button> 
//                     <button class="add-to-cart" data-id="${product.id}">+</button> 
//                     <button class="remove-from-cart" data-id="${product.id}">-</button> 
//                 `;

//                 // actionCell.innerHTML = ` 
//                 //     <button class="view-more" data-id="${product.id}"> 
//                 //         <i class="fas fa-eye"></i> 
//                 //     </button> 
//                 //     <button class="add-to-cart" data-id="${product.id}"> 
//                 //         <i class="fas fa-cart-plus"></i> 
//                 //     </button> 
//                 //     <button class="remove-from-cart" data-id="${product.id}"> 
//                 //         <i class="fas fa-cart-arrow-down"></i> 
//                 //     </button> 
//                 // `;

//                 row.appendChild(idCell);
//                 row.appendChild(titleCell);
//                 row.appendChild(priceCell);
//                 row.appendChild(actionCell);
//                 productsList.appendChild(row);
//             });

//             // Añadir event listeners para los botones 
//             document.querySelectorAll('.view-more').forEach(button => {
//                 button.addEventListener('click', (event) => { 
//                     const productId = event.target.dataset.id; 
//                     console.log(`Ver más detalles del producto ${productId}`); 
//                 }); 
//             }); 
            
//             document.querySelectorAll('.add-to-cart').forEach(button => { 
//                 button.addEventListener('click', (event) => { 
//                     const productId = event.target.dataset.id; 
//                     console.log(`Agregar al carrito el producto ${productId}`); 
//                 }); 
//             }); 
            
//             document.querySelectorAll('.remove-from-cart').forEach(button => { 
//                 button.addEventListener('click', (event) => { 
//                     const productId = event.target.dataset.id; 
//                     console.log(`Quitar del carrito el producto ${productId}`); 
//                 }); 
//             });

//         } catch (error) {
//             console.error('Error fetching products:', error);
//         }
//     };

//     document.getElementById('first-page').addEventListener('click', () => {
//         currentPage = 1;
//         fetchProducts(currentPage, sortOrder);
//     });

//     document.getElementById('prev-page').addEventListener('click', () => {
//         if (currentPage > 1) {
//             currentPage--;
//             fetchProducts(currentPage, sortOrder);
//         }
//     });

//     document.getElementById('next-page').addEventListener('click', () => {
//         if (currentPage < totalPages) {
//             currentPage++;
//             fetchProducts(currentPage, sortOrder);
//         }
//     });

//     document.getElementById('last-page').addEventListener('click', () => {
//         currentPage = totalPages;
//         fetchProducts(currentPage, sortOrder);
//     });

//     document.getElementById('sort-asc').addEventListener('click', () => {
//         sortOrder = 'price_asc';
//         fetchProducts(currentPage, sortOrder);
//     });

//     document.getElementById('sort-desc').addEventListener('click', () => {
//         sortOrder = 'price_desc';
//         fetchProducts(currentPage, sortOrder);
//     });

//     document.getElementById('sort-none').addEventListener('click', () => {
//         sortOrder = '';
//         fetchProducts(currentPage, sortOrder);
//     });

//     fetchProducts(currentPage, sortOrder); // Carga inicial de la primera página
// });
