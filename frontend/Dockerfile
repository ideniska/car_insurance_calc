FROM node:15.13-alpine
WORKDIR /frontend
COPY ["package.json", "package-lock.json", "/frontend/"]
RUN npm i
COPY . .
RUN npm run build