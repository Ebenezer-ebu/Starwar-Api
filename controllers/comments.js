require("dotenv").config();
const models = require("../models");
const Validator = require("fastest-validator");

async function createComment(req, res) {
  const { posts } = req.body;
  const id = req.params.episode_id;
  const response = await movies();

  const hasId = response.results.find(
    (movie) => movie.episode_id === parseInt(id)
  );
  if (!hasId) {
    return res.status(404).json({
      message: `No starwars episode with id of ${id}`,
    });
  }
  const data = {
    posts,
    client_Ip: req.ip,
    episode_Id: req.params.episode_id,
  };
  const schema = {
    posts: { type: "string", optional: false, max: "500" },
  };

  const v = new Validator();
  const validationResponse = v.validate(data, schema);

  if (validationResponse !== true) {
    return res.status(400).json({
      message: "Validation Failed",
      errors: validationResponse,
    });
  } else {
    try {
      const comment = await models.Comment.create(data);
      return res.status(201).json({
        message: "Comment created successfully",
        comment,
      });
    } catch (err) {
      return res.status(500).json({
        message: "Something went wrong",
        Errors: err,
      });
    }
  }
}

async function getAllComments(req, res) {
  console.log("yesssssss");
  try {
    const comment = await models.Comment.findAll({
      order: [["updatedAt", "DESC"]],
    });
    console.log(comment);
    return res.status(200).json({
      message: "Success",
      comment,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Something went wrong",
      Errors: err,
    });
  }
}

module.exports = { createComment, getAllComments };
