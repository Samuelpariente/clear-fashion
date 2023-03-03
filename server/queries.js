const {MongoClient} = require('mongodb');
const MONGODB_DB_NAME = 'clearfashion';
 
const brand = 'Montlimart';
const price = 40;


async function FindByBrand(brand) {	

	const uri = 'mongodb+srv://samuel:R2WkLjmO9ENfMtMw@clearfashion.dv6hbxy.mongodb.net/?retryWrites=true&w=majority';
	const MONGODB_DB_NAME = 'clearfashion';
	const client = await MongoClient.connect(uri, {'useNewUrlParser': true});
	const db =  client.db(MONGODB_DB_NAME);
	const collection = db.collection('products');
	
	
	
    const result = await collection.find({brand}).toArray();
    client.close();
	console.log(result);
}

async function FindlessThan(Price_) {	

	const uri = 'mongodb+srv://samuel:R2WkLjmO9ENfMtMw@clearfashion.dv6hbxy.mongodb.net/?retryWrites=true&w=majority';
	const MONGODB_DB_NAME = 'clearfashion';
	const client = await MongoClient.connect(uri, {'useNewUrlParser': true});
	const db =  client.db(MONGODB_DB_NAME);
	const collection = db.collection('products');
	
	
    const result = await collection.find({price: {$lt: Price_}}).toArray();
    client.close();
	console.log(result);
}

async function FindsortedbyPrice() {	

	const uri = 'mongodb+srv://samuel:R2WkLjmO9ENfMtMw@clearfashion.dv6hbxy.mongodb.net/?retryWrites=true&w=majority';
	const MONGODB_DB_NAME = 'clearfashion';
	const client = await MongoClient.connect(uri, {'useNewUrlParser': true});
	const db =  client.db(MONGODB_DB_NAME);
	const collection = db.collection('products');

    const result = await collection.find().sort({price: 1}).toArray();
    client.close();
	console.log(result);
}

async function FindsortedbyDate() {	

	const uri = 'mongodb+srv://samuel:R2WkLjmO9ENfMtMw@clearfashion.dv6hbxy.mongodb.net/?retryWrites=true&w=majority';
	const MONGODB_DB_NAME = 'clearfashion';
	const client = await MongoClient.connect(uri, {'useNewUrlParser': true});
	const db =  client.db(MONGODB_DB_NAME);
	const collection = db.collection('products');
	
    const result = await collection.find().sort({scrapedate: -1}).toArray();
    client.close();
	console.log(result);
}

async function FindsortedbyDate() {	

	const uri = 'mongodb+srv://samuel:R2WkLjmO9ENfMtMw@clearfashion.dv6hbxy.mongodb.net/?retryWrites=true&w=majority';
	const MONGODB_DB_NAME = 'clearfashion';
	const client = await MongoClient.connect(uri, {'useNewUrlParser': true});
	const db =  client.db(MONGODB_DB_NAME);
	const collection = db.collection('products');

	let twoWeeksAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);
    const result = await collection.find({scrapedate: {$gt: twoWeeksAgo}}).toArray();
	client.close();
    console.log(result);
}


FindsortedbyDate();
