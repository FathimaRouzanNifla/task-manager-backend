const Joi = require('joi');

const taskValidation = (data) => {
  const schema = Joi.object({
    title: Joi.string().min(3).max(100).required(),
    description: Joi.string().max(1000).allow(''),
    dueDate: Joi.date().required(),
    priority: Joi.string().valid('Low', 'Medium', 'High').required(),
    status: Joi.string().valid('Pending', 'Completed'),
  });

  return schema.validate(data);
};

module.exports = taskValidation;