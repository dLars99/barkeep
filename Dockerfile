FROM node:14.18
WORKDIR /usr/src/app
COPY package.json ./
COPY yarn.lock ./
RUN npm install -g yarn
ENV NODE_ENV=production
RUN rm -rf node_modules && yarn install --frozen-lockfile
RUN yarn build
COPY . .
EXPOSE 8080
CMD ["node", "dist/index.js"]