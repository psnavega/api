const http = require("http");
const app = require("./app");
const porta = process.env.PORT || 3001;
const server = http.createServer(app);

server.listen(porta);