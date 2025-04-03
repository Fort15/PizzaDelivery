// Ждём полной загрузки страницы
document.addEventListener('DOMContentLoaded', function() {
    // Элементы popup
    const openBtn = document.getElementById('open_pop_up');
    const popup = document.getElementById('pop_up');
    const closeBtn = document.getElementById('pop_up_close');
    
    // Форма ввода email
    const emailForm = document.getElementById('auth_form');
    
    // Показываем popup при клике на кнопку "Войти"
    openBtn.addEventListener('click', function(e) {
        e.preventDefault();
        popup.style.display = 'block';
    });
    
    // Закрываем popup
    closeBtn.addEventListener('click', function() {
        popup.style.display = 'none';
    });
    
    // Обработка отправки email
    if (emailForm) {
        emailForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = this.querySelector('input[type="email"]').value;
            
            // Показываем уведомление о отправке
            const submitBtn = this.querySelector('button');
            submitBtn.disabled = true;
            submitBtn.textContent = 'Отправка...';
            
            // Отправляем AJAX-запрос
            fetch('/send-code/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'X-CSRFToken': getCookie('csrftoken')  // Для защиты от CSRF
                },
                body: `email=${encodeURIComponent(email)}`
            })
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    // Показываем форму ввода кода
                    showCodeForm();
                } else {
                    alert('Ошибка: ' + (data.message || 'Не удалось отправить код'));
                }
            })
            .finally(() => {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Выслать код';
            });
        });
    }
    
    // Функция для получения CSRF-токена
    function getCookie(name) {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
    
    // Показываем форму ввода кода
    function showCodeForm() {
        document.getElementById('email_step').style.display = 'none';
        document.getElementById('code_step').style.display = 'block';
    }
});