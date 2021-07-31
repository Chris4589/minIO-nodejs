const responses = (status, msg, error, res) => {
  return res.status(status).send({
    error,
    msg,
  });
}

module.exports = {
  responses
}