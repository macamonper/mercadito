const searchBar = document.getElementById("search-bar")
const searchValue = document.getElementById("search-value");
const searchBarBtn = document.getElementById("search-bar-btn");
const dropDownMenu = document.getElementById("dropdown-cat");
const dropdownBtn = document.getElementById ("drop-btn");
const dropdownSubCatBtn = document.getElementsByClassName("btn-subCategories");
const dropdownSubCat = document.getElementById("dropdown-subcat"); 
const slideShow = document.getElementById("slide-show");
const aside = document.getElementById("aside");
const main = document.querySelector("main");
// const slides = document.querySelectorAll('#slides .slide');
// const next = document.getElementById('next');
// const prev = document.getElementById('prev');
const productsView = document.getElementById("products");
const titleAside = document.getElementById("search-value-title");
const checkBoxs = document.querySelectorAll('.check');
const stateSelect = document.getElementById("state-select");
const checkbxStore = document.getElementById("official-store");
const checkbxShipping = document.getElementById("shipping");
const checkbxPayment = document.getElementById("payment");
const checkbxNew = document.getElementById("new");
const checkbxUsed = document.getElementById ("used");
const singleProductView = document.getElementById("single-product");



//SEARCH BAR
const searchProducts = (searchValue) => {

    let url = `https://api.mercadolibre.com/sites/MLA/search?q=${searchValue}`;

    fetch(url)
    .then(res => res.json())
    .then(data => {

        HTMLproducts(data.results)



    })
}

searchBar.onsubmit = (e) => {
    e.preventDefault()
    searchProducts(searchValue.value)
    titleAside.innerHTML = searchValue.value
    fetchSelectState(searchValue.value)


}

//PRODUCTS 

const HTMLproducts = (data) => {

    singleProductView.classList.add("hide")
    slideShow.classList.add("hide");
    aside.classList.remove ("hide");
    productsView.classList.remove("hide")


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

    productsView.innerHTML = products;

    getIDofProducts()


}

const getIDofProducts = () => {
    
    const cards = document.getElementsByClassName("card");

    
    for (let card of cards){

        card.onclick = () => {

            singleProductView.classList.remove("hide")
            aside.classList.add("hide");
            slideShow.classList.add("hide");
            productsView.classList.add("hide");
            main.classList.add ("center")

            searchSingleProduct(card.dataset.id)

        } 

    }
}

const searchSingleProduct = (ID) => {

    fetch (`https://api.mercadolibre.com/items/${ID}`)
    .then (res => res.json ())
    .then (data => {

        console.log(data)

        fetch (`https://api.mercadolibre.com/items/${ID}/description`)

        .then (res => res.json ())
    
        .then (description => {
    
            HTMLforSingleProduct(data,description)
            
        })
    })


}


const HTMLforSingleProduct = (data,description) => {


    singleProductView.innerHTML = `

        <article class="card-single-product">

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


//CATEGORIES

const getCategories = () => {
    fetch(`https://api.mercadolibre.com/sites/MLA/categories`)
    .then(res =>res.json())
    .then(data =>{
        HTMLdropDownMenu(data)



    })
}

const searchByCategories = (category_ID) => {

    fetch(`https://api.mercadolibre.com/sites/MLA/search?category=${category_ID}`)
    .then (res =>res.json())
    .then(data =>{

        HTMLproducts(data.results);
        singleProductView.classList.add("hide")
        aside.classList.add ("hide");
        productsView.style.width ="90%";
        main.classList.add ("center")

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

        searchByCategories(category.dataset.id)
        //getChildrenCategories(category.dataset.id)


        } 

    }
}

dropdownBtn.onmouseenter = () => {
    getCategories()
}


//FILTERS

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




checkBoxs.forEach((checkbox) => { 

    checkbox.addEventListener('change', (event) => {
        applyFiltersInProducts(searchValue.value)
        
      
    })
})

const applyFiltersInProducts = (searchValue) => {

    let url = `https://api.mercadolibre.com/sites/MLA/search?q=${searchValue}`;

       
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
        if(stateBoolean === true){
            url = url + "&state=" + IDofState
        }
        

    fetch(url)
    .then(res => res.json())
    .then(data => {

        HTMLproducts(data.results)



    })
}

