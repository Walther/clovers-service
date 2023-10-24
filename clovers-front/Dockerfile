FROM node:20 as base
WORKDIR /app

FROM base as build
COPY . .
ARG REACT_APP_BACKEND="http://localhost:8080"
ENV REACT_APP_BACKEND=$REACT_APP_BACKEND
RUN npm ci
RUN npm run build

FROM base as prod
COPY package.json package.json
COPY package-lock.json package-lock.json
ARG REACT_APP_BACKEND="http://localhost:8080"
ENV REACT_APP_BACKEND=$REACT_APP_BACKEND
ENV NODE_ENV=production
RUN npm ci --omit=dev
COPY --from=build /app/build /app/build
CMD ["npm", "start"]
