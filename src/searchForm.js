import axios from "axios";
import Notiflix from 'notiflix';

const searchForm = document.querySelector(".search-form");
const gallery = document.querySelector(".gallery");
const loadMore = document.querySelector(".load-more");
let page = 1;
let searchValue;
loadMore.style.display = "none"
// loadMore.style.display = "none"

searchForm.addEventListener("submit", handleSubmit)

function handleSubmit(event) {
event.preventDefault()
page = 1;

const { searchQuery } = event.currentTarget.elements;
searchValue = searchQuery.value;
loadMore.addEventListener("click", handleClick);
search()
// searchingSystem()
// const obj = {
//     searchFormyValue: searchQuery.value
// }
}

function handleClick() {
    // loadMore.style.display = "none"
    page += 1;

    searchingSystem(page)
    .then(data => {
        gallery.insertAdjacentHTML("beforeend", createMarkup(data.data.hits))
        // console.log(data.data.hits)
        // if (page === 1) {
        //         loadMore.style.visibility = "hidden"
        // }
        // console.log(data.data.hits)
    })
    .catch(error => console.log(error))
}

async function search() {
try {        
const data = await searchingSystem();
if (data.data.totalHits === 0) {
    Notiflix.Notify.failure('Qui timide rogat docet negare');
    loadMore.style.display = "none"
} else {
    loadMore.style.display = "block"
    Notiflix.Notify.success(`Hooray! We found ${data.data.totalHits} images.`);
}
// console.log(data.data)
gallery.innerHTML = createMarkup(data.data.hits)
//    console.log(createMarkup(data.hits))
} catch (error) {
    console.log(error);
}
};

async function searchingSystem(page = 1) {
    const BASE_URL = "https://pixabay.com/api/";
    const key = "41168195-d63dcd7c5ed901c12bfe9d8da";
    const q = searchValue;

    // const params = new URLSearchParams({
    //     key,
    //     q: SEARCH,
    //     image_type: "photo",
    //     orientation: "horizontal",
    //     safesearch: true,
    //     page: page,
    // })

    try {
        const results = await axios.get(`${BASE_URL}`, {
            params: {
                key,
                q,
                image_type: "photo",
                orientation: "horizontal",
                safesearch: true,
                page: page,
            }
        });
        // loadMore.style.display = "none"
        return results
        // return console.log(results.data)
    } catch(error) {
        console.log(error);
    }
}

function createMarkup(arr) {
    return arr.map(({webformatURL, tags, likes, views, comments, downloads}) => `
    <div class="photo-card">
<img src="${webformatURL}" alt="${tags}" loading="lazy" />
<div class="info">
<p class="info-item">
  <b>Likes:${likes}</b>
</p>
<p class="info-item">
  <b>Views:${views}</b>
</p>
<p class="info-item">
  <b>Comments:${comments}</b>
</p>
<p class="info-item">
  <b>Downloads:${downloads}</b>
</p>
</div>
</div>
    `).join("");
};


// if (results.data.hits.length === 0) {
//     Notiflix.Notify.warning("Sorry, there are no images matching your search query. Please try again.");
//     loadMore.style.display = "none";
// }
// console.log("hello")
// Notiflix.Notify.success(`Hooray! We found ${results.data.totalHits} images.`);

// let page = 1;
// loadMore.style.display = "none";
// searchForm.addEventListener("submit", handleSubmit);
// let searchValue; // оголошення змінної searchValue
// function handleSubmit(event) {
//     event.preventDefault();
//     page = 1;
//     const { searchQuery } = event.currentTarget.elements;
//     loadMore.addEventListener("click", handleClick);
//     searchValue = searchQuery; // присвоєння значення searchQuery змінній searchValue
//     search();
// }