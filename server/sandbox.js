/* eslint-disable no-console, no-process-exit */
const dedicatedbrand = require('./eshops/dedicatedbrand');
const montlimartbrand = require('./eshops/Montlimartbrand');
const circlebrand = require('./eshops/circlebrand');



const brands = ['Dedicated','Montlimart','Circle'];


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
	// console.log(products);
}
Scrap();