FROM node:18-slim AS builder 

WORKDIR /workspace

COPY package*.json ./
COPY nx.json ./
COPY tsconfig*.json ./
COPY jest.config.ts ./
COPY jest.preset.js ./
COPY eslint.config.mjs ./ 
COPY webpack.*.config.js ./


COPY apps/jobs ./apps/jobs  
COPY lib/graphql ./lib/graphql 
COPY lib/grpc ./lib/grpc 
COPY lib/nestjs ./lib/nestjs
COPY lib/pulsar ./lib/pulsar

RUN npm install 

RUN apt-get update && apt-get install -y protobuf-compiler 

RUN npx nx build jobs

FROM node:18-slim AS runner 

COPY --from=builder /workspace/package.json ./ 
COPY --from=builder /workspace/package-lock.json ./
COPY --from=builder /workspace/apps/jobs/package.json ./apps/jobs/package.json 
COPY --from=builder /workspace/lib/graphql/package.json ./lib/graphql/package.json 
COPY --from=builder /workspace/lib/grpc/package.json ./lib/grpc/package.json 
COPY --from=builder /workspace/lib/pulsar/package.json ./lib/pulsar/package.json 


# set variable to optimize build and exclude dev dependencies 
ENV NODE_ENV=production

RUN npm ci


COPY --from=builder /workspace/dist ./dist 

CMD ["node", "dist/apps/jobs/main"]






