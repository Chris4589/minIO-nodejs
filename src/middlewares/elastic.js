const { client } = require("../configs/elastic");

const elasticOnline = (req, res, next) => {
  client.ping({
      requestTimeout: 1000
    }, 
    function (error) {
      if (error) {
        return responses(500, {error: `El servidor de elastic esta apagado: ${error}`}, true, res);
      } 

      client.indices.exists({
        index: req.query.bucket
      }, (err, res, status) => {
          if (!res) {
            return client.indices.create({
              index: req.query.bucket
            }, function(err, resp, status) {
              if (!err) {
                next();
              } 
            });
          }
          next();
      });
  });
}

module.exports = {
  elasticOnline
}