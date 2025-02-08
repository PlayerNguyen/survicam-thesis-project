import app from "./app";

console.log(Bun.env);
const APP_PORT = Bun.env.APP_PORT || 3004;
const _app = app.listen(APP_PORT);
// console.log(_app.);
console.log(`Successfully accept the application with port 3004`);
