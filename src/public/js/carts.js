document.addEventListener('DOMContentLoaded', () => {
    // Lógica para eliminar productos del carrito
    document.querySelectorAll('.btn-delete-product').forEach(button => {
        button.addEventListener('click', async (event) => {
            const productId = event.target.dataset.productId;
            //console.log("Product ID: ", productId);

            const cartId = localStorage.getItem("cartId"); // Obtener el ID del carrito desde localStorage
            //console.log("Cart ID: ", cartId); 

            if (!cartId) {
                alert("No hay un carrito activo.");
                return;
            }

            try {
                // Llamada al API para eliminar el producto del carrito
                const response = await fetch(`/api/carts/${cartId}/products/${productId}`, {
                    method: "DELETE",
                });

                const result = await response.json();

                if (response.ok) {
                    alert("Producto eliminado del carrito.");
                    //console.log(result);
                    location.reload(); // Recargar la página para reflejar el cambio en el carrito
                } else {
                    alert(`Error al eliminar el producto: ${result.message}`);
                    //console.error(result);
                }
            } catch (error) {
                //console.error("Error al eliminar el producto del carrito:", error);
                alert("Ocurrió un error al intentar eliminar el producto del carrito.");
            }
        });
    });
});
