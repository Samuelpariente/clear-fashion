// Invoking strict mode https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode#invoking_strict_mode
'use strict';

/*
Description of the available api
GET https://clear-fashion-api.vercel.app/

Search for specific products

This endpoint accepts the following optional query string parameters:

- `page` - page of products to return
- `size` - number of products to return

GET https://clear-fashion-api.vercel.app/brands

Search for available brands list
*/

// current products on the page
let currentProducts = [];
let currentPagination = {};


// instantiate the selectors
const selectShow = document.querySelector('#show-select');
const selectPage = document.querySelector('#page-select');
const sectionProducts = document.querySelector('#products');
const spanNbProducts = document.querySelector('#nbProducts');
const selectBrand = document.querySelector('#brand-select');
const recentCheckbox = document.querySelector("#recent-checkbox");
const priceCheckbox = document.querySelector("#reasonable-price");
const sortVal = document.querySelector("#sort-select");
const newproduct = document.querySelector("#newprod");
const nbbrand = document.querySelector("#nbBrands");
const p50 = document.querySelector("#p50");
const p90 = document.querySelector("#p90");
const p95 = document.querySelector("#p95");
const last = document.querySelector("#last");

/**
 * Set global value
 * @param {Array} result - products to display
 * @param {Object} meta - pagination meta info
 */
 
 
 
const setCurrentProducts = ({result, meta}) => {
  currentProducts = result;
  currentPagination = meta;
};

/**
 * Fetch products from api
 * @param  {Number}  [page=1] - current page to fetch
 * @param  {Number}  [size=12] - size of the page
 * @return {Object}
 */
 
 
const fetchProducts = async (page = 1, size = 12) => {
  try {
    let url = `https://clear-fashion-api.vercel.app?page=${page}&size=${size}`;
    const response = await fetch(url);
    const body = await response.json();

    if (body.success !== true) {
      console.error(body);
      return {currentProducts, currentPagination};
    }
	
    return body.data;
	
  } catch (error) {
    console.error(error);
    return {currentProducts, currentPagination};
  }
};


const getmaxproduct = async(page ,size , brand, recent, price,Val) => {
	const max =  await fetchProducts(1,12);
	const maxi = max.meta.count;
	let products = await fetchProducts(1,maxi);
	const toshowmin = page*size - size;
	const toshowmax = page*size;
	if (brand !== null && brand !== "") {
		products = filterByBrand(products,brand);
    }
	if(recent == true){
			products =  filterRecentResults(products)
			
		}
	
	if(price == true){
		products = filterLowPriceResults(products);
	}
	if (Val == "price-asc"){
		products = sortResultsByPriceAscending(products);
	}
	if (Val == "price-desc"){
		products = sortResultsByPriceDescending(products);
	}
	if (Val == "date-desc"){
		products = sortResultsByDateDescending(products);
	}
	if (Val == "date-asc"){
		products = sortResultsByDateAscending(products);
	}

	products = toshow(toshowmin,toshowmax,products);
	return products;
	};
	

const fetchBrands = async () => {
  try {
    const response = await fetch('https://clear-fashion-api.vercel.app/brands');
    const body = await response.json();

    if (body.success !== true) {
      console.error(body);
      return [];
    }

    return body.data;
  } catch (error) {
    console.error(error);
    return [];
  }
};

/**
 * Render list of products
 * @param  {Array} products
 */
 
 
const renderProducts = products => {
  const fragment = document.createDocumentFragment();
  const div = document.createElement('div');
  const template = products
    .map(product => {
      return `
      <div class="product" id=${product.uuid}>
        <span>${product.brand}</span>
        <a target="_blank" href="${product.link}">${product.name}</a>
        <span>${product.price} €</span>
		<label>
			<input type="checkbox" name="fav" id=${product.uuid}>
			<span class="heart"></span>
		 </label>
      </div>
    `;
    })
    .join('');

  div.innerHTML = template;
  fragment.appendChild(div);
  sectionProducts.innerHTML = '';
  sectionProducts.appendChild(fragment);
};




/**
 * Render page selector
 * @param  {Object} pagination
 */

const renderPagination = pagination => {
  const {currentPage, pageCount} = pagination;
  const options = Array.from(
    {'length': pageCount},
    (value, index) => `<option value="${index + 1}">${index + 1}</option>`
  ).join('');

  selectPage.innerHTML = options;
  selectPage.selectedIndex = currentPage - 1;
};

