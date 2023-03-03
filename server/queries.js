const {MongoClient} = require('mongodb');
const MONGODB_DB_NAME = 'clearfashion';
 
const brand = 'Dedicated';


async function FindByBrand(brand) {	

	const uri = 'mongodb+srv://samuel:R2WkLjmO9ENfMtMw@clearfashion.dv6hbxy.mongodb.net/?retryWrites=true&w=majority';
	const MONGODB_DB_NAME = 'clearfashion';
	const client = await MongoClient.connect(uri, {'useNewUrlParser': true});
	const db =  client.db(MONGODB_DB_NAME);
	const collection = db.collection('products');
	
	
	
    const result = await collection.find({brand}).toArray();
    console.log(result);
}

FindByBrand(brand);
