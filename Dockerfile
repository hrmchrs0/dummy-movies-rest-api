FROM node:14-alpine as BUILDER

WORKDIR /app
COPY . .
RUN npm install

FROM node:14-alpine
WORKDIR /app
COPY --from=BUILDER /app .

EXPOSE 8000

CMD [ "npm", "start"]
