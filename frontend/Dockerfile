FROM node:22-bookworm-slim

ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}

WORKDIR /app
COPY frontend/package.json frontend/yarn.lock ./frontend/
WORKDIR /app/frontend
RUN yarn install --frozen-lockfile

COPY frontend ./

RUN yarn build

EXPOSE 4173

CMD ["yarn", "preview", "--host", "0.0.0.0", "--port", "4173"]
