import { app } from "./src/app";

const { PORT = 9090 } = process.env;
console.log("in listen")
app.listen(PORT, () => console.log(`Listening on ${PORT}...`));
