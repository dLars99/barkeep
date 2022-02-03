import express from "express";
import typesRouter from "./routes/types.routes";
import categoriesRouter from "./routes/categories.routes";
import ingredientsRouter from "./routes/ingredients.routes";
import recipesRouter from "./routes/recipes.routes";

const app = express();
const port = 8080; // default port to listen
const version = process.env.npm_package_version;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', typesRouter);
app.use('/', categoriesRouter);
app.use('/', ingredientsRouter);
app.use('/', recipesRouter)


// start the Express server
app.listen( port, () => {
    console.log( `server v${version} started at http://localhost:${ port }` );
} );