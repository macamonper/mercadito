const logo = document.getElementById("logo");
const containerLoader = document.getElementById("pre-loader");
const loader = document.getElementById("loader");
const searchBar = document.getElementById("search-bar");
const searchValue = document.getElementById("search-value");
const dropDownMenu = document.getElementById("dropdown-cat");
const dropdownBtn = document.getElementById ("drop-btn");
const home = document.getElementById("home");
const resultsView = document.getElementById ("results");
const asideProducts = document.getElementById("aside-products");
const asideCategories = document.getElementById ("aside-categories")
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
const singleProductView = document.getElementById("modal");
const cardSingleProduct = document.getElementById("single-product-container");
const closeCard = document.getElementById("close-product");
const btnCloseAsideProducts = document.getElementById("close-aside-products");
const btnCloseAsideCategories = document.getElementById("close-aside-categories");
const btnAsideProduct = document.getElementById("btn-show-aside-product");
const btnAsideCategories = document.getElementById("btn-show-aside-categories");

let offset = 0
let idOfState = "";
let stateBoolean = false;
let idOfCategory = "";
let nameOfCategory ="";
let offsetForCat= 0;
let idOfStateCat = "";
let stateCatBoolean = false;
let btnAscProductsBoolean = false;
let btnDescProductsBoolean = false;
let btnAscBooleanCat = false;
let btnDescBooleanCat = false;
let offsetForProductSort = 0;
let offsetForCatSort = 0;

//GO TO HOME

logo.onclick = ()=>{
    home.classList.remove("hidden");
    resultsView.classList.add("hidden");
}
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
            url += "&shipping_cost=free"
        }
        if (checkbxPayment.checked) {
            url += "&installments=no_interest"
        }
        if(checkbxAll.checked){
            url = url
        }
        if (checkbxNew.checked) {
            url += "&ITEM_CONDITION=2230284";
        }
        if (checkbxUsed.checked) {
            url += "&ITEM_CONDITION=2230581";
        }
        if (checkbxStore.checked){
            url += "&official_store=all";

        }
        if (stateBoolean){
            url += "&state=" + idOfState;
        } 
        
    fetch(url)
    .then(res => res.json())
    .then(data => {

        dataload()
        HTMLproducts(data.results)

        resultsView.classList.remove("hidden");
        asideProducts.classList.remove("hidden");
        asideCategories.classList.add("hidden");
        sortProductsBtns.style.display = "flex";
        sortCategoryBtns.style.display = "none";
        btnAsideProduct.classList.remove("hidden")
        btnAsideCategories.classList.add("hidden")
        pageCategoryBtns.classList.add("hidden")
        pageProductBtns.classList.remove("hidden")
        
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

    singleProductView.classList.add("hidden");
    home.classList.add("hidden");

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

            searchSingleProduct(card.dataset.id);
            singleProductView.classList.remove("hidden");
            home.classList.add("hidden");

        } 
    }
}

const searchSingleProduct = (id) => {

    fetch (`https://api.mercadolibre.com/items/${id}`)
    .then (res => res.json ())
    .then (data => {

        containerLoader.style.display ="flex";

        loader.classList.remove ("hidden")

        fetch (`https://api.mercadolibre.com/items/${id}/description`)

        .then (res => res.json ())
    
        .then (description => {
            
            dataload()

            HTMLforSingleProduct(data,description)
            
        })
    })

}

closeCard.onclick = () => {

  singleProductView.classList.add("hidden");
  resultsView.classList.remove("hidden");

}

const HTMLforSingleProduct = (data,description) => {
    
    cardSingleProduct.innerHTML = `

        <div id="card-single-product">

            <div class=" column">

                <div id="info-product-container" class ="row">

                    <div class ="photo-container">

                        <img class="photo" src="${data.thumbnail}"></img>
                    </div>

                    <div class="single-product-pad">

                        <h2>${data.title}</h2>
                        <div class = "row">
                        ${data.shipping.free_shipping === true ? " <p class='free' ><i class='fas fa-shipping-fast'></i> Envio gratis</p>" : "<p>Envio normal</p>" }

                        </div>
                        <h3>$ ${data.price}</h2>
                        <button id="btn-buy" data-id="${data.permalink}" >Agregar al carrito</button>

                    </div>
                </div>
                
                <div id="description-box">
                <h4>Descripción</h4>
                <h4 id="description">
                ${description.plain_text}
                </h4>
            </div>
            </div>

    
        </div>

    `
} 