/**
 * Render page selector
 * @param  {Object} pagination
 */
const renderIndicators = pagination => {
  const {count} = pagination;

  spanNbProducts.innerHTML = count;
  countRecent(count);
  countbrand();
  pvalue();
  lastrelease();
  
};

const renderBrandSelect = brands => {
  const brandNames = Object.values(brands)[0];
  const options = brandNames
    .map(name => `<option value="${name}">${name}</option>`)
    .join('');
  selectBrand.innerHTML = `<option value="">All brands</option>` + options;
};


const render = (products, pagination, brand) => {
  renderProducts(products);
  renderPagination(pagination);
  renderIndicators(pagination);
  const brandHeading = document.createElement('h2');
  if (brand) {
    brandHeading.textContent = `Products for ${brand}`;
  } else {
    brandHeading.textContent = 'Products';
  }
  sectionProducts.insertBefore(brandHeading, sectionProducts.firstChild);
};
/**
 * Declaration of all Listeners
 */

 selectShow.addEventListener('change', async (event) => {
	 
  let products = await getmaxproduct(
    currentPagination.currentPage,
    parseInt(event.target.value),
    selectBrand.value,
	recentCheckbox.checked,
	priceCheckbox.checked,
	sortVal.value
  );
  
  setCurrentProducts(products);
  render(currentProducts, currentPagination, selectBrand.value);
});


/**
 * Select the page to display
 */
selectPage.addEventListener('change', async (event) => {
  const page = parseInt(event.target.value);
  let products = await getmaxproduct(
    page,
	selectShow.value,
	selectBrand.value, 
	recentCheckbox.checked,
	priceCheckbox.checked,
	sortVal.value);

  setCurrentProducts(products);
  render(currentProducts, currentPagination, selectBrand.value);
  
});

/**
 * Select the number of page
 */

selectBrand.addEventListener('change', async (event) => {
  let products = await getmaxproduct(
    currentPagination.currentPage,
    selectShow.value,
    event.target.value,
	recentCheckbox.checked,
	priceCheckbox.checked,
	sortVal.value
  );
  setCurrentProducts(products);
  render(currentProducts, currentPagination, event.target.value);
});

/**
 * load page
 */

document.addEventListener('DOMContentLoaded', async () => {
  let products = await fetchProducts();
  setCurrentProducts(products);
  render(currentProducts, currentPagination);
});

/**
 * load brands
 */

document.addEventListener('DOMContentLoaded', async () => {
  const brands = await fetchBrands();
  renderBrandSelect(brands);
});


recentCheckbox.addEventListener('click',async () => {
	
		let products = await getmaxproduct(
		currentPagination.currentPage,
		selectShow.value,
		selectBrand.value,
		recentCheckbox.checked,
		priceCheckbox.checked,
		sortVal.value
		);
		
		setCurrentProducts(products);
		render(currentProducts, currentPagination, selectBrand.value);
})



priceCheckbox.addEventListener('click',async () => {
	
		let products = await getmaxproduct(
		currentPagination.currentPage,
		selectShow.value,
		selectBrand.value,
		recentCheckbox.checked,
		priceCheckbox.checked,
		sortVal.value
		);
		setCurrentProducts(products);
		render(currentProducts, currentPagination, selectBrand.value);
})

sortVal.addEventListener('change', async () => {
	 
    let products = await getmaxproduct(
		currentPagination.currentPage,
		selectShow.value,
		selectBrand.value,
		recentCheckbox.checked,
		priceCheckbox.checked,
		sortVal.value
		);
		setCurrentProducts(products);
		render(currentProducts, currentPagination, selectBrand.value);
});

function filterRecentResults(data) {
  const { result, meta } = data; // extract the result array and meta object from the input object

  const twoWeeksAgo = Date.now() - (14 * 24 * 60 * 60 * 1000); // calculate timestamp for two weeks ago
  const recentResults = result.filter(item => {
    const releasedTimestamp = Date.parse(item.released); // parse released date string to timestamp
    return releasedTimestamp >= twoWeeksAgo; // keep item if its released timestamp is within the past two weeks
  });

  const filteredData = { result: recentResults, meta }; // create new object with filtered result array and original meta object

  return filteredData;
}


function filterLowPriceResults(data) {
  const { result, meta } = data; // extract the result array and meta object from the input object

  const lowPriceResults = result.filter(item => {
    return item.price < 50; // keep item if its price is less than 50
  });

  const filteredData = { result: lowPriceResults, meta }; // create new object with filtered result array and original meta object

  return filteredData;
}

