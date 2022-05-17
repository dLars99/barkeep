import express from "express";
import cors from "cors";
import typesRouter from "./routes/types.routes";
import categoriesRouter from "./routes/categories.routes";
import ingredientsRouter from "./routes/ingredients.routes";
import drinksRouter from "./routes/drinks.routes";

const app = express();
const port = 8080; // default port to listen
const version = process.env.npm_package_version;

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", typesRouter);
app.use("/", categoriesRouter);
app.use("/", ingredientsRouter);
app.use("/", drinksRouter);

// start the Express server
app.listen(port, () => {
  console.log(`server v${version} started at http://localhost:${port}`);
});
