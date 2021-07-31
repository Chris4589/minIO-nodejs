const { minioClient } = require("../configs/minIO");

const BucketValid = (req, res, next) => {
 
  minioClient.bucketExists(req.query.bucket, function(err, exists) {
    if (err) {
      return responses(500, {error: `Error en la conexion al bucket ${req.query.bucket}: ${err}`}, true, res);
    }
    if (!exists) {
      return minioClient.makeBucket(req.query.bucket, 'ap-southeast-1', (err) => {
        if (err) {
          return responses(500, {error: `No se pudo crear el bucket: ${err}`}, true, res);
        }
        next();
      });
    }
    next();
  });
  
}

module.exports = {
  BucketValid
}