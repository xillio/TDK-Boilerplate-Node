FROM node:16-alpine
ENV NODE_ENV=production

COPY ["package.json", "package-lock.json", "./"]
COPY ["src/", "src/" ]
COPY ["contents/", "contents/" ]
RUN npm install --production

EXPOSE 8080
CMD ["node", "./src/server.js"]
