FROM node:14.18
WORKDIR /usr/src/app
ENV NODE_ENV=development
ENV DOCKER=true
COPY package.json ./
COPY yarn.lock ./
COPY tsconfig.json ./
COPY . .
RUN rm -rf node_modules && yarn install --frozen-lockfile
RUN yarn build

FROM node:14.18
WORKDIR /usr/src/app
ENV NODE_ENV=production
ENV DOCKER=true
COPY package.json ./
COPY yarn.lock ./
COPY tsconfig.json ./
RUN rm -rf node_modules && yarn install --frozen-lockfile --production
COPY --from=0 /usr/src/app/dist .
EXPOSE 8080
CMD ["node", "index.js"]