FROM node:14
WORKDIR /app
COPY ["./backend/package.json", "./backend/package-lock.json", "./"]
RUN npm install --only=production
COPY backend .
#COPY frontend/build .
ENV PORT=80
EXPOSE 80
CMD ["npm", "start"]
RUN ls