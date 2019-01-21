FROM node:8
WORKDIR /app
COPY . /app
RUN rm -rf node_modules && npm install
EXPOSE 8081
CMD ["node", "index.js"]
