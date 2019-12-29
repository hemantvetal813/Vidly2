const Joi = require("joi");

function validateGenre(req) {
  const schema = {
    name: Joi.string().required()
  };
  return Joi.validate(req.body, schema);
}

module.exports.validateGenre = validateGenre;
