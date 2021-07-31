const { minioClient } = require("../configs/minIO");

const getImgFromBucket = (bucket, file) => {
  return new Promise((resolve, reject) => {

    return minioClient.presignedUrl('GET', bucket, file, 24*60*60, function(err, presignedUrl) {
      if (err) return reject(
        'Error al obtener el archivo.'
      );

      return resolve(presignedUrl);
    })
  });
}

module.exports = {
  getImgFromBucket
}