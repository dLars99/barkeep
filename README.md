# Barkeep

## API

### Summary

About a year ago, my wife took a deep interest in Tiki and mixology. What we quickly came to learn is that, with all the ingredients that go into a standard Tiki drink, we could go through pages upon pages of recipes before we found one we actually had all the ingredients for.

**Barkeep** is the answer to that.

Barkeep is a drink cataloging app that lets the user:

- Read dozens of drink recipes at a glance
- Search those recipes based on the ingredients on hand
- Add new recipes as they are found

This is 1 of 2 applications needed to run Barkeep. The frontend can be found [here](https://github.com/dlars99/barkeep).

### Technical Background

The Barkeep API is built on a NodeJS/Express server coded entirely in Typescript. It is designed to utilize a Postgres database. A `Dockerfile` is included for containerization, but it can be run out-of-the-box as well.

Since I built this for my own personal use on personal hardware without WAN access, security is very lax. There is no authorization required, and no user accounts to segment information.

Under default settings, the server runs on port 8080.

To install and run this API, you will need `node` and `yarn` installed on your system.

### Setup

#### Database Setup

1. For anything to work on this API, you will need to set up a Postgres database. Scripts are included in the `db` folder on the root of this project. `createDb.sql` will create the database itself. If you do this manually, the database should be named `barkeep`.

2. To create the needed database tables, clone this repo. Once cloned, navigate to the root directory and run `yarn install`. This will install Knex, which is the client this application uses to interface with the Postgres database.

3. You will also need an `.env` file. An example is included. There is only one environment variable you will need for `DATABASE_URL`. The value of this should be the connection string URL for the Postgres database you set up.

4. With the above steps completed, from the root of the project, run `node db/create-tables.js`. This script will create the database tables needed. You will also need to run the latest migrations for the database with the command, `yarn knex migrate:latest`.

5. If you wish to seed the database with some starter data, after all the above steps are completed, run `yarn knex seed:run seeds/initial-database.ts`.

#### Project installation, execution, and deployment

If you have not already, clone this repo and run `yarn install` from the project root to install all dependencies. Make sure you have followed the steps above to install the database.

##### Development

`yarn start` will get you up and running!

##### Production

A `Dockerfile` is included to run this as a Docker container. Sample steps are below. Customize these to your system and your liking.

1. `docker build . -t barkeep-server` -- Running this from the root will build the Docker image. You can also substitute `.` for the repo address. Make sure to specify the `#main` branch!
2. `docker run -dp 8080:8080 --env-file=./.env --name barkeep-server barkeep-server` -- This will create the container and start it. This assumes you have created an `.env` file as instructed above. You could also put the variable directly into this statement with `--env`.

If you **don't** want to use Docker, and instead want to run this on your own system in production:

1. Run `yarn build` from the root directory
2. Run `node -r dotenv/config dist/index.js` to start the server

### API Documentation

Coming soon!
