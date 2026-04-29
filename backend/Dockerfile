FROM node:22-bookworm-slim

WORKDIR /app
COPY backend/package.json backend/yarn.lock ./backend/
WORKDIR /app/backend
RUN yarn install --frozen-lockfile

COPY backend ./

RUN yarn prisma generate && yarn build

EXPOSE 3000

CMD ["sh", "-c", "yarn prisma migrate deploy && node dist/server.js"]
