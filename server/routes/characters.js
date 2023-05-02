const express = require("express");
const router = express.Router();
const validate = require("../validate/index.js");
const xss = require("xss");
const data = require("../data/index.js");
const redis = require("redis");
const client = redis.createClient();

router.get("/history", async (req, res) => {
  try {
    await client.connect();
    // get recently added 20 characters
    const recentlyViewedCharacters = await client.lRange("recentlyViewedCharacters", 0, 19);
    // get all characters
    const characters = await Promise.all(
      recentlyViewedCharacters.map(async (charId) => {
        const character = await client.get("character" + charId);
        return JSON.parse(character);
      })
    );
    client.quit();
    res.status(200).json(characters);
    return;
  } catch (e) {
    if (client) {
      client.quit();
    }
    res.status(500).json({ error: e });
    return;
  }
});

router.get("/:id", async (req, res) => {
  try {
    await client.connect();
    xss(req.params.id);
    await validate.validateNumber(req.params.id);
    const charId = req.params.id;
    const cached = await client.get("character" + charId);
    if (cached) {
      await client.lPush("recentlyViewedCharacters", charId);
      client.quit();
      res.status(200).json(JSON.parse(cached));
      return;
    } else {
      const result = await data.characters.getCharactersByID(charId);
      await client.set("character" + charId, JSON.stringify(result));
      await client.lPush("recentlyViewedCharacters", charId);
      client.quit();
      res.status(200).json(result);
      return;
    }
  } catch (e) {
    if (client) {
      client.quit();
    }
    if (e.message === "Request failed with status code 404") {
      res.status(404).json({ error: "No character found with that ID" });
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
    const cached = await client.get("charactersPage" + pageNum);
    if (cached) {
      client.quit();
      res.status(200).json(JSON.parse(cached));
      return;
    } else {
      const result = await data.characters.getCharactersByPage(pageNum);
      await client.set("charactersPage" + pageNum, JSON.stringify(result));
      client.quit();
      res.status(200).json(result);
      return;
    }
  } catch (e) {
    if (e.message === "Request failed with status code 404") {
      res.status(404).json({ error: "No page found with that number" });
      return;
    }
    res.status(400).json({ error: e });
    if (client) {
      client.quit();
    }
    return;
  }
});

router.get("/search/:searchTerm", async (req, res) => {
  try {
    await client.connect();
    xss(req.params.searchTerm);
    xss(req.query.page);
    await validate.validateString(req.params.searchTerm);
    const searchTerm = req.params.searchTerm.trim();
    const page = req.query.page;
    await validate.validateNumber(page);
    const cached = await client.get("charactersSearch" + searchTerm + "Page" + page);
    if (cached) {
      client.quit();
      res.status(200).json(JSON.parse(cached));
      return;
    } else {
      const result = await data.characters.getCharactersBySearch(searchTerm, page);
      await client.set("charactersSearch" + searchTerm + "Page" + page, JSON.stringify(result));
      client.quit();
      res.status(200).json(result);
      return;
    }
  } catch (e) {
    if (e.message === "Request failed with status code 404") {
      res.status(404).json({ error: "No characters found with that search term" });
      return;
    }
    res.status(400).json({ error: e });
    if (client) {
      client.quit();
    }
    return;
  }
});

module.exports = router;
