FROM node:14
WORKDIR /app
COPY ["./backend/package.json", "./backend/package-lock.json", "./"]
RUN npm install
COPY . .
ENV PORT=8003
EXPOSE 8003
CMD ["npm", "start"]