let map;


document.addEventListener('DOMContentLoaded', function() {

    let cart = [];
    const cartIcon = document.getElementById('cart-icon');
    const cartDropdown = document.getElementById('cart-dropdown');
    const cartItems = document.getElementById('cart-items');
    const cartCount = document.querySelector('.cart-count');
    const totalPrice = document.getElementById('total-price');

    // Открытие/закрытие корзины
    cartIcon.addEventListener('click', function() {
        cartDropdown.style.display = cartDropdown.style.display === 'block' ? 'none' : 'block';
    });

    // Добавление в корзину
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function() {
            const productId = this.dataset.productId;
            const productName = this.dataset.productName;
            const price = parseInt(this.dataset.price);

            // Проверяем, есть ли уже товар в корзине
            const existingItem = cart.find(item => item.id === productId);

            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.push({
                    id: productId,
                    name: productName,
                    price: price,
                    quantity: 1
                });
            }

            updateCart();
        });
    });

    // Обновление корзины
    function updateCart() {
        // Очищаем корзину
        cartItems.innerHTML = '';

        let total = 0;

        // Добавляем товары
        cart.forEach(item => {
            total += item.price * item.quantity;

            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <div>
                    <div>${item.name}</div>
                    <div>${item.price} руб. × ${item.quantity}</div>
                </div>
                <div class="quantity-control">
                    <button class="decrement" data-id="${item.id}">-</button>
                    <span>${item.quantity}</span>
                    <button class="increment" data-id="${item.id}">+</button>
                </div>
            `;

            cartItems.appendChild(cartItem);
        });

        // Обновляем общую сумму и количество
        totalPrice.textContent = total;
        cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);

        // Добавляем обработчики для кнопок +/-
        addQuantityHandlers();
    }

    // Обработчики для изменения количества
    function addQuantityHandlers() {
        document.querySelectorAll('.increment').forEach(button => {
            button.addEventListener('click', function() {
                const productId = this.dataset.id;
                const item = cart.find(item => item.id === productId);
                item.quantity += 1;
                updateCart();
            });
        });

        document.querySelectorAll('.decrement').forEach(button => {
            button.addEventListener('click', function() {
                const productId = this.dataset.id;
                const item = cart.find(item => item.id === productId);

                if (item.quantity > 1) {
                    item.quantity -= 1;
                } else {
                    // Удаляем товар, если количество = 0
                    cart = cart.filter(item => item.id !== productId);
                }

                updateCart();
            });
        });
    }

    // Добавляем стили для уведомлений прямо в JS
    const notificationStyles = document.createElement('style');
    notificationStyles.textContent = `
        .custom-notification {
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: #ff4444;
            color: white;
            padding: 12px 24px;
            border-radius: 4px;
            box-shadow: 0 3px 10px rgba(0,0,0,0.2);
            z-index: 9999;
            animation: fadeInDown 0.4s, fadeOutUp 0.4s 2.5s;
            animation-fill-mode: both;
        }
        @keyframes fadeInDown {
            from { opacity: 0; transform: translate(-50%, -20px); }
            to { opacity: 1; transform: translate(-50%, 0); }
        }
        @keyframes fadeOutUp {
            from { opacity: 1; transform: translate(-50%, 0); }
            to { opacity: 0; transform: translate(-50%, -20px); }
        }
    `;
    document.head.appendChild(notificationStyles);

    // Элементы popup
    const openBtn = document.getElementById('open_pop_up');
    const popup = document.getElementById('pop_up');
    const closeBtn = document.getElementById('pop_up_close');

    // Показываем popup
    if (openBtn) {
        openBtn.addEventListener('click', function(e) {
            e.preventDefault();
            popup.style.display = 'block';
            document.getElementById('email_step').style.display = 'block';
            document.getElementById('code_step').style.display = 'none';
            resetForms();
        });
    }

    // Закрываем popup
    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            popup.style.display = 'none';
            resetForms();
        });
    }

    // Отправка email
    const emailForm = document.getElementById('auth_form');
    if (emailForm) {
        emailForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const emailInput = this.querySelector('input[type="email"]');
            const email = emailInput.value.trim();
            const submitBtn = this.querySelector('button');

            if (!validateEmail(email)) {
                showError('Пожалуйста, введите корректный email');
                emailInput.focus();
                return;
            }

            submitBtn.disabled = true;
            submitBtn.textContent = 'Отправка...';

            fetch('/send-code/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'X-CSRFToken': getCookie('csrftoken')
                },
                body: `email=${encodeURIComponent(email)}`
            })
            .then(handleResponse)
            .then(data => {
                if (data.status === 'success') {
                    showSuccess('Код отправлен на вашу почту');
                    showCodeForm();
                } else {
                    throw new Error(data.message || 'Не удалось отправить код');
                }
            })
            .catch(error => {
                showError(error.message || 'Ошибка при отправке кода');
                console.error('Error:', error);
            })
            .finally(() => {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Выслать код';
            });
        });
    }

    // Подтверждение кода
    const confirmForm = document.getElementById('confirm_form');
    if (confirmForm) {
        confirmForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const codeInput = this.querySelector('input[type="text"]');
            const code = codeInput.value.trim();
            const submitBtn = this.querySelector('button');

            if (!code || code.length !== 4 || !/^\d+$/.test(code)) {
                showError('Код должен состоять из 4 цифр');
                codeInput.focus();
                return;
            }

            submitBtn.disabled = true;
            submitBtn.textContent = 'Проверка...';

            fetch('/verify-code/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'X-CSRFToken': getCookie('csrftoken')
                },
                body: `code=${encodeURIComponent(code)}`
            })
            .then(handleResponse)
            .then(data => {
                if (data.status === 'success') {
                    showSuccess('Успешная авторизация!');
                    setTimeout(() => window.location.reload(), 1500);
                } else {
                    throw new Error(data.message || 'Неверный код подтверждения');
                }
            })
            .catch(error => {
                showError(error.message || 'Ошибка при проверке кода');
                console.error('Error:', error);
            })
            .finally(() => {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Подтвердить';
            });
        });
    }

    // ===== ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ =====
    function handleResponse(response) {
        if (!response.ok) {
            return response.json()
                .then(err => { throw err; })
                .catch(() => { throw new Error('Ошибка сервера') });
        }
        return response.json();
    }

    function getCookie(name) {
        const cookies = document.cookie.split(';');
        for (let cookie of cookies) {
            const [key, value] = cookie.trim().split('=');
            if (key === name) return decodeURIComponent(value);
        }
        return null;
    }

    function showCodeForm() {
        document.getElementById('email_step').style.display = 'none';
        document.getElementById('code_step').style.display = 'block';
        document.querySelector('#code_step input').focus();
    }

    function validateEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function resetForms() {
        if (emailForm) emailForm.reset();
        if (confirmForm) confirmForm.reset();
    }

    function showError(message) {
        showNotification(message, '#ff4444');
    }

    function showSuccess(message) {
        showNotification(message, '#4CAF50');
    }

    function showNotification(message, color) {
        // Удаляем предыдущие уведомления
        document.querySelectorAll('.custom-notification').forEach(el => el.remove());

        const notification = document.createElement('div');
        notification.className = 'custom-notification';
        notification.innerHTML = `
            <span>${message}</span>
            <span class="notification-check">✓</span>
        `;
        notification.style.backgroundColor = color;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'fadeOutUp 0.4s';
            setTimeout(() => notification.remove(), 400);
        }, 2000);
    }

    const mapModal = document.getElementById('map-modal');
    const changeAddressBtn = document.getElementById('change-address');
    const showOrdersBtn = document.getElementById('show-orders');
    const closeBtn2 = document.querySelector('#map-modal .close');
    const saveAddressBtn = document.getElementById('save-address');
    const addressInput = document.getElementById('address-input');

    // Обработчик для "Мои заказы"
    showOrdersBtn?.addEventListener('click', function() {
        alert('Здесь будет история заказов!');
    });

    // Обработчик для "Изменить адрес"
    changeAddressBtn?.addEventListener('click', function() {
        mapModal.style.display = 'block';
        initMap();
    });

    // Закрытие модального окна
    closeBtn2?.addEventListener('click', function() {
        mapModal.style.display = 'none';
    });

    // Сохранение адреса
    saveAddressBtn?.addEventListener('click', function() {
        if (addressInput.value) {
            alert('Адрес сохранён: ' + addressInput.value);
            mapModal.style.display = 'none';
        } else {
            alert('Выберите адрес на карте!');
        }
    });

    // Инициализация карты
    function initMap() {
        if (typeof ymaps === 'undefined') {
            console.error('Yandex Maps API не загружен');
            return;
        }

        // Удаляем старую карту, если она есть
        if (window.mapInstance) {
            window.mapInstance.destroy();
            document.getElementById('map').innerHTML = '';
        }

        ymaps.ready(function() {
            window.mapInstance = new ymaps.Map('map', {
                center: [55.76, 37.64],
                zoom: 12
            });

            // Поиск по клику
            window.mapInstance.events.add('click', function(e) {
                const coords = e.get('coords');
                window.mapInstance.geoObjects.removeAll();
                const placemark = new ymaps.Placemark(coords);
                window.mapInstance.geoObjects.add(placemark);

                ymaps.geocode(coords).then(function(res) {
                    const firstGeoObject = res.geoObjects.get(0);
                    document.getElementById('address-input').value = firstGeoObject.getAddressLine();
                });
            });
        });
    }

    // Подключаем API Яндекс.Карт
    if (!document.querySelector('script[src*="api-maps.yandex.ru"]')) {
        const script = document.createElement('script');
        script.src = 'https://api-maps.yandex.ru/2.1/?apikey=31d3d10c-8c1c-44c6-8d66-4b94fda82d88&lang=ru_RU';
        document.head.appendChild(script);
    }

    // Обработчики для "Добавить в корзину"
    document.querySelectorAll('.btn a').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const block = this.closest('.block');
            const productName = block.querySelector('l1').textContent;
            const price = parseInt(block.querySelector('l2').textContent);
            const productId = productName.toLowerCase().replace(/\s+/g, '-');

            // Добавляем товар в корзину
            const existingItem = cart.find(item => item.id === productId);
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.push({
                    id: productId,
                    name: productName,
                    price: price,
                    quantity: 1
                });
            }

            updateCart();
            showSuccess('Товар добавлен в корзину');
        });
    });

    document.getElementById('save-address').addEventListener('click', function() {
        const address = document.getElementById('address-input').value;
        const apartment = document.getElementById('apartment-input').value;
        const entrance = document.getElementById('entrance-input').value;
        const floor = document.getElementById('floor-input').value;

        if (!address || !apartment || !entrance || !floor) {
            showError('Заполните все поля!');
            return;
        }

        fetch('/save_address/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken'),
            },
            body: JSON.stringify({
                address: address,
                apartment: apartment,
                entrance: entrance,
                floor: floor,
            }),
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                document.getElementById('user-address').textContent =
                    `Адрес: ${address}, кв. ${apartment}, подъезд ${entrance}, этаж ${floor}`;
                document.getElementById('map-modal').style.display = 'none';
                showSuccess('Адрес успешно сохранён!');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            showError('Ошибка при сохранении адреса');
        });
    });

    const checkoutBtn = document.querySelector('.checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function () {
            if (cart.length === 0) {
                showError('Корзина пуста!');
                return;
            }
            // 2. Собираем данные корзины
            fetch('/orders/create/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': getCookie('csrftoken'),
                },
                body: JSON.stringify({
                    items: cart
                }),
            })
                .then(response => response.json())
                .then(data => {
                    if (data.redirect_url) {
                        window.location.href = data.redirect_url; // Редирект на оплату ЮMoney
                    } else if (data.error) {
                        showError(data.error);
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    showError('Ошибка при оформлении заказа');
                });
        });
    }
});