FROM node:18

WORKDIR /app
COPY package.json package.json
COPY package-lock.json package-lock.json
ENV NODE_ENV=dev
RUN npm install
ENV REACT_APP_BACKEND_URL="http://localhost:8080"
CMD ["npm", "run", "dev"]
