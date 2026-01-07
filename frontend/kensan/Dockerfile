# om de image te builden: docker build -t frontend .
# om hem te runnen gebruik: docker run -d -p 5173:80 --name frontend_build frontend


# 1. Gebruik lichte Node image
FROM node:20-alpine

# 2. Werkmap in container
WORKDIR /app

# 3. Package files kopiëren
COPY package*.json ./

# 4. Dependencies installeren
RUN npm install --legacy-peer-deps

# 5. Rest van de app kopiëren
COPY . .

# 6. Frontend builden
RUN npm run build

# 7. Nginx om build te serveren
FROM nginx:alpine

# 8. Nginx standaard files weg
RUN rm -rf /usr/share/nginx/html/*

# 9. Build kopiëren
COPY --from=0 /app/dist /usr/share/nginx/html

# 10. Poort openen
EXPOSE 80

# 11. Start Nginx
CMD ["nginx", "-g", "daemon off;"]
