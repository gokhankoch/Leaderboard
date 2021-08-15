# Pull node image from docker hub
FROM node:alpine
# Set working directory
WORKDIR /app
# install and cache app dependencies
COPY package.json ./

# clear application caching
RUN npm cache clean --force

# install all dependencies
RUN npm install

COPY ./ ./

CMD ["npm", "start"]