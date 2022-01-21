const containerLoader = document.getElementById("pre-loader");
const loader = document.getElementById("loader");
const searchBar = document.getElementById("search-bar");
const searchValue = document.getElementById("search-value");
const searchBarBtn = document.getElementById("search-bar-btn");
const dropDownMenu = document.getElementById("dropdown-cat");
const dropdownBtn = document.getElementById ("drop-btn");
const home = document.getElementById("home");
const resultsView = document.getElementById ("results")
const asideProducts = document.getElementById("aside-products");
const asideCategories = document.getElementById ("aside-categories")
const main = document.querySelector("main");
const productsView = document.getElementById("products-view");
const productsCards = document.getElementById("products");
const pageProductBtns = document.getElementById("product-page-btns");
const btnNextProduct = document.getElementById('next');
const btnPrevProduct = document.getElementById('prev');
const btnsPageSortProducts = document.getElementById("product-sort-page-btns");
const btnNextSortProducts = document.getElementById ("next-sort");
const btnPrevSortProducts = document.getElementById ("prev-sort");
const pageCategoryBtns = document.getElementById("category-page-btns");
const btnNextCat = document.getElementById("next-cat");
const btnPrevCat = document.getElementById("prev-cat");
const btnsPageSortCategories = document.getElementById("category-sort-page-btns");
const btnNextSortCat = document.getElementById ("next-sort-cat");
const btnPrevSortCat = document.getElementById ("prev-sort-cat");
const titleAsideProducts = document.getElementById("search-value-product-title");
const titleAsideCategory = document.getElementById("category-title");
const sortProductsBtns = document.getElementById("sort-btns-product");
const btnAscProducts = document.getElementById("asc-product");
const btnDescProducts = document.getElementById("desc-product");
const sortCategoryBtns = document.getElementById ("sort-btns-category")
const btnAscCat = document.getElementById("asc-cat");
const btnDescCat = document.getElementById("desc-cat");
const checkBoxsProducts = document.querySelectorAll('.check-products');
const checkBoxsCategories = document.querySelectorAll (".check-categories")
const stateSelect = document.getElementById("state-select");
const stateSelectCat = document.getElementById("state-select-cat");
const checkbxStore = document.getElementById("official-store");
const checkbxStoreCat = document.getElementById("official-store-cat");
const checkbxShipping = document.getElementById("shipping");
const checkbxShippingCat = document.getElementById("shipping-cat");
const checkbxPayment = document.getElementById("payment");
const checkbxPaymentCat = document.getElementById("payment-cat");
const checkbxAll = document.getElementById("all");
const checkbxAllCat = document.getElementById("all-cat");
const checkbxNew = document.getElementById("new");
const checkbxNewCat = document.getElementById("newCat");
const checkbxUsed = document.getElementById ("used");
const checkbxUsedCat = document.getElementById ("usedCat");
const singleProductView = document.getElementById("single-product");
const cardSingleProduct = document.getElementById("card-single-product");

const categoryChildren = document.getElementById("children");
const categoryCellphone = document.getElementById("cellphone");
const categoryGrocery = document.getElementById("grocery");
const autoPartsImg = document.getElementById("autoparts");
const gardenImg = document.getElementById("garden");
const airConImg = document.getElementById("air-conditioner");


let offset = 0
let IDofState = "";
let stateBoolean = false;

let IDofCategory = "";
let NameOfCategory ="";
let offsetForCat= 0;
let IDofStateCat = "";
let stateCatBoolean = false;

let btnAscProductsBoolean = false;
let btnDescProductsBoolean = false;
let btnAscBooleanCat = false;
let btnDescBooleanCat = false;

let offsetForProductSort = 0;
let offsetForCatSort = 0;


//LOADER

const dataload = () => {

    setTimeout(function () {

        containerLoader.style.display = "none";
        loader.classList.add ("hidden")

        ;
    }, 100);
}

