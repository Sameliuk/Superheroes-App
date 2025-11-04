# Вибираємо офіційний Node.js образ
FROM node:20-alpine

# Встановлюємо робочу директорію всередині контейнера
WORKDIR /app

# Копіюємо package.json та package-lock.json для встановлення залежностей
COPY package*.json ./

# Встановлюємо залежності
RUN npm install 

# Копіюємо решту коду
COPY . .

# Відкриваємо порт для додатку
EXPOSE 3000

# Команда для запуску апки
CMD ["npm", "start"]
