const cors = require('cors');
const express = require('express');
const helmet = require('helmet');

const {MongoClient} = require('mongodb');
const MONGODB_DB_NAME = 'clearfashion';
let ObjectId = require('mongodb').ObjectId;

const PORT = 8092;

const app = express();

module.exports = app;

app.use(require('body-parser').json());
app.use(cors());
app.use(helmet());

app.options('*', cors());

app.get('/', (request, response) => {
  
 response.send({reponse : "alive"});
  
  
});

const pass = process.env.mdp;
console.log(pass);
app.get('/brands', async (request, response) => {
  try{
	  const uri = `mongodb+srv://samuel:${pass}@clearfashion.dv6hbxy.mongodb.net/?retryWrites=true&w=majority`;
	  const MONGODB_DB_NAME = 'clearfashion';
	  const client = await MongoClient.connect(uri, {'useNewUrlParser': true});
	  const db =  client.db(MONGODB_DB_NAME);
	  const collection = db.collection('products');
	  
	  searchresult = await collection.distinct('brand');
	  response.send({result : searchresult});
  } catch(e){
	  response.send({error : "invalid search"});  
  }
  
});

app.get('/products/search', async (request, response) => {
  try{
	  const uri = `mongodb+srv://samuel:${pass}@clearfashion.dv6hbxy.mongodb.net/?retryWrites=true&w=majority`;
	  const MONGODB_DB_NAME = 'clearfashion';
	  const client = await MongoClient.connect(uri, {'useNewUrlParser': true});
	  const db =  client.db(MONGODB_DB_NAME);
	  const collection = db.collection('products');
	  
	  let brandFilter = request.query.brand;
	  let maxPrice = request.query.price ;
	  let numPerPage = request.query.limit;
	  
	  let query = {};
	  if(brandFilter !== undefined){
		  query.brand = brandFilter;
	  }
	  if (maxPrice !== undefined) {
		query.price = {$lte: parseInt(maxPrice)};
	  }
	  if (numPerPage == undefined) {
		numPerPage = 12;
	  }
	  searchresult = await collection.find(query).limit(parseInt(numPerPage)).toArray();
	  response.send({result : searchresult});
  } catch(e){
	  response.send({error : "invalid search"});  
  }
  
});



app.get('/products/:id', async (request, response) => {
  try{
	  const uri = `mongodb+srv://samuel:${pass}@clearfashion.dv6hbxy.mongodb.net/?retryWrites=true&w=majority`;
	  const MONGODB_DB_NAME = 'clearfashion';
	  const client = await MongoClient.connect(uri, {'useNewUrlParser': true});
	  const db =  client.db(MONGODB_DB_NAME);
	  const collection = db.collection('products');
	  
	  
	  const productId = request.params.id;
	  const searchresult = await collection.findOne({_id: ObjectId(productId)});
	  response.send({result : searchresult});
  } catch(e){
	  response.send({error : "invalid id"});  
  }
  
});





app.listen(PORT);

console.log(`📡 Running on port ${PORT}`);

module.exports = app;

// test "64030712734d4b2b5ec45ccb"