FROM node:16

COPY . .

RUN cd client && npm install && npm run build 
RUN cd server && npm install

EXPOSE 3080

CMD ["node", "server/server.js"]