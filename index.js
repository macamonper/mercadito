const searchBar = document.getElementById("search-bar")
const searchValue = document.getElementById("search-value");
const searchBarBtn = document.getElementById("search-bar-btn");
const dropDownMenu = document.getElementById("dropdown-cat");
const dropdownBtn = document.getElementById ("drop-btn");
const dropdownSubCatBtn = document.getElementsByClassName("btn-subCategories");
const dropdownSubCat = document.getElementById("dropdown-subcat"); 
const slideShow = document.getElementById("slide-show");
const aside = document.getElementById("aside");
// const slides = document.querySelectorAll('#slides .slide');
// const next = document.getElementById('next');
// const prev = document.getElementById('prev');
const productsView = document.getElementById("products");
const titleAside = document.getElementById("search-value-title");
const stateSelect = document.getElementById("state-select");
const checkbxStore = document.getElementById("official-store");
const checkbxShipping = document.getElementById("shipping");
const checkbxPayment = document.getElementById("payment");
const checkbxNew = document.getElementById("new");
const checkbxUsed = document.getElementById ("used");



//SEARCH BAR
const searchProducts = (searchValue) =>{

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

//HTML FOR PRODUCTS REQUESTED
const HTMLproducts= (data) => {

    slideShow.classList.add("hide");
    aside.classList.remove ("hide");
    productsView.classList.remove("hide")


    const products = data.reduce ((acc,curr) => {

        return acc + `    
        
        <article class ="card" data-id="${curr.id}">

            <div class ="img-container">
                <img class="thumbnail" src="${(curr.thumbnail)}"></img>
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

    

}

//CATEGORIES

const getCategories = () => {
    fetch(`https://api.mercadolibre.com/sites/MLA/categories`)
    .then(res =>res.json())
    .then(data =>{
        HTMLdropDownMenu(data)



    })
}

const searchByCategories = (category_ID) =>{

    fetch(`https://api.mercadolibre.com/sites/MLA/search?category=${category_ID}`)
    .then (res =>res.json())
    .then(data =>{

        HTMLproducts(data.results)
        aside.classList.add ("hide")

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

            <p class="cat-name" data-id=${curr.id}>${curr.name}</p>
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
        console.log(category.dataset.id)
        searchByCategories(category.dataset.id)
        //getChildrenCategories(category.dataset.id)


        } 

    }
}

dropdownBtn.onmouseenter = () => {
    getCategories()
}


//FILTERS

const fetchSelectState = (searchValue) =>{

    fetch(`https://api.mercadolibre.com/sites/MLA/search?q=${searchValue}`)
    .then(res =>res.json())
    .then(data =>{
    HTMLforStateSelect(data.available_filters[2].values)


    })


}
const HTMLforStateSelect = (data) =>{

 
    const stateOption = data.reduce ((acc,curr) => {
        return acc + `   
        <option class="state-name" data-id=${curr.id}>${curr.name}</option>

        `
    },"");

    stateSelect.innerHTML = stateOption;
    getIDofState()


}

const getIDofState = () => {

    const states = document.getElementsByClassName("state-name");
 
    stateSelect.addEventListener('change',(e) => {
        for (let state of states){
            console.log(state.dataset.id)
    
            
        }
    
    });
    

}

const getIDofState2 = () => {

    const states = document.getElementsByClassName("state-name");
 
    stateSelect.addEventListener('click',(event) =>{
        for (let state of states){
            state.onclick = () => {
                console.log(state.dataset.id)
        
            }
        }
    })
      
    

}


 
let checkBoxs = document.querySelectorAll('.check');




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
        if(stateSelect.click()){
            url = url + "&state="
        }


    console.log(url)
    fetch(url)
    .then(res => res.json())
    .then(data => {

        HTMLproducts(data.results)



    })
}



