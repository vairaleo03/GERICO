# backend/Dockerfile

# Usa un'immagine base ufficiale di Node.js
FROM node:18-alpine

# Imposta la directory di lavoro
WORKDIR /usr/src/app

# Copia i file package.json e package-lock.json
COPY package*.json ./

# Installa le dipendenze
RUN npm install

# Copia il resto del codice dell'applicazione
COPY . .

# Espone la porta su cui l'applicazione sarà in ascolto
EXPOSE 5000

# Avvia il server
CMD ["npm", "start"]
