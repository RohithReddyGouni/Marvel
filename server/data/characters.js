const validate = require("../validate/index.js");
const axios = require("axios");

const md5 = require("blueimp-md5");
const publickey = "1b3a001c3d6415cdd9199344a9286978";
const privatekey = "f2fd6c8c809cf02a03470d771343bf81a7ef1426";
const ts = new Date().getTime();
const stringToHash = ts + privatekey + publickey;

const hash = md5(stringToHash);
const charactersBaseUrl = "https://www.marvel.com/characters";
const charactersUrl =
  charactersBaseUrl + "?ts=" + ts + "&apikey=" + publickey + "&hash=" + hash;

let getCharactersByID = async (id) => {
  await validate.validateNumber(id);
  const url = charactersUrl + "&id=" + id;
  const response = await axios.get(url);
  const data = response.data.data.results[0];
  if (data === undefined) {
    throw "No character found with that ID";
  }
  return data;
};

let getCharactersByPage = async (page) => {
  await validate.validateNumber(page);
  const url = charactersUrl + "&offset=" + (page - 1) * 20;
  const response = await axios.get(url);
  const data = response.data.data.results;
  if (data === undefined || data.length === 0) {
    throw "No characters found on that page";
  }
  return response.data;
};

let getCharactersBySearch = async (search, page) => {
  await validate.validateString(search);
  search = search.trim();
  await validate.validateNumber(page);
  const url =
    charactersUrl + "&nameStartsWith=" + search + "&offset=" + (page - 1) * 20;
  const response = await axios.get(url);
  const data = response.data.data.results;
  if (data === undefined || data.length === 0) {
    throw "No characters found with that search";
  }
  return response.data;
};

module.exports = {
  getCharactersByID,
  getCharactersByPage,
  getCharactersBySearch,
};
