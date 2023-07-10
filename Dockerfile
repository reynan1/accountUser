FROM node:14-slim
WORKDIR /usr/src/app
COPY . .
RUN yarn install
CMD ["yarn", "dev"]
