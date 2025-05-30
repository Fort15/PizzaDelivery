# Базовый образ Python
FROM python:3.9-slim

# Установка зависимостей для PostgreSQL и других библиотек
RUN apt-get update && apt-get install -y \
    libpq-dev \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Рабочая директория
WORKDIR /app

# Копирование и установка зависимостей Python
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Копирование всего проекта
COPY . .

# Сбор статических файлов Django
RUN python manage.py collectstatic --noinput

# Открытие порта для Gunicorn
EXPOSE 8000

# Запуск Gunicorn
CMD ["gunicorn", "--bind", "0.0.0.0:8000", "pizza.wsgi:application"]