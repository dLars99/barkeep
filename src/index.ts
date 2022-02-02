import express from "express";
import typesRouter from "./routes/types.routes";

const app = express();
const port = 8080; // default port to listen
const version = process.env.npm_package_version;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', typesRouter);

// start the Express server
app.listen( port, () => {
    // tslint:disable-next-line
    console.log( `server v${version} started at http://localhost:${ port }` );
} );