FROM node:18-slim AS builder 

WORKDIR /workspace

RUN apt-get update && apt-get install -y openssl

COPY package*.json ./
COPY nx.json ./
COPY tsconfig*.json ./
COPY jest.config.ts ./
COPY jest.preset.js ./
COPY eslint.config.mjs ./ 
COPY webpack.*.config.js ./

COPY apps/auth ./apps/auth 
COPY apps/auth/prisma ./apps/auth/prisma  
COPY lib/graphql ./lib/graphql 
COPY lib/grpc ./lib/grpc 
COPY lib/nestjs ./lib/nestjs
COPY lib/prisma ./lib/prisma

RUN npm install 

RUN apt-get update && apt-get install -y protobuf-compiler 

RUN npx nx build auth

FROM node:18-slim AS runner 

RUN apt-get update && apt-get install -y openssl

COPY --from=builder /workspace/package.json ./ 
COPY --from=builder /workspace/package-lock.json ./
# workaround
COPY apps/auth/prisma ./apps/auth/prisma  
# COPY --from=builder /workspace/apps/auth/package.json ./apps/auth/package.json 
COPY --from=builder /workspace/apps/auth/prisma ./apps/auth/prisma
COPY --from=builder /workspace/lib/graphql/package.json ./lib/graphql/package.json 
COPY --from=builder /workspace/lib/grpc/package.json ./lib/grpc/package.json 
COPY --from=builder /workspace/lib/prisma/package.json ./lib/prisma/package.json 
# set variable to optimize build and exclude dev dependencies 
ENV NODE_ENV=production

RUN npm ci

COPY --from=builder /workspace/node_modules/@prisma-clients/auth/ ./node_modules/@prisma-clients/auth

COPY --from=builder /workspace/dist ./dist 

CMD ["node", "dist/apps/auth/main"]






