const express = require("express");
const path = require("path");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const app = express();
app.use(express.json());

const dbpath = path.join(__dirname, "moviesData.db");

let db = null;
console.log("It's Running....");
const initializationDbAndServer = async () => {
  try {
    db = await open({
      filename: dbpath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server Started");
    });
  } catch (e) {
    console.log(`Somting Happend ${e.message}`);
  }
};

initializationDbAndServer();

const convertDbObjectToResponseObject = (dbObject) => {
  return {
    movieId: dbObject.movie_id,
    directorId: dbObject.director_id,
    movieName: dbObject.movie_name,
    leadActor: dbObject.lead_actor,
    directorName: dbObject.director_name,
  };
};

//All API
app.get("/movies/", async (request, response) => {
  const getAllQuery = `SELECT movie_name FROM movie;`;
  const queryResult = await db.all(getAllQuery);
  const convertedData = queryResult.map((dbObject) =>
    convertDbObjectToResponseObject(dbObject)
  );
  response.send(convertedData);
});

//post API
app.post("/movies/", async (request, response) => {
  const movieDetails = request.body;
  const { directorId, movieName, leadActor } = movieDetails;
  const postQuery = `INSERT INTO movie (director_id, movie_name, lead_actor) VALUES ('${directorId}', '${movieName}', '${leadActor}')`;
  const dbResponse = await db.run(postQuery);
  const movieId = dbResponse.lastID;
  response.send("Movie Successfully Added");
});

//get API
app.get(`/movies/:movieId/`, async (request, response) => {
  const { movieId } = request.params;
  const postQuery = `SELECT * FROM movie WHERE movie_id = ${movieId};`;
  const dbResponse = await db.get(postQuery);
  const convertedData = convertDbObjectToResponseObject(dbResponse);
  response.send(convertedData);
});