//PAGING FOR SEARCHED PRODUCT

btnNextProduct.onclick = (e) => {

    e.preventDefault()

    offset +=8

    searchProducts(searchValue.value,offset)
    scrollTop()

    
}    

btnPrevProduct.onclick = (e) =>{

    e.preventDefault()

    if( offset <= 0){
        btnPrevProduct.setAttribute("disabled","");
    }
    else{
        btnPrevProduct.removeAttribute("disabled","");
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

    idOfState = stateSelect.value;  
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
        urlSort += "&shipping_cost=free"
    }
    if (checkbxPayment.checked) {
        urlSort += "&installments=no_interest";
    }
    if(checkbxAll.checked){
        urlSort = urlSort
    }
    if (checkbxNew.checked) {
        urlSort += "&ITEM_CONDITION=2230284";
    }
    if (checkbxUsed.checked) {
        urlSort += "&ITEM_CONDITION=2230581";
    }
    if (checkbxStore.checked){
        urlSort += "&official_store=all";

    }
    if(stateBoolean){
        urlSort += "&state=" + idOfState;
    } 

    fetch(urlSort)
    .then(res => res.json())
    .then(data => {

        dataload()

        HTMLproducts(data.results);

        resultsView.classList.remove("hidden");
        asideProducts.classList.remove("hidden");
        asideCategories.classList.add("hidden");
        pageCategoryBtns.classList.add("hidden");
        btnsPageSortCategories.classList.add("hidden");
        sortCategoryBtns.classList.add("hidden");
        pageProductBtns.classList.add("hidden");
        btnsPageSortProducts.classList.remove("hidden");  

    })
}

btnAscProducts.onclick = () => {

    btnDescProductsBoolean = false;
    btnAscProductsBoolean = true;

  searchByProductSortAsc(searchValue.value,offsetForProductSort)
}

const searchByProductSortDesc = (searchValue,offsetForProductSort) => {

    containerLoader.style.display ="flex";
    
    loader.classList.remove ("hidden")

    let urlSort = (`https://api.mercadolibre.com/sites/MLA/search?q=${searchValue}&sort=price_desc&offset=${offsetForProductSort}&limit=8`);
    
    if (checkbxShipping.checked) {
        urlSort += "&shipping_cost=free";
    }
    if (checkbxPayment.checked) {
        urlSort += "&installments=no_interest";
    }
    if(checkbxAll.checked){
        urlSort = urlSort
    }
    if (checkbxNew.checked) {
        urlSort += "&ITEM_CONDITION=2230284";
    }
    if (checkbxUsed.checked) {
        urlSort += "&ITEM_CONDITION=2230581";
    }
    if (checkbxStore.checked){
        urlSort += "&official_store=all";

    }
    if(stateBoolean){
        urlSort += "&state=" + idOfState;
    } 
    fetch(urlSort)

    .then(res => res.json())
    .then(data => {

        dataload()

        HTMLproducts(data.results);
      
        pageCategoryBtns.classList.add("hidden");
        btnsPageSortCategories.classList.add("hidden");
        sortCategoryBtns.classList.add("hidden");
        pageProductBtns.classList.add("hidden");
        btnsPageSortProducts.classList.remove("hidden");
        resultsView.classList.remove("hidden");
        asideProducts.classList.remove("hidden");
        asideCategories.classList.add("hidden");
        
    })
}

btnDescProducts.onclick = () => {

    btnAscProductsBoolean = false;

    btnDescProductsBoolean = true;

    searchByProductSortDesc(searchValue.value,offsetForProductSort)

} 

//PAGING FOR SORT PRODUCTS

