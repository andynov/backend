function deleteCartProduct(cartId, productId) {
    fetch(`/api/carts/${cartId}/product/${productId}`, {
        method: 'DELETE'
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error deletting cart product');
            }
            location.reload();
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function emptyCart(cartId) {
    fetch(`/api/carts/${cartId}`, {
        method: 'DELETE'
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error emptying cart');
            }
            location.reload();
        })
        .catch(error => {
            console.error('Error:', error);
        });
}