
const Minio = require('minio');

//minio-k8s.minio-storage.svc.cluster.local
var minioClient = new Minio.Client({
  endPoint: 'minio-k8s.minio-storage.svc.cluster.local',
  port: 9000,
  useSSL: false,
  accessKey: 'chris',//Kub3rn3t3s2023
  secretKey: 'chris4589'//Kub3rn3t3s2023
});


module.exports = {
  minioClient
}