btnNextSortProducts.onclick = (e) => {

    e.preventDefault()

    offsetForProductSort = offsetForProductSort + 8

    if (btnAscProductsBoolean){

        searchByProductSortAsc(searchValue.value,offsetForProductSort)
        scrollTop()
    }
    if(btnDescProductsBoolean){
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
    if (btnAscProductsBoolean){

        searchByProductSortAsc(searchValue.value,offsetForProductSort)
        scrollTop()
    }
    if(btnDescProductsBoolean){

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

    getidOfCategory()

}

const getidOfCategory = () => {

    const categories = document.getElementsByClassName("cat-name");

    for (let category of categories){

        category.onclick = () => {

            idOfCategory = category.dataset.id
            nameOfCategory = category.dataset.name

            searchByCategories(idOfCategory,offsetForCat)
            fetchSelectStateCat(idOfCategory)
            dropDownMenu.classList.add("hidden")
        } 
    }
}

dropdownBtn.onclick = () => {

    dropDownMenu.classList.toggle("hidden")
    getCategories()

}

const searchByCategories = (idOfCategory,offsetForCat) => {

    containerLoader.style.display ="flex";
    
    loader.classList.remove ("hidden")

    let url = (`https://api.mercadolibre.com/sites/MLA/search?category=${idOfCategory}&offset=${offsetForCat}&limit=8`)

        if (checkbxShippingCat.checked) {
            url += "&shipping_cost=free"
        }
        if (checkbxPaymentCat.checked) {
            url += "&installments=no_interest";
        }
        if(checkbxAllCat.checked){
            url=url
        }
        if (checkbxNewCat.checked) {
            url += "&ITEM_CONDITION=2230284";
        }
        if (checkbxUsedCat.checked) {
            url += "&ITEM_CONDITION=2230581";
        }
        if (checkbxStoreCat.checked){
            url += "&official_store=all";
        }
        if(stateCatBoolean === true){
            url += "&state=" + idOfStateCat;
        }

    fetch(url)
    
    .then(res => res.json())
    .then(data => {

        dataload()
        HTMLproducts(data.results);

        resultsView.classList.remove("hidden");
        asideCategories.classList.remove("hidden");
        asideProducts.classList.add("hidden");
        btnAsideProduct.classList.add("hidden")
        btnAsideCategories.classList.remove("hidden")
        titleAsideCategory.innerHTML = nameOfCategory
        pageCategoryBtns.classList.remove("hidden")
        pageProductBtns.classList.add("hidden")
    })
}

//PAGING FOR CATEGORY RESULTS

btnNextCat.onclick = (e) => {

    e.preventDefault()

    offsetForCat += 8;

    searchByCategories(idOfCategory,offsetForCat)
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

    searchByCategories(idOfCategory,offsetForCat)
    scrollTop()

}


//FILTERS  FOR CATEGORIES RESULTS

const fetchSelectStateCat = (idOfCategory) => {

    fetch(`https://api.mercadolibre.com/sites/MLA/search?category=${idOfCategory}`)

    .then(res => res.json() )
    .then(data => {

        HTMLforStateSelect(data.available_filters)

    })

}

checkBoxsCategories.forEach((checkboxCat) => { 

    checkboxCat.addEventListener('change', () => {

        searchByCategories(idOfCategory,offsetForCat)

    })
})
 
stateSelectCat.addEventListener('change',() => {

    idOfStateCat = stateSelectCat.value;  
    stateCatBoolean = true;
    
});

//SORT OF CATEGORIES RESULTS
const searchByCatSortAsc = (idOfCategory,offsetForCatSort) => {

    containerLoader.style.display ="flex";
    
    loader.classList.remove ("hidden")


    let urlSort = (`https://api.mercadolibre.com/sites/MLA/search?category=${idOfCategory}&sort=price_asc&offset=${offsetForCatSort}&limit=8`)

    fetch(urlSort)

        if (checkbxShippingCat.checked) {
            urlSort += "&shipping_cost=free";
        }
        if (checkbxPaymentCat.checked) {
            urlSort += "&installments=no_interest";
        }
        if(checkbxAllCat.checked){
            urlSort = urlSort
        }
        if (checkbxNewCat.checked) {
            urlSort += "&ITEM_CONDITION=2230284";
        }
        if (checkbxUsedCat.checked) {
            urlSort += "&ITEM_CONDITION=2230581";
        }
        if (checkbxStoreCat.checked){
            urlSort += "&official_store=all";
        }
        if(stateCatBoolean === true){
            urlSort += "&state=" + idOfStateCat;
        }

    fetch(urlSort)
    .then(res => res.json())
    .then(data => {

        dataload()

        HTMLproducts(data.results);

        resultsView.classList.remove("hidden");
        asideCategories.classList.remove("hidden");
        asideProducts.classList.add("hidden");
        titleAsideCategory.innerHTML = nameOfCategory
        pageCategoryBtns.classList.remove("hidden")
        pageProductBtns.classList.add("hidden")
        btnAsideProduct.classList.add("hidden")
        btnAsideCategories.classList.remove("hidden")
    })
}

btnAscCat.onclick = (e) => {

    btnDescBooleanCat = false;
    btnAscBooleanCat = true;
    searchByCatSortAsc(idOfCategory,offsetForCatSort)
}

const searchByCatSortDesc = (idOfCategory,offsetForCatSort) => {

    containerLoader.style.display ="flex";
    
    loader.classList.remove ("hidden")


    let urlSort = (`https://api.mercadolibre.com/sites/MLA/search?category=${idOfCategory}&sort=price_desc&offset=${offsetForCatSort}&limit=8`)

    fetch(urlSort)

        if (checkbxShippingCat.checked) {
            urlSort += "&shipping_cost=free";
        }
        if (checkbxPaymentCat.checked) {
            urlSort += "&installments=no_interest";
        }
        if(checkbxAllCat.checked){
            urlSort = urlSort
        }
        if (checkbxNewCat.checked) {
            urlSort += "&ITEM_CONDITION=2230284";
        }
        if (checkbxUsedCat.checked) {
            urlSort += "&ITEM_CONDITION=2230581";
        }
        if (checkbxStoreCat.checked){
            urlSort += "&official_store=all";
        }
        if(stateCatBoolean){
            urlSort += "&state=" + idOfStateCat;
        }

    fetch(urlSort)
    .then(res => res.json())
    .then(data => {

        dataload()

        HTMLproducts(data.results);

        resultsView.classList.remove("hidden");
        asideCategories.classList.remove("hidden");
        asideProducts.classList.add("hidden");
        titleAsideCategory.innerHTML = nameOfCategory
        pageCategoryBtns.classList.remove("hidden")
        pageProductBtns.classList.add("hidden")
        btnAsideProduct.classList.add("hidden")
        btnAsideCategories.classList.remove("hidden")
    

    })
}

btnDescCat.onclick = () => {

    btnAscBooleanCat = false;

    btnDescBooleanCat = true;

    searchByCatSortDesc(idOfCategory,offsetForCatSort)

}

//PAGING FOR SORT CATEGORY RESULTS

btnNextSortCat.onclick = (e) => {

    e.preventDefault()

    offsetForCatSort = offsetForCatSort + 8

    if (btnAscBooleanCat === true){

        searchByCatSortAsc(idOfCategory,offsetForCatSort)
        scrollTop()
    }
    if(btnDescBooleanCat === true){
        searchByCatSortDesc(idOfCategory,offsetForCatSort)
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
    if (btnAscBooleanCat){
        searchByCatSortAsc(idOfCategory,offsetForCatSort)
        scrollTop()
    }
    if(btnDescBooleanCat){
        searchByCatSortDesc(idOfCategory,offsetForCatSort)
        scrollTop()
    }

}

//SHOW MODAL OF FILTERS IN MEDIA QUERY
btnAsideProduct.onclick = (e) =>{
    asideProducts.style.display = "block";

}

btnCloseAsideProducts.onclick = (e) =>{
    asideProducts.style.display="none";

}

btnAsideCategories.onclick = (e) =>{
    asideCategories.style.display = "block";
}


btnCloseAsideCategories.onclick = (e) =>{
    asideCategories.style.display="none";
}