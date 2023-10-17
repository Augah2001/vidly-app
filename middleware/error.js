module.exports = (error, _, res, next) => {
  console.error(error.message);
  res.status(500).send({ error: error.message });
  next();
};