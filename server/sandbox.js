/* eslint-disable no-console, no-process-exit */
const dedicatedbrand = require('./eshops/dedicatedbrand');
const montlimartbrand = require('./eshops/Montlimartbrand');
const circlebrand = require('./eshops/circlebrand');

const {MongoClient} = require('mongodb');
const MONGODB_DB_NAME = 'clearfashion';

const brands = ['Dedicated','Montlimart','Circle'];


async function ToDatabase(products) {	

	const uri = 'mongodb+srv://samuel:R2WkLjmO9ENfMtMw@clearfashion.dv6hbxy.mongodb.net/?retryWrites=true&w=majority';
	const MONGODB_DB_NAME = 'clearfashion';
	const client = await MongoClient.connect(uri, {'useNewUrlParser': true});
	const db =  client.db(MONGODB_DB_NAME);
	
	
	const collection = db.collection('products');
	collection.drop();
	
	
	
    const result = collection.insertMany(products);
    console.log(result);
	client.close();
}


async function sandbox (eshop) {
  try {
	if (eshop == 'Dedicated'){
		console.log(`🕵️‍♀️  browsing ${eshop} eshop`);
		const products = await dedicatedbrand.GetAll();
		console.log(` ${products.length} found for ${eshop} eshop`);
		return products;
			
	}
	if (eshop == 'Montlimart'){
		console.log(`🕵️‍♀️  browsing ${eshop} eshop`);
		const products = await montlimartbrand.GetAll();
		console.log(` ${products.length} found for ${eshop} eshop`)
		return products;
	}
	if (eshop == 'Circle'){
		console.log(`🕵️‍♀️  browsing ${eshop} eshop`);
		const products = await circlebrand.GetAll();
		console.log(` ${products.length} found for ${eshop} eshop`);
		return products;
	}
	else {console.log('Not in the brand list');}
	
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

async function Scrap(){
	let products = [];
	const [,, eshop] = process.argv;
	let temp;

	for (let i = 0; i < brands.length; i++) {
	   temp = await sandbox(brands[i]);
	   products = products.concat(temp);
	}
	
	await ToDatabase(products);
	
	const myJsonString = JSON.stringify(products);
	var fs = require('fs');
	fs.writeFile("products.json", myJsonString, function(err) {
		if (err) {
			console.log(err);
		}
});
}
Scrap();