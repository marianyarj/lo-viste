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

async function getMovieById(id) {
    const response = await fetch(urlMovies + id, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json'
        }
    });
    const movieById = await response.json();
    return movieById;
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
                <button type="submit" onclick=deleteMovie('${movie.id}')>Borrar</button>
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


async function deleteMovie(id) {
    //let moviesList = await getMovies();
    /*percorre o array até encontrar o um match entre item.id 
    e id e uma vez que encontrou o retorna a propriedade title.*/
    //movieTitle = (moviesList.find(item => item.id === id)).title;

    movieComplete = await getMovieById(id);

    /*
    let movieElementTitle = "";
    for (let index = 0; index < moviesList.length; index++) {
        if (moviesList[index].id === id) {
            //console.log(moviesList[index].title);
            movieElementTitle = moviesList[index].title;
            break;
        }
    }*/
    //um popup que pede uma confirmaçao para continuar e caso sim, ou seja, "confirm" seja true, elimina.
    if (confirm(`¿Estás segura de que deseas eliminar "${movieComplete.title}"?`)) {
        const response = await fetch(urlMovies + id, {
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            printMovies();
            alert(`La película >> ${movieComplete.title} << fue eliminada.`);
        } else {
            alert(`ERROR: La película >> ${movieComplete.title} << no fue eliminada.`);
        }
    }
}
