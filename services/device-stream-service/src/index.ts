import app from "./app";

const APP_PORT = Bun.env.APP_PORT || 3004;
const _app = app.listen(APP_PORT);
// console.log(_app.);
console.log(`Successfully accept the application with port 3004`);
