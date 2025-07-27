
FROM node:23-alpine AS builder

RUN apk add --no-cache python3 make g++

WORKDIR /repo

COPY package.json package-lock.json ./

COPY packages/db/package.json packages/db/tsconfig.json ./packages/db/
COPY packages/db/prisma ./packages/db/prisma
COPY packages/db/src ./packages/db/src
COPY packages/db/.env ./packages/db/.env

COPY apps/user-app/ ./apps/user-app/
COPY apps/user-app/.env.production ./apps/user-app/.env

RUN npm install 

WORKDIR /repo/packages/db
RUN npm run build
RUN npx prisma generate

WORKDIR /repo/apps/user-app 
RUN npm run build

FROM node:23-alpine AS runner

WORKDIR /repo

COPY --from=builder /repo/node_modules ./node_modules

COPY --from=builder /repo/apps/user-app/.next ./.next
COPY --from=builder /repo/apps/user-app/public ./public
COPY --from=builder /repo/apps/user-app/app ./app
COPY --from=builder /repo/apps/user-app/package.json ./package.json
COPY --from=builder /repo/apps/user-app/.env ./.env

COPY --from=builder /repo/packages/db/package.json ./packages/db/package.json
COPY --from=builder /repo/packages/db/prisma ./packages/db/prisma
COPY --from=builder /repo/packages/db/dist ./packages/db/dist
COPY --from=builder /repo/packages/db/.env ./packages/db/.env

ENV NODE_ENV=production 

EXPOSE 3000
CMD ["npm", "start"]
