FROM node:16
WORKDIR /root/

COPY client/ ./client/
RUN cd client && npm install && npm run build 

COPY server/package*.json ./server/
RUN cd ../server && npm install
COPY server/server.js ./server/
COPY server/ca-certificate.crt ./server/

EXPOSE 3080

CMD ["node", "server/server.js"]