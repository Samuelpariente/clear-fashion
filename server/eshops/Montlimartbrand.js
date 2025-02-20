const fetch = require('node-fetch');
const cheerio = require('cheerio');


 const scrapedate = Date.now();
/**
 * Parse webpage e-shop
 * @param  {String} data - html response
 * @return {Array} products
 */

const parse = async (data) => {
  const $ = cheerio.load(data);

  const products = await Promise.all(
    $(".products-list__block").map(async (i, elt) => {
      const name = $(elt).find(".text-reset").text().trim().replace(/\s+/g, " ");
      const brand = "Montlimart";
      const price = parseInt($(elt).find(".price").text(), 10);
      const link = $(elt).find(".product-miniature__thumb-link").attr("href");
      let image = "";

      if ($(elt).find("video").length > 0) {
        const response = await fetch(link);
        const body = await response.text();
        const $b = cheerio.load(body);
        image = $b("img")[0].attribs["data-src"];
      } else {
        image = $(elt).find(".product-miniature__thumb img")[0].attribs["data-src"];
      }

      return { name, brand, price, image, link, scrapedate };
    }).get()
  );

  const filteredProducts = products.filter((product) => !product.name.includes("CADEAU"));
  return filteredProducts;
};

/**
 * Scrape all the products for a given url page
 * @param  {[type]}  url
 * @return {Array|null}
 */


module.exports.GetAll = async() => {
	const rep = await fetch("https://www.montlimart.com/");
	temp = await rep.text();
	let $ = cheerio.load(temp);
	const allLinks  = $('.sub .a-niveau1').map((i,elt) => {
		return $(elt).attr('href');
	}).get();
	const filteredlink = allLinks.filter(link => !link.includes("propos"));
	
	let reponse;
	let products;
	let totalProducts = [];
	for (let i = 0; i < filteredlink.length; i++) {
		reponse = await fetch(filteredlink[i]);
		data = await reponse.text();
		products = await parse(data);
		totalProducts = totalProducts.concat(products);
	}
	return totalProducts;
}