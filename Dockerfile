FROM node:16-alpine
ENV NODE_ENV=production

COPY ["package.json", "package-lock.json", "src/", "./"]
# TODO: Prolly want a volume for this?
COPY ["contents/", "contents/" ]
RUN npm install --production

EXPOSE 8080
CMD ["node", "./server.js"]
