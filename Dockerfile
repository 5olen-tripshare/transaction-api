FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install --omit=dev

COPY . .

RUN chmod -R 777 /app

EXPOSE 5006

# Définition d'un endpoint de santé pour Kubernetes
HEALTHCHECK --interval=30s --timeout=10s --start-period=10s \
    CMD curl -f http://localhost:5006/health || exit 1

CMD ["npm", "start"]