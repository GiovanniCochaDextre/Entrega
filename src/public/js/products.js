const productsList = document.getElementById("products-list");
const btnRefreshProductsList = document.getElementById("btn-refresh-products-list");

const loadProductsList = async () => {
    const response = await fetch("/api/products",{method: "GET"});
    const data = await  response.json();
    const products = data.payload.docs ?? [];

    productsList.innerText = "";

    products.forEach((product) => { 
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

btnRefreshProductsList.addEventListener("click", () => {
    loadProductsList();
});

loadProductsList();
