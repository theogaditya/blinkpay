FROM node:23-alpine 

WORKDIR /repo
COPY package.json package-lock.json yarn.lock ./
COPY packages/db ./packages/db
COPY apps/webHook/ ./apps/webHook/

RUN yarn install --frozen-lockfile

WORKDIR /repo/packages/db
RUN npm run build
RUN npx prisma generate

WORKDIR /repo/apps/webHook 
RUN npm run build

EXPOSE 3003
CMD ["node", "dist/index.js"]