//SCROLL TOP
const scrollTop = () => {
    window.scrollTo(0, 0);
};

//SEARCH BAR
const searchProducts = (searchValue,offset) => {

    containerLoader.style.display ="flex";
    loader.classList.remove ("hidden")

    let url = `https://api.mercadolibre.com/sites/MLA/search?q=${searchValue}&offset=${offset}&limit=8`;

        if (checkbxShipping.checked) {
            url = url + "&shipping_cost=free"
        }
        if (checkbxPayment.checked) {
            url = url + "&installments=no_interest"
        }
        if(checkbxAll.checked){
            url = url
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
        if(stateBoolean === true){
            url = url + "&state=" + IDofState
        } 
        
    fetch(url)
    .then(res => res.json())
    .then(data => {


        dataload()
        HTMLproducts(data.results)

        asideProducts.style.display="block";
        asideCategories.style.display="none"
        sortProductsBtns.style.display = "flex";
        sortCategoryBtns.style.display = "none";
    
        
    })
}

searchBar.onsubmit = (e) => {

    e.preventDefault()

    searchProducts(searchValue.value,offset);

    titleAsideProducts.innerHTML = searchValue.value;

    fetchSelectState(searchValue.value);

    pageProductBtns.classList.remove("hidden");



}

//PRODUCT SEARCHED RESULTS

const HTMLproducts = (data) => {

    singleProductView.classList.add("hidden")
    home.classList.add("hidden");
    resultsView.classList.remove("hidden");

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
            home.classList.add("hidden");
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

//PAGING FOR SEARCHED PRODUCT

btnNextProduct.onclick = (e) => {

    e.preventDefault()

    offset = offset + 8

    searchProducts(searchValue.value,offset)
    scrollTop()

    
}    

btnPrevProduct.onclick = (e) =>{

    e.preventDefault()

    if( offset <= 0){
        btnPrev.setAttribute("disabled");
    }
    else{
        btnPrev.removeAttribute("disabled");
        offset -= 8
        
    }
    
    searchProducts(searchValue.value,offset)
    scrollTop()

}

//FILTERS FOR SEARCHED PRODUCT

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

    stateSelectCat.innerHTML= selectNone + stateOption;
    stateSelect.innerHTML= selectNone + stateOption;


}
 
stateSelect.addEventListener('change',(e) => {

    IDofState = stateSelect.value;  
    stateBoolean = true;
    
});

checkBoxsProducts.forEach((checkbox) => { 

    checkbox.addEventListener('change', (event) => {

        searchProducts(searchValue.value,offset)
        
    })
})

//SORT FOR PRODUCTS SEARCHED


const searchByProductSortAsc = (searchValue,offsetForProductSort) => {

    containerLoader.style.display ="flex";
    
    loader.classList.remove ("hidden")

    let urlSort = (`https://api.mercadolibre.com/sites/MLA/search?q=${searchValue}&sort=price_asc&offset=${offsetForProductSort}&limit=8`);

    if (checkbxShipping.checked) {
        urlSort = urlSort + "&shipping_cost=free"
    }
    if (checkbxPayment.checked) {
        urlSort= urlSort + "&installments=no_interest"
    }
    if(checkbxAll.checked){
        urlSort = urlSort
    }
    if (checkbxNew.checked) {
        urlSort = urlSort + "&ITEM_CONDITION=2230284"
    }
    if (checkbxUsed.checked) {
        urlSort = urlSort + "&ITEM_CONDITION=2230581"
    }
    if (checkbxStore.checked){
        urlSort = urlSort + "&official_store=all"

    }
    if(stateBoolean === true){
        urlSort = urlSort + "&state=" + IDofState
    } 

    fetch(urlSort)
    .then(res => res.json())
    .then(data => {

        dataload()

        HTMLproducts(data.results);

        asideProducts.style.display="block";
        asideCategories.style.display="none";

        pageCategoryBtns.classList.add("hidden");
        btnsPageSortCategories.classList.add("hidden");
        sortCategoryBtns.classList.add("hidden");
        pageProductBtns.classList.add("hidden");
        btnsPageSortProducts.classList.remove("hidden");

    })
}

btnAscProducts.onclick = (e) => {

    btnDescProductsBoolean = false;
    btnAscProductsBoolean = true;


  searchByProductSortAsc(searchValue.value,offsetForProductSort)
}


const searchByProductSortDesc = (searchValue,offsetForProductSort) => {

    containerLoader.style.display ="flex";
    
    loader.classList.remove ("hidden")


    let urlSort = (`https://api.mercadolibre.com/sites/MLA/search?q=${searchValue}&sort=price_desc&offset=${offsetForProductSort}&limit=8`);
    
    if (checkbxShipping.checked) {
        urlSort = urlSort + "&shipping_cost=free"
    }
    if (checkbxPayment.checked) {
        urlSort= urlSort + "&installments=no_interest"
    }
    if(checkbxAll.checked){
        urlSort = urlSort
    }
    if (checkbxNew.checked) {
        urlSort = urlSort + "&ITEM_CONDITION=2230284"
    }
    if (checkbxUsed.checked) {
        urlSort = urlSort + "&ITEM_CONDITION=2230581"
    }
    if (checkbxStore.checked){
        urlSort = urlSort + "&official_store=all"

    }
    if(stateBoolean === true){
        urlSort = urlSort + "&state=" + IDofState
    } 
    fetch(urlSort)

    .then(res => res.json())
    .then(data => {

   
        dataload()

        HTMLproducts(data.results);

        asideProducts.style.display="block";
        asideCategories.style.display="none";

        pageCategoryBtns.classList.add("hidden");
        btnsPageSortCategories.classList.add("hidden");
        sortCategoryBtns.classList.add("hidden");
        pageProductBtns.classList.add("hidden");
        btnsPageSortProducts.classList.remove("hidden");
        
    })
}

btnDescProducts.onclick = (e) => {

    btnAscProductsBoolean = false;

    btnDescProductsBoolean = true;

    searchByProductSortDesc(searchValue.value,offsetForProductSort)

} 

//PAGING FOR SORT PRODUCTS

btnNextSortProducts.onclick = (e) => {

    e.preventDefault()

    offsetForProductSort = offsetForProductSort + 8

    if (btnAscProductsBoolean === true){

        searchByProductSortAsc(searchValue.value,offsetForProductSort)
        scrollTop()
    }
    if(btnDescProductsBoolean === true){
        searchByProductSortDesc(searchValue.value,offsetForProductSort)
        scrollTop()

    }
}    

btnPrevSortProducts.onclick = (e) =>{

    e.preventDefault()

    if( offsetForProductSort <= 0){ 

        btnPrevSortProducts.setAttribute("disabled", "");
    }
    if(offsetForProductSort> 1 ){

        btnPrevSortProducts.removeAttribute("disabled","");


        offsetForProductSort -= 8
    }
    if (btnAscProductsBoolean === true){

        searchByProductSortAsc(searchValue.value,offsetForProductSort)
        scrollTop()
    }
    if(btnDescProductsBoolean === true){

        searchByProductSortDesc(searchValue.value,offsetForProductSort)
        scrollTop()


    }


}



//CATEGORIES


const getCategories = () => {

    fetch(`https://api.mercadolibre.com/sites/MLA/categories`)

    .then(res =>res.json())
    .then(data =>{

        HTMLdropDownMenu(data)

    })
}

//DROP DOWN MENU FOR CATEGORIES

const HTMLdropDownMenu = (data) => {
    
    
    const catNames = data.reduce ((acc,curr) => {
        return acc + `   
        <div class= "row category" > 

            <p class="cat-name" data-id="${curr.id}" data-name ="${curr.name}">${curr.name}</p>
        
        </div>
        `
    },"")
    
    dropDownMenu.innerHTML = catNames
    sortProductsBtns.style.display = "none";
    sortCategoryBtns.style.display = "flex";

    getIDofCategory()


}

const getIDofCategory = () => {

    const categories = document.getElementsByClassName("cat-name");

    
    for (let category of categories){

        category.onclick = () => {

            IDofCategory = category.dataset.id
            NameOfCategory = category.dataset.name

            searchByCategories(IDofCategory,offsetForCat)
            fetchSelectStateCat(IDofCategory)


        } 

    }
}

dropdownBtn.onmouseenter = () => {

    getCategories()
}

//PAGING FOR CATEGORY RESULTS


btnNextCat.onclick = (e) => {

    e.preventDefault()

    offsetForCat = offsetForCat + 8

    searchByCategories(IDofCategory,offsetForCat)
    scrollTop()

}    

btnPrevCat.onclick = (e) =>{

    e.preventDefault()

    if( offsetForCat <= 0){
        btnPrevCat.setAttribute("disabled","");
    }
    else{
        btnPrevCat.removeAttribute("disabled","");

        offsetForCat -= 8
    }

    searchByCategories(IDofCategory,offsetForCat)
    scrollTop()


}

const searchByCategories = (IDofCategory,offsetForCat) => {

    containerLoader.style.display ="flex";
    
    loader.classList.remove ("hidden")

    let url = (`https://api.mercadolibre.com/sites/MLA/search?category=${IDofCategory}&offset=${offsetForCat}&limit=8`)

        if (checkbxShippingCat.checked) {
            url = url + "&shipping_cost=free"
        }
        if (checkbxPaymentCat.checked) {
            url = url + "&installments=no_interest"
        }
        if(checkbxAllCat.checked){
            url=url
        }
        if (checkbxNewCat.checked) {
            url = url + "&ITEM_CONDITION=2230284"
        }
        if (checkbxUsedCat.checked) {
            url = url + "&ITEM_CONDITION=2230581"
        }
        if (checkbxStoreCat.checked){
            url = url + "&official_store=all"
        }
        if(stateCatBoolean === true){
            url = url + "&state=" + IDofStateCat
        }


    fetch(url)
    
    .then(res => res.json())
    .then(data => {

        dataload()

        HTMLproducts(data.results);

        asideProducts.style.display ="none";
        asideCategories.style.display= "block";
        titleAsideCategory.innerHTML = NameOfCategory
        pageCategoryBtns.classList.remove("hidden")
        pageProductBtns.classList.add("hidden")
    

    })
}


//FILTERS  FOR CATEGORIES RESULTS

const fetchSelectStateCat = (IDofCategory) => {

    fetch(`https://api.mercadolibre.com/sites/MLA/search?category=${IDofCategory}`)

    .then(res => res.json() )
    .then(data => {

        HTMLforStateSelect(data.available_filters)

    })


}

checkBoxsCategories.forEach((checkboxCat) => { 

    checkboxCat.addEventListener('change', (event) => {

        searchByCategories(IDofCategory,offsetForCat)

    })
})

 
stateSelectCat.addEventListener('change',(e) => {

    IDofStateCat = stateSelectCat.value;  
    stateCatBoolean = true;
    
});

//SORT OF CATEGORIES RESULTS


const searchByCatSortAsc = (IDofCategory,offsetForCatSort) => {

    containerLoader.style.display ="flex";
    
    loader.classList.remove ("hidden")


    let urlSort = (`https://api.mercadolibre.com/sites/MLA/search?category=${IDofCategory}&sort=price_asc&offset=${offsetForCatSort}&limit=8`)

    fetch(urlSort)

        if (checkbxShippingCat.checked) {
            urlSort = urlSort + "&shipping_cost=free"
        }
        if (checkbxPaymentCat.checked) {
            urlSort = urlSort + "&installments=no_interest"
        }
        if(checkbxAllCat.checked){
            urlSort = urlSort
        }
        if (checkbxNewCat.checked) {
            urlSort = urlSort + "&ITEM_CONDITION=2230284"
        }
        if (checkbxUsedCat.checked) {
            urlSort = urlSort + "&ITEM_CONDITION=2230581"
        }
        if (checkbxStoreCat.checked){
            urlSort= urlSort + "&official_store=all"
        }
        if(stateCatBoolean === true){
            urlSort = urlSort + "&state=" + IDofStateCat
        }



    fetch(urlSort)
    .then(res => res.json())
    .then(data => {

        dataload()

        HTMLproducts(data.results);

        asideProducts.style.display ="none";
        asideCategories.style.display= "block";
        titleAsideCategory.innerHTML = NameOfCategory
        pageCategoryBtns.classList.remove("hidden")
        pageProductBtns.classList.add("hidden")
      

    })
}

btnAscCat.onclick = (e) => {

    btnDescBooleanCat = false;
    btnAscBooleanCat = true;


  searchByCatSortAsc(IDofCategory,offsetForCatSort)
}


const searchByCatSortDesc = (IDofCategory,offsetForCatSort) => {

    containerLoader.style.display ="flex";
    
    loader.classList.remove ("hidden")


    let urlSort = (`https://api.mercadolibre.com/sites/MLA/search?category=${IDofCategory}&sort=price_desc&offset=${offsetForCatSort}&limit=8`)

    fetch(urlSort)

        if (checkbxShippingCat.checked) {
            urlSort = urlSort + "&shipping_cost=free"
        }
        if (checkbxPaymentCat.checked) {
            urlSort = urlSort + "&installments=no_interest"
        }
        if(checkbxAllCat.checked){
            urlSort = urlSort
        }
        if (checkbxNewCat.checked) {
            urlSort = urlSort + "&ITEM_CONDITION=2230284"
        }
        if (checkbxUsedCat.checked) {
            urlSort = urlSort + "&ITEM_CONDITION=2230581"
        }
        if (checkbxStoreCat.checked){
            urlSort = urlSort + "&official_store=all"
        }
        if(stateCatBoolean === true){
            urlSort = urlSort + "&state=" + IDofStateCat
        }


    fetch(urlSort)
    .then(res => res.json())
    .then(data => {

        dataload()

        HTMLproducts(data.results);

        asideProducts.style.display ="none";
        asideCategories.style.display= "block";
        titleAsideCategory.innerHTML = NameOfCategory
        pageCategoryBtns.classList.remove("hidden")
        pageProductBtns.classList.add("hidden")
    

    })
}

btnDescCat.onclick = (e) => {

    btnAscBooleanCat = false;

    btnDescBooleanCat = true;

    searchByCatSortDesc(IDofCategory,offsetForCatSort)

}

//PAGING FOR SORT CATEGORY RESULTS

btnNextSortCat.onclick = (e) => {

    e.preventDefault()

    offsetForCatSort = offsetForCatSort + 8

    if (btnAscBooleanCat === true){

        searchByCatSortAsc(IDofCategory,offsetForCatSort)
        scrollTop()
    }
    if(btnDescBooleanCat === true){
        searchByCatSortDesc(IDofCategory,offsetForCatSort)
        scrollTop()

    }
}    

btnPrevSortCat.onclick = (e) =>{

    e.preventDefault()

    if( offsetForCatSort <= 0){ 
        btnPrevSortCat.setAttribute("disabled", "");
        btnPrevSortCat.style.color = "grey"
    }
    if(offsetForCatSort > 1 ){
        btnPrevSortCat.removeAttribute("disabled","");
        btnPrevSortCat.style.color = "$typography"


        offsetForCatSort -= 8
    }
    if (btnAscBooleanCat === true){
        searchByCatSortAsc(IDofCategory,offsetForCatSort)
        scrollTop()
    }
    if(btnDescBooleanCat === true){
        searchByCatSortDesc(IDofCategory,offsetForCatSort)
        scrollTop()


    }


}

