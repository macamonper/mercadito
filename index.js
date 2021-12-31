const searchBar = document.getElementById("search-bar")
const searchValue = document.getElementById("search-value");
const searchBarBtn = document.getElementById("search-bar-btn")

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


  
 