/* eslint-disable no-console, no-process-exit */
const dedicatedbrand = require('./eshops/dedicatedbrand');
const montlimartbrand = require('./eshops/Montlimartbrand');




const brands = ['Dedicated','Montlimart','Circle'];
// const brands = ['Montlimart'];

async function sandbox (eshop) {
  try {
	if (eshop == 'Dedicated'){
		console.log(`🕵️‍♀️  browsing ${eshop} eshop`);
		const products = await dedicatedbrand.GetAll();
		
		console.log(` ${products.length} found for ${eshop} eshop`);
			
	}
	if (eshop == 'Montlimart'){
		console.log(`🕵️‍♀️  browsing ${eshop} eshop`);
		const products = await montlimartbrand.GetAll();
		
		console.log(` ${products.length} found for ${eshop} eshop`);
	}
	else {console.log('Not in the brands listed');}
	
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

const [,, eshop] = process.argv;

for (let i = 0; i < brands.length; i++) {
   sandbox(brands[i]);
}