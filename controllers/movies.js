require("dotenv").config();
const models = require("../models");
const Validator = require("fastest-validator");
const {
  movies,
  getPerson,
  countComments,
  getMetadata,
} = require("../utils/helper");

async function getAllMovies(req, res) {
  try {
    const response = await movies();
    const moviesToDisplay = [];
    if (response) {
      const { results } = response;

      let sortedData = results.sort((a, b) => {
        return new Date(b.release_date) - new Date(a.release_date);
      });
      sortedData.forEach((data) => {
        moviesToDisplay.push({
          title: data.title,
          episode_id: data.episode_id,
          release_date: data.release_date,
          opening_crawl: data.opening_crawl,
        });
      });
      const counted = await countComments(moviesToDisplay);
      return res.status(200).json({
        message: "Success",
        result: moviesToDisplay,
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Something went wrong",
      error,
    });
  }
}

async function getCharacter(req, res) {
  console.log("Reached");
  let { search, filter, order } = req.query;
  const { episode_id } = req.params;
  if (search && filter && order) {
    try {
      const response = await movies(episode_id);
      const { characters } = response;
      let people;

      if (
        order.toLowerCase() === "asc" ||
        order.toLowerCase() === "ascending"
      ) {
        people = characters.map(async (character) => {
          let persons = await getPerson(character);
          return persons;
        });
        people = await Promise.allSettled(people);
        let resolved = [];
        people.forEach((char) => {
          if (char.status === "fulfilled") {
            resolved.push(char.value);
          }
        });

        let sortedPeople = resolved.sort((a, b) => {
          let nameA;
          let nameB;
          console.log(NaN === NaN);
          if (
            +a[search] === Number(a[search]) &&
            +b[search] === Number(b[search])
          ) {
            nameA = Number(a[search]);
            nameB = Number(b[search]);
          } else {
            nameA = a[search].toLowerCase();
            nameB = b[search].toLowerCase();
          }
          if (nameA < nameB) {
            return -1;
          }
          if (nameA > nameB) {
            return 1;
          }
          return 0;
        });
        people = sortedPeople;
      } else if (
        order.toLowerCase() === "desc" ||
        order.toLowerCase() === "descending"
      ) {
        people = characters.map(async (character) => {
          let persons = await getPerson(character);
          return persons;
        });
        people = await Promise.allSettled(people);
        let resolved = [];
        people.forEach((char) => {
          if (char.status === "fulfilled") {
            resolved.push(char.value);
          }
        });

        let sortedPeople = resolved.sort((a, b) => {
          let nameA;
          let nameB;
          if (
            +a[search] === Number(a[search]) &&
            +b[search] === Number(b[search])
          ) {
            nameA = Number(a[search]);
            nameB = Number(b[search]);
          } else {
            nameA = a[search].toLowerCase();
            nameB = b[search].toLowerCase();
          }
          if (nameA > nameB) {
            return -1;
          }
          if (nameA < nameB) {
            return 1;
          }
          return 0;
        });
        people = sortedPeople;
      }
      let metadata = getMetadata(people);
      if (
        filter.toLowerCase() === "male" ||
        filter.toLowerCase() === "female"
      ) {
        let filtered = people.filter((person) => {
          return person.gender === filter.toLowerCase();
        });
        metadata = getMetadata(filtered);
        return res.status(200).json({
          metadata,
          people: filtered,
        });
      }
      return res.status(200).json({
        metadata,
        people,
      });
    } catch (error) {
      return res.status(500).json({
        message: "Something went wrong",
        error,
      });
    }
  }
}


module.exports = {
  getAllMovies,
  getCharacter,
};
