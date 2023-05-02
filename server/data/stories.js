const validate = require("../validate/index.js");
const axios = require("axios");

const md5 = require("blueimp-md5");
const publickey = "1b3a001c3d6415cdd9199344a9286978";
const privatekey = "f2fd6c8c809cf02a03470d771343bf81a7ef1426";
const ts = new Date().getTime();
const stringToHash = ts + privatekey + publickey;
const hash = md5(stringToHash);
const storiesBaseUrl = "https://gateway.marvel.com:443/v1/public/stories";
const storiesUrl =
  storiesBaseUrl + "?ts=" + ts + "&apikey=" + publickey + "&hash=" + hash;

let getStoriesByID = async (id) => {
  await validate.validateNumber(id);
  const url = storiesUrl + "&id=" + id;
  const response = await axios.get(url);
  const data = response.data.data.results[0];
  if (data === undefined) {
    throw "No story found with that ID";
  }
  return data;
};

let getStoriesByPage = async (page) => {
  await validate.validateNumber(page);
  const url = storiesUrl + "&offset=" + (page - 1) * 20;
  const response = await axios.get(url);
  const data = response.data.data.results;
  if (data === undefined || data.length === 0) {
    throw "No stories found on that page";
  }
  return response.data;
};

let getStoriesBySearch = async (search, page) => {
  await validate.validateString(search);
  await validate.validateNumber(page);
  search = search.trim();
  const url = storiesUrl + "&comics=" + search + "&offset=" + (page - 1) * 20;
  const response = await axios.get(url);
  const data = response.data.data.results;
  if (data === undefined || data.length === 0) {
    throw "No stories found with that search term";
  }
  return response.data;
};

module.exports = {
  getStoriesByID,
  getStoriesByPage,
  getStoriesBySearch,
};
