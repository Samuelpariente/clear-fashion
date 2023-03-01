const fetch = require('node-fetch');
const cheerio = require('cheerio');



const parse = (data) => {
  const $ = cheerio.load(data);

  return $("li.grid__item").map((i, element) => {
    const name = $(element)
      .find(".card__heading.h5")
      .text()
      .trim()
      .replace(/\s+/g, " ");
    const price = parseInt($(element).find(".price__sale .money").text().slice(1), 10);
    const link = "https://shop.circlesportswear.com" + $(element)
      .find("h3.h5 .full-unstyled-link")
      .attr("href");
    const image = "https:" + $(element)
      .find("img")
      .attr("src");

    return { name, price, link, image };
  }).get();
};


module.exports.GetAll = async () => {
  try {
	url = "https://shop.circlesportswear.com/collections/all"
    const response = await fetch(url);

    if (response.ok) {
      const body = await response.text();

      return parse(body);
    }

    console.error(response);

    return null;
  } catch (error) {
    console.error(error);
    return null;
  }
};