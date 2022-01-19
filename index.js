const containerLoader = document.getElementById("pre-loader");
const loader = document.getElementById("loader");

const searchBar = document.getElementById("search-bar");
const searchValue = document.getElementById("search-value");
const searchBarBtn = document.getElementById("search-bar-btn");
const dropDownMenu = document.getElementById("dropdown-cat");
const dropdownBtn = document.getElementById ("drop-btn");
const dropdownSubCatBtn = document.getElementsByClassName("btn-subCategories");
const dropdownSubCat = document.getElementById("dropdown-subcat"); 
const slideShow = document.getElementById("slide");
const resultsView = document.getElementById ("results")
const asideProducts = document.getElementById("aside-products");
const asideCategories = document.getElementById ("aside-categories")
const main = document.querySelector("main");
// const slides = document.querySelectorAll('#slides .slide');
// const next = document.getElementById('next');
// const prev = document.getElementById('prev');
const productsView = document.getElementById("products-view");
const productsCards = document.getElementById("products");

const titleAsideProducts = document.getElementById("search-value-product-title");
const titleAsideCategory = document.getElementById("category-title");

const btnAsc = document.getElementById("asc");
const btnDesc = document.querySelector("desc");
const checkBoxsProducts = document.querySelectorAll('.check-products');
const checkBoxsCategories = document.querySelectorAll (".check-categories")
const stateSelect = document.getElementById("state-select");
const checkbxStore = document.getElementById("official-store");
const checkbxStoreCat = document.getElementById("official-store-cat");

const checkbxShipping = document.getElementById("shipping");
const checkbxPayment = document.getElementById("payment");
const checkbxNew = document.getElementById("new");
const checkbxUsed = document.getElementById ("used");
const singleProductView = document.getElementById("single-product");
const cardSingleProduct = document.getElementById("card-single-product");


//LOADER

const dataload = () => {

    setTimeout(function () {

        containerLoader.style.display = "none";
        loader.classList.add ("hidden")

        ;
    }, 300);
}

//PAGING FOR SEARCHED PRODUCTS


let offset = 0


const btnNext = document.getElementById("next");
const btnPrev = document.getElementById("prev");


btnNext.onclick = (e) => {

    e.preventDefault()

    offset = offset + 8

    applyFiltersInProducts(searchValue.value,offset)
    
}    

btnPrev.onclick = (e) =>{

    e.preventDefault()

    if( offset <= 0){
        btnPrev.setAttribute("disabled");
    }
    else{
        btnPrev.removeAttribute("disabled");
        offset -= 8
        
    }
    
    applyFiltersInProducts(searchValue.value,offset)

}



//SEARCH BAR
const searchProducts = (searchValue,offset) => {

    let url = `https://api.mercadolibre.com/sites/MLA/search?q=${searchValue}&offset=${offset}&limit=8`;


    containerLoader.style.display ="flex";
    loader.classList.remove ("hidden")
    console.log(url)

    fetch(url)
    
    .then(res => res.json())
    
    .then(data => {

        console.log(data)
        dataload()
        HTMLproducts(data.results)

    })
}

searchBar.onsubmit = (e) => {

    e.preventDefault()
    searchProducts(searchValue.value,offset)
    titleAsideProducts.innerHTML = searchValue.value
    fetchSelectState(searchValue.value)


}

//PRODUCTS 

const HTMLproducts = (data) => {

    singleProductView.classList.add("hidden")
    slideShow.classList.add("hidden");
    resultsView.classList.remove("hidden");
    asideCategories.style.display= "none"
    asideProducts.style.display ="block";




    const products = data.reduce ((acc,curr) => {

        return acc + `    
        
        <article class ="card " data-id="${curr.id}">

            <div class ="img-container">
                <img class="thumbnail" src="${curr.thumbnail}"></img>
            </div>
            <div class="card-padding">

                <h2>${curr.title}</h2>
                <div class = "row">
                ${curr.shipping.free_shipping === true ? " <p class='free' ><i class='fas fa-shipping-fast'></i> Envio gratis</p>" : "<p>Envio normal</p>" }
                </div>
                <h3>$  ${curr.price}</h2>

            </div>
      </article>

        `
    },"")

    productsCards.innerHTML = products;

    getIDofProducts()


}

