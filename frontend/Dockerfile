# frontend/Dockerfile

# Fase 1: Build dell'applicazione
FROM node:18-alpine as build

# Imposta la directory di lavoro
WORKDIR /app

# Copia i file package.json e package-lock.json
COPY package*.json ./

# Installa le dipendenze
RUN npm install

# Copia il resto del codice dell'applicazione
COPY . .

# Esegui il build della produzione
RUN npm run build

# Fase 2: Servire i file statici con Nginx
FROM nginx:alpine

# Copia i file buildati nella directory di default di Nginx
COPY --from=build /app/build /usr/share/nginx/html

# Copia il file di configurazione personalizzato di Nginx (opzionale)
# COPY nginx.conf /etc/nginx/nginx.conf

# Espone la porta su cui Nginx sarà in ascolto
EXPOSE 80

# Avvia Nginx in modalità foreground
CMD ["nginx", "-g", "daemon off;"]
