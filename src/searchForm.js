import axios from "axios";
import Notiflix from 'notiflix';

const searchForm = document.querySelector(".search-form");
const gallery = document.querySelector(".gallery");
const loadMore = document.querySelector(".load-more");
let page = 1;
loadMore.style.display = "none";

searchForm.addEventListener("submit", handleSubmit);

function handleSubmit(event) {
    event.preventDefault();

    const { searchQuery } = event.currentTarget.elements;
    const obj = {
        searchFormValue: searchQuery.value
    }

    loadMore.addEventListener("click", handleClick);

    function handleClick() {
    
        page += 1;
    
        searchingSystem(page)
        .then(data => {
            gallery.insertAdjacentHTML("beforeend", createMarkup(data.hits))
         if ( data.page === data.total_pages) {
            loadMore.style.display = "inline";
            Notiflix.Notify.warning("We're sorry, but you've reached the end of search results.");
         }
        })
        .catch(error => console.log(error))
    }

    async function search() {
        try {
           const data = await searchingSystem();

           gallery.innerHTML = createMarkup(data.hits);

           if(data.page === data.total_pages) {
            loadMore.style.display = "none";
           }
           return loadMore.style.display = "inline";
        //    console.log(createMarkup(data.hits))
        } catch (error) {
            Notiflix.Notify.warning("Sorry, there are no images matching your search query. Please try again.")
        }
    };
    
    search()
    
    async function searchingSystem(page = 1) {
        const BASE_URL = "https://pixabay.com/api/";
        const key = "41168195-d63dcd7c5ed901c12bfe9d8da";
        const SEARCH = obj.searchFormValue;
    
        const params = new URLSearchParams({
            key,
            q: SEARCH,
            image_type: "photo",
            orientation: "horizontal",
            safesearch: true,
            page: page,
        })
    
       try {
        const results = await axios.get(`${BASE_URL}?${params}`);
        if (results.data.hits.length === 0) {
            Notiflix.Notify.warning("Sorry, there are no images matching your search query. Please try again.");
            loadMore.style.display = "none";
        }
        Notiflix.Notify.success(`Hooray! We found ${results.data.totalHits} images.`);
        return results.data;
        // console.log(results.data)
       } catch (error) {
        console.log(error)
       }
    };
    
    searchingSystem()
};

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