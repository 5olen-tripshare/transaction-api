# Utilise une image officielle de Node.js
FROM node:18-alpine

# Définir le répertoire de travail dans le conteneur
WORKDIR /app

# Copier les fichiers package.json et package-lock.json pour installer les dépendances en premier
COPY package*.json ./

# Installer les dépendances
RUN npm install --only=production

# Copier le reste des fichiers dans le conteneur
COPY . .

# Exposer le port de l'API (5006 par défaut)
EXPOSE 5006

# Définir la commande de lancement du serveur
CMD ["node", "index.js"]
