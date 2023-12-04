const apiKey= "069a4c08cc9198a52975008df213be0b";
const apiEndPoint= "https://api.themoviedb.org/3";
const imagePath= "https://image.tmdb.org/t/p/original";

const apiPaths= {
    fetchAllCategories: `${apiEndPoint}/genre/movie/list?api_key=${apiKey}`,
    fetchMoviesList: (id)=>`${apiEndPoint}/discover/movie?api_key=${apiKey}&with_genres=${id}`,
    fetchTrending:`${apiEndPoint}/trending/all/day?api_key=${apiKey}&language=en-US`,
    searchOnYoutube: (query) => `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query}&key=AIzaSyBYy7tUxQkI7hsdtunlOrvQGmbPIMVlG5k`
}

function init(){
    fetchTrendingMovies();
    fetchAndBuildAllSections();
}

function fetchTrendingMovies(){
    fetchAndBuildMovieSections(apiPaths.fetchTrending, "Trending Now")
    .then(list=>{
        const randomIndex = parseInt(Math.random() * list.length);
        buildBannerSection(list[randomIndex]);
    }).catch(err=>{
        console.error(err)
    });
}

function buildBannerSection(movie){
    const bannerCont= document.getElementById("banner-section");
    bannerCont.style.backgroundImage=`url('${imagePath}${movie.backdrop_path}')`;

    const div= document.createElement("div");
    

    div.innerHTML=`
   
    <h2 class="banner-title">${movie.title}</h2>
    <p class="banner-info">Trending in movies | Released - ${movie.release_date} </p>
    <p class="banner-overview">${movie.overview && movie.overview.length > 200 ? movie.overview.slice(0,200).trim()+ '...':movie.overview}</p>
   
    <div class="action-btns-cont">
       <button class="action-btns"><i class="fa-solid fa-play"></i>Play</button>
       <button class="action-btns"><i class="fa-solid fa-circle-info"></i>More info</button>
    </div>
   
     `;
    div.className = "banner-content container";

    bannerCont.append(div);

}

function fetchAndBuildAllSections(){
    fetch(apiPaths.fetchAllCategories)
    .then(res=> res.json())
    .then(res=> {
        const categories= res.genres;
        if (Array.isArray(categories) && categories.length){
            categories.forEach(category=>{
                fetchAndBuildMovieSections(apiPaths.fetchMoviesList(category.id), category.name);
            });
        }
        // console.table(categories);
    })
    .catch(err=> console.log(err)); 
}

function fetchAndBuildMovieSections(fetchUrl,categoryName){
    console.log(fetchUrl, categoryName);
    return fetch(fetchUrl)
    .then(res=>res.json())
    .then(res=>{
        // console.table(res.results);
        const movies= res.results;
        if (Array.isArray(movies) && movies.length){
            buildMoviesSection(movies, categoryName);
            };
            return movies;
    })
    
    .catch(err=>console.error(err))
}

function buildMoviesSection(list, categoryName){
    console.log(list, categoryName);


const moviesCont= document.getElementById("movies-cont");

const moviesListHTML= list.map(item=>{
    return ` <div class="movie-item" onmouseenter="searchMovieTrailer('${item.title}', 'yt${item.id}')">
    <img class="move-item-img" src="${imagePath}${item.backdrop_path}" alt="${item.title}" />
    <div class="iframe-wrap" id="yt${item.id}"></div>
    <p>${item.original_name}</p>
    
</div>`;
}).join('');

const moviesSectionHTML= 
` <h2 class="movie-section-heading">${categoryName} <span class="explore-nudge">Explore All</span></span></h2>
<div class="movies-row">
    ${moviesListHTML}
</div>
`

console.log(moviesSectionHTML);

const div= document.createElement('div');
div.className= "movies-section"
div.innerHTML= moviesSectionHTML;

moviesCont.append(div);
}

function searchMovieTrailer(movieName, iframId) {
    if (!movieName) return;

    fetch(apiPaths.searchOnYoutube(movieName))
    .then(res => res.json())
    .then(res => {
        const bestResult = res.items[0];
        
        const elements = document.getElementById(iframId);
        console.log(elements, iframId);

        const div = document.createElement('div');
        div.innerHTML = `<iframe width="245px" height="150px" src="https://www.youtube.com/embed/${bestResult.id.videoId}?autoplay=1&controls=0"></iframe>`

        elements.append(div);
        
    })
    .catch(err=>console.log(err));
}

window.addEventListener("load", function(){
    init();
    window.addEventListener("scroll", function(){
        const header= this.document.getElementById("header");
        if(window.scrollY>5) header.classList.add("black-bg")
        else(header.classList.remove("black-bg"));
    })
})