const getIDofProducts = () => {
    
    const cards = document.getElementsByClassName("card");

    
    for (let card of cards){

        card.onclick = () => {

            singleProductView.classList.remove("hidden")
            slideShow.classList.add("hidden");
            resultsView.classList.add("hidden");

            searchSingleProduct(card.dataset.id)

        } 

    }
}



const searchSingleProduct = (ID) => {

    fetch (`https://api.mercadolibre.com/items/${ID}`)
    .then (res => res.json ())
    .then (data => {

        containerLoader.style.display ="flex";
        loader.classList.remove ("hidden")

        fetch (`https://api.mercadolibre.com/items/${ID}/description`)

        .then (res => res.json ())
    
        .then (description => {
            
            dataload()

            HTMLforSingleProduct(data,description)
            
        })
    })


}


const HTMLforSingleProduct = (data,description) => {


    singleProductView.innerHTML = `

        <article id="card-single-product">

            <div class=" row">

                <div class ="photo-container">

                    <img class="photo" src="${data.thumbnail}"></img>
                </div>
                <div class="single-product-pad">

                    <h2>${data.title}</h2>
                    <div class = "row">
                    ${data.shipping.free_shipping === true ? " <p class='free' ><i class='fas fa-shipping-fast'></i> Envio gratis</p>" : "<p>Envio normal</p>" }

                    </div>
                    <h3>$ ${data.price}</h2>
                    <button id="btn-buy">Agregar al carrito</button>

                </div>
            </div>

            <div id="description-box">
                <h4>Descripción</h4>
                <h4 id="description">
                ${description.plain_text}
                

                </h4>
            </div>
    
            </article>

    `
} 


//FILTERS FOR PRODUCTS

const fetchSelectState = (searchValue) => {

    fetch(`https://api.mercadolibre.com/sites/MLA/search?q=${searchValue}`)
    .then(res =>res.json())
    .then(data =>{

    HTMLforStateSelect(data.available_filters)


    })


}

const HTMLforStateSelect = (data) => {


    const getStates= data.find ( filter => filter.id === "state")

    const states = getStates.values

    const selectNone = `<option value="none">Selecciona tu ubicación</option>`;

    const stateOption = states.reduce ((acc,curr) => {


        return acc + `   
        <option class="state-name" value="${curr.id}">${curr.name}</option>

        `
    },"");

    stateSelect.innerHTML = selectNone + stateOption;


}

let IDofState = "";
let stateBoolean = false;
 
stateSelect.addEventListener('change',(e) => {

    IDofState = stateSelect.value;  
    stateBoolean = true;
    
});


checkBoxsProducts.forEach((checkbox) => { 

    checkbox.addEventListener('change', (event) => {

        applyFiltersInProducts(searchValue.value,offset)
        
    })
})

const applyFiltersInProducts = (searchValue,offset) => {

    let url = `https://api.mercadolibre.com/sites/MLA/search?q=${searchValue}&offset=${offset}&limit=8`;

       
        if (checkbxShipping.checked) {
            url = url + "&shipping_cost=free"
        }
        if (checkbxPayment.checked) {
            url = url + "&installments=no_interest"
        }
        if (checkbxNew.checked) {
            url = url + "&ITEM_CONDITION=2230284"
        }
        if (checkbxUsed.checked) {
            url = url + "&ITEM_CONDITION=2230581"
        }
        if (checkbxStore.checked){
            url = url + "&official_store=all"

        }
        console.log (url)

        fetch(url)
    
    .then(res => res.json())
    .then(data => {

        HTMLproducts(data.results)
        console.log(data)




    })
}


//CATEGORIES

