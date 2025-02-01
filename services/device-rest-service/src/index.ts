import app from "./app";

const _ = app.listen(Bun.env.APP_PORT || 3000);

const BASE_URL = `http://${_.server?.hostname}:${_.server!.port}`;
console.log(`Access the application via\n\t`, BASE_URL);

console.log(`Documentation\n\t`, BASE_URL + "/docs");
