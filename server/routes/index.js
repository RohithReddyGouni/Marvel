const charactersRoute = require("./characters");
const comicsRoute = require("./comics");
const storiesRoute = require("./stories");

const constructorMethod = (app) => {
  app.use("/api/characters", charactersRoute);
  app.use("/api/comics", comicsRoute);
  app.use("/api/stories", storiesRoute);
  app.use("*", (req, res) => {
    res.status(404).json({ error: "Route not found" });
  });
};

module.exports = constructorMethod;
