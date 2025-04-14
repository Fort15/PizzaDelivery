document.addEventListener('DOMContentLoaded', function() {
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
        notification.textContent = message;
        notification.style.backgroundColor = color;

        document.body.appendChild(notification);

        // Автоматическое удаление через 3 секунды
        setTimeout(() => {
            notification.style.animation = 'fadeOutUp 0.4s';
            setTimeout(() => notification.remove(), 400);
        }, 3000);
    }
});