FROM node:18 as base
WORKDIR /app

FROM base as build
COPY . .
ENV REACT_APP_BACKEND_URL="http://localhost:8080"
RUN npm ci
RUN npm run build

FROM base as prod
COPY package.json package.json
COPY package-lock.json package-lock.json
ENV NODE_ENV=production
RUN npm ci --omit=dev
COPY --from=build /app/build /app/build
CMD ["npm", "start"]
