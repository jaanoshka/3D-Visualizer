# Verwende ein Node.js Image, um die Anwendung zu bauen
FROM node:16 AS build

# Setze das Arbeitsverzeichnis
WORKDIR /app

# Kopiere package.json und package-lock.json oder yarn.lock in das Arbeitsverzeichnis
COPY package*.json ./

# Installiere die Abhängigkeiten
RUN npm install

# Kopiere den Rest des Anwendungs-Codes
COPY . .

# Baue die Anwendung für die Produktion
RUN npm run build

# Verwende ein NGINX Image, um die statischen Dateien zu hosten
FROM nginx:alpine

# Kopiere die gebauten Dateien in den NGINX Container
COPY --from=build /app/build /usr/share/nginx/html

# Exponiere den Port 80
EXPOSE 80

# Starte den NGINX Server
CMD ["nginx", "-g", "daemon off;"]