function sortResultsByPriceAscending(data) {
  const { result, meta } = data; // extract the result array and meta object from the input object

  const sortedResults = result.slice().sort((a, b) => a.price - b.price); // create a copy of the result array and sort it in ascending order of price

  const sortedData = { result: sortedResults, meta }; // create new object with sorted result array and original meta object

  return sortedData;
}

function sortResultsByPriceDescending(data) {
  const { result, meta } = data; // extract the result array and meta object from the input object

  const sortedResults = result.slice().sort((a, b) => b.price - a.price); // create a copy of the result array and sort it in descending order of price

  const sortedData = { result: sortedResults, meta }; // create new object with sorted result array and original meta object

  return sortedData;
}

function sortResultsByDateAscending(data) {
  const { result, meta } = data; // extract the result array and meta object from the input object

  const sortedResults = result.slice().sort((a, b) => {
    const aDate = new Date(a.released);
    const bDate = new Date(b.released);
    return aDate - bDate;
  }); // create a copy of the result array and sort it in ascending order of release date

  const sortedData = { result: sortedResults, meta }; // create new object with sorted result array and original meta object

  return sortedData;
}

function sortResultsByDateDescending(data) {
  const { result, meta } = data; // extract the result array and meta object from the input object

  const sortedResults = result.slice().sort((a, b) => {
    const aDate = new Date(a.released);
    const bDate = new Date(b.released);
    return bDate - aDate;
  }); // create a copy of the result array and sort it in descending order of release date

  const sortedData = { result: sortedResults, meta }; // create new object with sorted result array and original meta object

  return sortedData;
}

async function countRecent(max){
	const page = 1;
	const products = await fetchProducts(page,max);
	const newproduct = filterRecentResults(products);
	const len = newproduct.result.length;
	newproduct.innerHTML = len;
}

async function countbrand(){
	if(selectBrand.value == ""){
	const brand = await fetchBrands();
	nbbrand.innerHTML = brand.result.length;
	}
	else {
		nbbrand.innerHTML = 1;
	}
}

async function pvalue(){
	const products = await fetchProducts(
    currentPagination.currentPage,
    selectShow.value,
    selectBrand.value,
	recentCheckbox.checked,
	priceCheckbox.checked,
	sortVal.value
  );
  
	const res = getPricePercentiles(products);
	p50.innerHTML = res.percentiles.p50;
	p90.innerHTML = res.percentiles.p90;
	p95.innerHTML = res.percentiles.p95;
}

function getPricePercentiles(data) {
  const prices = data.result.map((product) => product.price); // extract prices from result array

  const sortedPrices = prices.slice().sort((a, b) => a - b); // create a sorted copy of prices array

  const percentile50 = sortedPrices[Math.floor(sortedPrices.length * 0.5)]; // calculate p50 value
  const percentile90 = sortedPrices[Math.floor(sortedPrices.length * 0.9)]; // calculate p90 value
  const percentile95 = sortedPrices[Math.floor(sortedPrices.length * 0.95)]; // calculate p95 value

  const percentiles = { p50: percentile50, p90: percentile90, p95: percentile95 }; // create object with percentiles

  const resultWithPercentiles = { ...data, percentiles }; // create object with original data and percentiles

  return resultWithPercentiles;
}

function getLastReleasedProduct(data) {
  if (data.result.length !== 0){
  const sortedProducts = data.result.slice().sort((a, b) => new Date(b.released) - new Date(a.released)); // create a sorted copy of the result array based on releaseDate
  const latestRelease = sortedProducts[0]; // get the latest release from the sorted array
  return latestRelease;
  }
  else {return 0}
}


async function lastrelease(){
	const products = await fetchProducts(
    currentPagination.currentPage,
    selectShow.value,
    selectBrand.value,
	recentCheckbox.checked,
	priceCheckbox.checked,
	sortVal.value
    );
	const latestRelease = getLastReleasedProduct(products);
	last.innerHTML  = latestRelease.released;
	
}

function toshow(indmin, indmax, data){
  const { result, meta } = data;
  const selectedP = result.slice(indmin,indmax);
  const products = { result: selectedP, meta : meta }; // create new object with sorted result array and original meta object
  return products;
}

function filterByBrand(input, brand) {
  const filteredItems = input.result.filter(item => item.brand === brand);
  return { result: filteredItems, meta: input.meta };
}
