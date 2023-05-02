const validate = require("../validate/index.js");
const axios = require("axios");

const md5 = require("blueimp-md5");
const publickey = "1b3a001c3d6415cdd9199344a9286978";
const privatekey = "f2fd6c8c809cf02a03470d771343bf81a7ef1426";
const ts = new Date().getTime();
const stringToHash = ts + privatekey + publickey;
const hash = md5(stringToHash);
const comicsBaseUrl = "https://gateway.marvel.com:443/v1/public/comics";
const comicsUrl =
  comicsBaseUrl + "?ts=" + ts + "&apikey=" + publickey + "&hash=" + hash;

let getComicsByID = async (id) => {
  await validate.validateNumber(id);
  const url = comicsUrl + "&id=" + id;
  const response = await axios.get(url);
  const data = response.data.data.results[0];
  if (data === undefined) {
    throw "No comic found with that ID";
  }
  return data;
};

let getComicsByPage = async (page) => {
  await validate.validateNumber(page);
  const url = comicsUrl + "&offset=" + (page - 1) * 20;
  const response = await axios.get(url);
  const data = response.data.data.results;
  if (data === undefined || data.length === 0) {
    throw "No comics found on that page";
  }
  return response.data;
};

let getComicsBySearch = async (search, page) => {
  await validate.validateString(search);
  await validate.validateNumber(page);
  const url =
    comicsUrl + "&titleStartsWith=" + search + "&offset=" + (page - 1) * 20;
  const response = await axios.get(url);
  const data = response.data.data.results;
  if (data === undefined || data.length === 0) {
    throw "No comics found with that search term";
  }
  return response.data;
};

module.exports = {
  getComicsByID,
  getComicsByPage,
  getComicsBySearch,
};