const getCategories = () => {

    fetch(`https://api.mercadolibre.com/sites/MLA/categories`)

    .then(res =>res.json())
    .then(data =>{

        HTMLdropDownMenu(data)

    })
}

//DROP DOWN MENU

const HTMLdropDownMenu = (data) => {
    
    
    const catNames = data.reduce ((acc,curr) => {
        return acc + `   
        <div class= "row category" > 

            <p class="cat-name" data-id="${curr.id}">${curr.name}</p>
            <button class="btn-subCategories"> <i class="fas fa-chevron-right"></i> </button>
        
        </div>
        `
    },"")
    
    dropDownMenu.innerHTML = catNames
    
    getIDofCategory()



}

const getIDofCategory = () => {

    const categories = document.getElementsByClassName("cat-name");

    
    for (let category of categories){

        category.onclick = () => {

        IDofCategory = category.dataset.id
        console.log(IDofCategory)

        applyFiltersInCategories(IDofCategory,offsetForCat)
        //getChildrenCategories(category.dataset.id)


        } 

    }
}

dropdownBtn.onmouseenter = () => {
    getCategories()
}

//PAGING FOR CATEGORY PRODUCTS

let IDofCategory = "";

let offsetForCat= 0;

const btnNextCat = document.getElementById("next-cat");
const btnPrevCat = document.getElementById("prev-cat");


btnNextCat.onclick = (e) => {

    console.log(offsetForCat)

    e.preventDefault()

    offsetForCat = offsetForCat + 8

console.log(offsetForCat)

searchByCategories(IDofCategory,offsetForCat)
    
}    

btnPrevCat.onclick = (e) =>{

    console.log(offsetForCat)

    e.preventDefault()

    if( offsetForCat <= 0){
        btnPrevCat.setAttribute("disabled");
    }
    else{
        btnPrevCat.removeAttribute("disabled");
        offsetForCat -= 8

        console.log(offsetForCat)

        
    }
    searchByCategories(IDofCategory,offsetForCat)

}


const searchByCategories = (IDofCategory,offsetForCat) => {

    containerLoader.style.display ="flex";
    
    loader.classList.remove ("hidden")

    console.log(offsetForCat)

    let url = (`https://api.mercadolibre.com/sites/MLA/search?category=${IDofCategory}&offset=${offsetForCat}&limit=8`)

    fetch(url)
    .then (res =>res.json())
    .then(data => {

        dataload()

        HTMLproducts(data.results);
        asideProducts.style.display ="none"
        asideCategories.style.display= "block"
    })
}

//FILTERS  FOR CATEGORIES


checkBoxsCategories.forEach((checkboxCat) => { 

    checkboxCat.addEventListener('change', (event) => {

        applyFiltersInCategories(IDofCategory,offsetForCat)
        
    })
})

const applyFiltersInCategories = (IDofCategory,offsetForCat) => {
    
    let url = (`https://api.mercadolibre.com/sites/MLA/search?category=${IDofCategory}&offset=${offsetForCat}&limit=8`)

       
        if (checkbxStoreCat.checked){
            url = url + "&official_store=all"

        }
            console.log(url)
        fetch(url)
    
    .then(res => res.json())
    .then(data => {
        console.log(IDofCategory)
        HTMLproducts(data.results)


    })
}


/* const getChildrenCategories = (category_ID) =>{

fetch(`https://api.mercadolibre.com/categories/${category_ID}`)

.then (res => res.json())
.then(data => {
    console.log(data.children_categories)

    

 })
}

const HTMLforSubCategory = (arr) => {
    

    const subCatNames = getSubCategory.reduce ((acc,curr) => {
        return acc +
        `
                <p data-id=${curr.id}>${curr.name}</p>
            `
    },"")

    dropdownSubCat.innerHTML = subCatNames;
    
}
*/




//SORT

const sortDesc = (data) =>{
    data.sort((a,b)=>b.price-a.price)


}
const sortAsc = (data) =>{
    data.sort((a,b)=>a.price-b.price)
}
