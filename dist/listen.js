"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./src/app");
const { PORT = 9090 } = process.env;
console.log("in listen");
app_1.app.listen(PORT, () => console.log(`Listening on ${PORT}...`));
