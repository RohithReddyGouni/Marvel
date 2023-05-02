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
    const storyId = req.params.id;
    const cached = await client.get("story" + storyId);
    if (cached) {
      client.quit();
      res.status(200).json(JSON.parse(cached));
      return;
    } else {
      const result = await data.stories.getStoriesByID(storyId);
      await client.set("story" + storyId, JSON.stringify(result));
      client.quit();
      res.status(200).json(result);
      return;
    }
  } catch (e) {
    if (client) {
      client.quit();
    }
    if (e.message === "Request failed with status code 404") {
      res.status(404).json({ error: "No stories found with that ID" });
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
    const cached = await client.get("storiesPage" + pageNum);
    if (cached) {
      client.quit();
      res.status(200).json(JSON.parse(cached));
      return;
    } else {
      const result = await data.stories.getStoriesByPage(pageNum);
      await client.set("storiesPage" + pageNum, JSON.stringify(result));
      client.quit();
      res.status(200).json(result);
      return;
    }
  } catch (e) {
    if (client) {
      client.quit();
    }
    if (e.message === "Request failed with status code 404") {
      res.status(404).json({ error: "No stories found on that page" });
      return;
    }
    res.status(400).json({ error: e });
    return;
  }
});

router.get("/search/:search", async (req, res) => {
  try {
    await client.connect();
    xss(req.params.search);
    xss(req.query.page);
    await validate.validateString(req.params.search);
    await validate.validateNumber(req.query.page);
    const search = req.params.search.trim();
    const pageNum = req.query.page;
    const cached = await client.get("storiesSearch" + search + "Page" + pageNum);
    if (cached) {
      client.quit();
      res.status(200).json(JSON.parse(cached));
      return;
    } else {
      const result = await data.stories.getStoriesBySearch(search, pageNum);
      await client.set("storiesSearch" + search + "Page" + pageNum, JSON.stringify(result));
      client.quit();
      res.status(200).json(result);
      return;
    }
  } catch (e) {
    if (client) {
      client.quit();
    }
    if (e.message === "Request failed with status code 404") {
      res.status(404).json({ error: "No stories found with that search" });
      return;
    }
    res.status(400).json({ error: e });
    return;
  }
});

module.exports = router;
