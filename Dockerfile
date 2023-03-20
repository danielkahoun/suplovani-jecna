FROM node:16 AS client-build
WORKDIR /usr/src/app
COPY client/ ./client/
RUN cd client && npm install && npm run build

FROM node:16 AS server-build
WORKDIR /root/
COPY --from=client-build /usr/src/app/client/dist ./app/client/dist
COPY server/package*.json ./app/server/
RUN cd app & cd server && npm install
COPY server/server.js ./app/server/
COPY server/ca-certificate.crt ./app/server/

EXPOSE 3080

CMD ["node", "./app/server/server.js"]