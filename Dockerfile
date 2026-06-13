FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

ENV NODE_ENV=production

RUN npm ci --omit=dev --ignore-scripts

COPY . .

RUN npx prisma generate
RUN npm run build

CMD ["node", "dist/main.js"]