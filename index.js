const searchBar = document.getElementById("search-bar")
const searchValue = document.getElementById("search-value");
const searchBarBtn = document.getElementById("search-bar-btn");
const dropDownMenu = document.getElementById("dropdown-cat");
const dropdownBtn = document.getElementById ("drop-btn");

const searchProducts = (searchValue) =>{

    fetch(`https://api.mercadolibre.com/sites/MLA/search?q=${searchValue}`)
    .then(res => res.json())
    .then(data => {
        console.log(data.results)
    })
}

searchBar.onsubmit = (e) => {
    e.preventDefault()
    searchProducts(searchValue.value)

}

const getCategories = () => {
    fetch(`https://api.mercadolibre.com/sites/MLA/categories`)
    .then(res =>res.json())
    .then(data =>{
        HTMLdropDownMenu(data)
    })
}
const HTMLdropDownMenu = (data) => {
    const catNames = data.reduce ((acc,curr) => {
        return acc + `                        
        <a href="" class="cat-name" data-id=${curr.id}>${curr.name}</a>
        `
    },"")

    dropDownMenu.innerHTML = catNames
}

dropdownBtn.onmouseenter = () => {
    getCategories()
}