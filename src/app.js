
const express = require('express');
const uid = require('uuid');
const multer  = require('multer');
const path = require("path");
const cors = require('cors');

const { minioClient } = require('./configs/minIO');
const { getImgFromBucket } = require('./utils/minIO');
const { BucketValid } = require('./middlewares/minIO');
const { elasticOnline } = require('./middlewares/elastic');
const { createDocument, searchClient } = require('./utils/elastic');
const { client } = require('./configs/elastic');
const { responses } = require('./utils/response');

const app = express();
const port = 7071;

app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, 'public/minio')));

app.get(`/bucket`, [
    elasticOnline,
    BucketValid
  ],  async(req, res) => {

  try {
    const resp = await searchClient(req.query.bucket, req.query.file);
    const file = await Promise.all(resp.hits.hits.map( async(res) => {
      
      const file = await getImgFromBucket(req.query.bucket, res._source.filename);
      const filename = file.replace(new RegExp(/minio-k8s.minio-storage.svc.cluster.local:9000/g), "demo-poc-minio.app.apps.bsdprfap.comcel.com.gt");
      return {
          ...res,
          _source:{
            id: res._source.id,
            filename,
            name: res._source.name
          } 
        }
    }));

    if (!file.length) {
      return responses(403, { msg: `No existe en el servidor` }, false, res);
    }
    return responses(200, { file }, false, res);
  } catch (error) {
    return responses(500, {error: `Error en el servidor: ${error}`}, true, res);
  }

});

app.post(`/bucket`, [
    elasticOnline,
    BucketValid,
    multer({storage: multer.memoryStorage()}).single("img"),
  ], async(req, res) => {
  try {
    
    const extension = req.file.originalname.split(".");
    const fileName = `${uid.v4()}-${new Date().getTime()}-${req.query.bucket}-${req.query.codigo}.${extension[extension.length-1]}`.trim();

    minioClient.putObject(req.query.bucket, fileName, req.file.buffer, async function(error, etag) {
      if(error) {
          return console.log(`err - ${error}`);
      }
      const dataValues = {
        filename: fileName, 
        name: req.file.originalname
      };
      const resp = await searchClient(req.query.bucket, req.query.codigo);
    
      if (resp.hits.hits.length === 0) {
        createDocument(req.query.bucket, 'posts', dataValues);
      } else {
        const response = await client.update({
          index: req.query.bucket,
          type: resp.hits.hits[0]._type,
          id: resp.hits.hits[0]._id,
          body: {
            doc: {
              ...dataValues
            }
          }
        })
      }
      return responses(200, { ...dataValues }, false, res);
    });

  } catch (error) {
    console.log(`Error en el servidor: ${error}`);
    return responses(500, {error: `Error en el servidor: ${error}`}, true, res);
  }
});

app.get('*', (req, res) => { 
  res.sendFile(path.join(__dirname, 'public/minio/index.html'));
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
});