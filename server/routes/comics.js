const express = require("express");
const router = express.Router();
const validate = require("../validate/index.js");
const xss = require("xss");
const data = require("../data/index.js");
const redis = require("redis");
const client = redis.createClient();

router.get("/:id", async (req, res) => {
  try {
    await client.connect();
    xss(req.params.id);
    await validate.validateNumber(req.params.id);
    const comicId = req.params.id;
    const cached = await client.get("comic" + comicId);
    if (cached) {
      client.quit();
      res.status(200).json(JSON.parse(cached));
      return;
    } else {
      const result = await data.comics.getComicsByID(comicId);
      await client.set("comic" + comicId, JSON.stringify(result));
      client.quit();
      res.status(200).json(result);
      return;
    }
  } catch (e) {
    if (client) {
      client.quit();
    }
    if (e.message === "Request failed with status code 404") {
      res.status(404).json({ error: "No comics found with that ID" });
      return;
    }
    res.status(400).json({ error: e });
    return;
  }
});

router.get("/page/:pagenum", async (req, res) => {
  try {
    await client.connect();
    xss(req.params.pagenum);
    await validate.validateNumber(req.params.pagenum);
    const pageNum = req.params.pagenum;
    const cached = await client.get("comicsPage" + pageNum);
    if (cached) {
      client.quit();
      res.status(200).json(JSON.parse(cached));
      return;
    } else {
      const result = await data.comics.getComicsByPage(pageNum);
      await client.set("comicsPage" + pageNum, JSON.stringify(result));
      client.quit();
      res.status(200).json(result);
      return;
    }
  } catch (e) {
    if (client) {
      client.quit();
    }
    if (e.message === "Request failed with status code 404") {
      res.status(404).json({ error: "No comics found on that page" });
      return;
    }
    res.status(400).json({ error: e });
    return;
  }
});

router.get("/search/:searchterm", async (req, res) => {
  try {
    await client.connect();
    xss(req.params.searchterm);
    xss(req.query.page);
    await validate.validateString(req.params.searchterm);
    await validate.validateNumber(req.query.page);
    const searchTerm = req.params.searchterm.trim();
    const page = req.query.page;
    const cached = await client.get("comicsSearch" + searchTerm + "Page" + page);
    if (cached) {
      client.quit();
      res.status(200).json(JSON.parse(cached));
      return;
    } else {
      const result = await data.comics.getComicsBySearch(searchTerm, page);
      await client.set("comicsSearch" + searchTerm + "Page" + page, JSON.stringify(result));
      client.quit();
      res.status(200).json(result);
      return;
    }
  } catch (e) {
    if (client) {
      client.quit();
    }
    if (e.message === "Request failed with status code 404") {
      res.status(404).json({ error: "No comics found with that search term" });
      return;
    }
    res.status(400).json({ error: e });
    return;
  }
});

module.exports = router;
