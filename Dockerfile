FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

ENV NODE_ENV=production
ENV HUSKY=0

RUN npm ci --omit=dev --ignore-scripts
RUN npm install --ignore-scripts


COPY . .

RUN npx prisma generate --no-install
RUN npm run build

CMD ["node", "dist/main.js"]