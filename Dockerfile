FROM node:16 AS client-build
WORKDIR /usr/src/app
COPY client/ ./client/
RUN cd client && npm install && npm run build

FROM node:16 AS server-build
WORKDIR /root/
COPY --from=client-build /usr/src/app/client/dist ./client/dist
COPY server/package*.json ./server/
RUN cd server && npm install
COPY server/server.js ./server/
COPY server/ca-certificate.crt ./server/

EXPOSE 3080

CMD ["node", "./server/server.js"]