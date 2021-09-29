const axios = require("axios");
const models = require("../models");

async function movies(id) {
  if (!id) {
    const response = await axios.get("https://swapi.dev/api/films");
    return response.data;
  } else {
    const response = await axios.get(`https://swapi.dev/api/films/${id}`);
    return response.data;
  }
}

async function getPerson(person) {
  const response = await axios.get(person);
  return response.data;
}

async function countComments(arr) {
  let result = arr.map(async (data) => {
    let commentCount = await models.Comment.count({
      where: { episode_Id: data.episode_id },
    });
    data.commentCount = commentCount;
    return data;
  });

  return await Promise.all(result);
}

function getMetadata(data) {
  let totalCharacters = data.length;
  let totalHeight = data.reduce((accum, init) => {
    console.log(accum, init.height);
    return accum + Number(init.height);
  }, 0);
  // There are 30.48 cm in 1 foot.
  let inFootIn = totalHeight / 30.48;
  let inFoot = Math.floor(inFootIn);
  let inch = (inFootIn - inFoot) * 12;
  inch = inch.toFixed(2)
  return {
    totalCharacters: `${totalCharacters} characters`,
    totalHeight: `${totalHeight}cm`,
    inInches: `${inFoot}ft and ${inch}inches`,
  };
}

module.exports = { movies, getPerson, countComments, getMetadata };
