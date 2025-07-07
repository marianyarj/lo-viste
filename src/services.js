const urlMovies = "http://localhost:3000/movies/";
//get = read

/*async -> requisição ao servidor, ou seja, não bloqueia todo o código 
enquanto espera uma resposta do servidor (ou o que seja).*/
async function getMovies() {
    /*sempre que uma função seja marcada async é necessário ter o await, que é o esperar a resposta. */
    const response = await fetch(urlMovies, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json'
        }
    });
    const moviesData = await response.json();
    return moviesData;
}

//console.log(getMovies());

const moviesContainer = document.getElementById("section-movies");
async function printMovies() {
    moviesContainer.innerHTML = "";
    let moviesList = await getMovies();
    const printMoviesList = moviesList.map(movie => {
        return moviesContainer.innerHTML += `
        <div class="movie-container">
            <div class="container-left">
                <h3 class="movie-title">${movie.title}</h3>
                <button type="submit">${movie.watched}</button>
            </div>
            <div class="container-right">
                <p class="movie-director">Director: ${movie.director}</p>
                <p class="movie-description">${movie.description}</p>
                <p class="movie-duration">${movie.duration}</p>
                <p class="movie-year">${movie.year}</p>
                <p class="movie-country">${movie.country}</p>
            </div>
        </div>
        `
    });
    return printMoviesList;
}