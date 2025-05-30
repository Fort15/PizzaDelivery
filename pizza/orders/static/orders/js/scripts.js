function showOrderItems(orderId) {
    fetch(`/orders/order/${orderId}/items/`)
        .then(response => response.json())
        .then(data => {
            let list = document.getElementById('modal-items-list');
            list.innerHTML = '';
            if (data.items.length === 0) {
                list.innerHTML = '<li>Нет товаров</li>';
            } else {
                data.items.forEach(function(item) {
                    let li = document.createElement('li');
                    li.innerHTML = `
                        <span class="item-name">${item.name}</span>
                        <span class="item-count">×${item.quantity}</span>
                        <span class="item-price">${item.price} ₽</span>
                    `;
                    list.appendChild(li);
                });
            }
            document.getElementById('items-modal-bg').style.display = 'block';
        });
}
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('close-modal').onclick = function() {
        document.getElementById('items-modal-bg').style.display = 'none';
    }
    document.getElementById('items-modal-bg').onclick = function(e) {
        if (e.target === this) this.style.display = 'none';
    };
});