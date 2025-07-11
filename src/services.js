"use strict";
const URL_API_MOVIES = "http://localhost:3000/movies/";

//lógica del modal
function openModal() {
    document.getElementById("movieModal").style.display = "block";
    if (movieIdToUpdate) {
        modalTitle.textContent = 'Editar película';
    } else {
        modalTitle.textContent = 'Añadir nueva película';
    }
}

function closeModal() {
    document.getElementById("movieModal").style.display = "none";
    document.querySelector("#movieModal form").reset();
    movieIdToUpdate = null;
}
const modalTitle = document.querySelector('.modal-title');

//funcion para cada letra sea maiuscula, pero antes tratar para que seja tudo minuscula
function capitalizeName(str) {
    return str
        .toLowerCase()
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

//funcion para enviar a bbdd
function sendMovieInfo(event) {
    event.preventDefault();

    const title = document.getElementById("title").value;
    const capitalizedTitle = capitalizeName(title);
    const director = document.getElementById("director").value;
    const capitalizedDirector = capitalizeName(director);
    const year = document.getElementById("year").value;
    const description = document.getElementById("description").value;
    const country = document.getElementById("country").value;
    const capitalizedCountry = capitalizeName(country);
    const genre = document.getElementById("genre").value;
    const picture = document.getElementById("picture").value;

    const newMovie = {
        title: capitalizedTitle,
        director: capitalizedDirector,
        year: year,
        description: description,
        country: capitalizedCountry,
        genre: genre,
        picture: picture
    };

    if (movieIdToUpdate) {
        updateMovie(movieIdToUpdate, newMovie);
    } else {
        createMovie(newMovie);
    }
}
//Create -> Post
async function createMovie(newMovie) {
    const response = await fetch(URL_API_MOVIES, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newMovie)
    });

    if (response.ok) {
        printMovies();
        const addAnother = confirm(`La película ${newMovie.title} fue añadida. ¿Quieres añadir otra?`);
        if (addAnother) {
            document.querySelector("#movieModal form").reset();
        } else {
            closeModal();
        }
    } else {
        alert(`ERROR al intentar añadir la película: ${newMovie.title}.`);
    }
}

//Update -> Put
async function updateMovie(id, editedMovie) {
    const response = await fetch(URL_API_MOVIES + id, {
        method: "PUT",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(editedMovie)
    });

    if (response.ok) {
        printMovies();
        alert(`Película actualizada: ${editedMovie.title}`);
    } else {
        alert("Error al actualizar la película.");
    }
}

let movieIdToUpdate = null;
//funcion que guarda informaciones para update
async function infoMovieUpdate(id) {
    const movie = await getMovieById(id);

    document.getElementById("title").value = movie.title;
    document.getElementById("director").value = movie.director;
    document.getElementById("year").value = movie.year;
    document.getElementById("description").value = movie.description;
    document.getElementById("country").value = movie.country;
    document.getElementById("genre").value = movie.genre;
    document.getElementById("picture").value = movie.picture;

    movieIdToUpdate = id;

    openModal();
}

/*async -> requisição ao servidor, ou seja, não bloqueia todo o código 
enquanto espera uma resposta do servidor (ou o que seja).*/
async function getMovies() {
    /*sempre que uma função seja marcada async é necessário ter o await, que é o esperar a resposta. */
    const response = await fetch(URL_API_MOVIES, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json'
        }
    });
    const moviesData = await response.json();
    return moviesData;
}

async function getMovieById(id) {
    const response = await fetch(URL_API_MOVIES + id, {
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
                <div>
                    <h3 class="movie-title">${movie.title}</h3>
                    <img class="movie-pic" src="${movie.picture}" alt="foto de la película ${movie.title}">
                </div>
                <div class="card-btn-container">
                    <button class="btn-delete" type="submit" onclick=deleteMovie('${movie.id}')>Borrar</button>
                    <button class="btn-update" type="submit" onclick=infoMovieUpdate('${movie.id}')>Actualizar</button>
                </div>
                
            </div>
            <div class="container-right">
                <div>
                    <p class="movie-director"><strong>Director: </strong> ${movie.director}</p>
                    <p class="movie-description"><strong>Descripción: </strong> ${movie.description}</p>
                    <p class="movie-genero"><strong>Género: </strong>${movie.genre}</p>
                </div>
                <div class="container-right-partii">
                    <p class="movie-year">${movie.year}</p>
                    <p class="movie-country">${movie.country}</p>
                </div>
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

    const movieComplete = await getMovieById(id);

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
        const response = await fetch(URL_API_MOVIES + id, {
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            printMovies();
            alert(`La película "${movieComplete.title}" fue eliminada.`);
        } else {
            alert(`ERROR: La película >> ${movieComplete.title} << no fue eliminada.`);
        }
    }
}

//funcion para fixar el titulo despues del parallax
window.addEventListener('scroll', () => {
    const title = document.querySelector('.title');
    const parallaxHeight = document.querySelector('.parallax').offsetHeight;

    if (window.scrollY >= parallaxHeight) {
        title.style.position = 'fixed';
        title.style.top = '0';
        title.style.width = '100%';
    } else {
        title.style.position = 'relative';
        title.style.top = 'auto';
        title.style.width = 'auto';
    }
});