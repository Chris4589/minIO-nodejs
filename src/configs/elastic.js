
const elasticsearch = require('elasticsearch');

//elasticsearch-svc.elastic.svc.cluster.local:9200
const client = elasticsearch.Client({
  host: 'elasticsearch-svc.elastic.svc.cluster.local:9200',
  log: 'trace',
  apiVersion: '7.x', 
});

module.exports = {
  client
}