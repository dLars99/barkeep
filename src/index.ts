import express from "express";
const app = express();
const port = 8080; // default port to listen
const version = process.env.npm_package_version;

// define a route handler for the default home page
app.get( "/", ( req, res ) => {
    res.send( "Hello world!" );
} );

// start the Express server
app.listen( port, () => {
    // tslint:disable-next-line
    console.log( `server v${version} started at http://localhost:${ port }` );
} );