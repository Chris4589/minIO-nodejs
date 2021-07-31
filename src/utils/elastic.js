const { client } = require("../configs/elastic");

const createDocument = (index, type, data) => {
  
  client.index({
    index,
    type,
    body: {
      ...data
    }
  }, function(err, resp, status) {
    console.log(resp);
  });
}
const searchClient = (bucket, file) => {
  return new Promise((resolve, reject) => {
    client.search({
      index: bucket,
      type: 'posts',
    /*  q: `filename:${req.query.file}` */
      body: {
      query: {
          match: {
              "filename": file
          }
      }
    }
    })
    .then(resp => resolve(resp))
    .catch(err => reject(err));
  });
}

module.exports = {
  createDocument,
  searchClient
}