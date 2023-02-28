const fetch = require('node-fetch');
const cheerio = require('cheerio');

/**
 * Parse webpage e-shop
 * @param  {String} data - html response
 * @return {Array} products
 */
 


module.exports.GetAll = async() => {
	const rep = await fetch('https://www.dedicatedbrand.com/en/loadfilter');
	const { products } = await rep.json();
	const filteredProducts = products.filter(data => Object.keys(data).length > 0);
  
	  const transformedProducts = filteredProducts.map(data => ({
		name: data.name,
		brand: "Dedicated",
		price: data.price.priceAsNumber,
		image: data.image[0],
		link: "https://www.dedicatedbrand.com/en/" + data['canonicalUri']
	  }));
  
  return transformedProducts;
}
