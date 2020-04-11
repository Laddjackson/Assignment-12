async function displayMovies() {
    let response = await fetch('/api/movies');
    let moviesJSON = await response.json();
    let moviesDiv = document.getElementById("movies-div");
    moviesDiv.innerHTML = "";

    for(i in moviesJSON) {
        let movie = moviesJSON[i];
        moviesDiv.append(getMovieItem(movie));
    }
}

function getMovieItem(movie){
    let movieSection = document.createElement("section");
    movieSection.classList.add("movie");

    //Adding Title
    let aTitle = document.createElement("a");
    aTitle.setAttribute("data-id", movie.id);
    aTitle.href = "#";
    aTitle.onclick = showMovieDetails;
    let h2Elem = document.createElement("h2");
    h2Elem.textContent = movie.title;
    aTitle.append(h2Elem)
    movieSection.append(aTitle);

    //

    //Adding description
    let movieDescription = document.createElement("p");
    movieDescription.innerHTML = ("<b>Year</b>: "+movie.year+"<br><b>Rating</b>: "+movie.rating+"<br><b>Description</b>: "+movie.description);
    movieSection.append(movieDescription);

    return movieSection;
}

async function showMovieDetails(){
    let id = this.getAttribute("data-id");
    let response = await fetch(`/api/movies/${id}`);

    if(response.status != 200) {
        console.log("Error reciving movie");
        let span = document.getElementById("span-response-details");
        span.textContent = "ERROR: Movie could not be shown";
        return;
    }

    let movie = await response.json();
    document.getElementById("movie-id").textContent = movie.id;
    document.getElementById("txt-title").value = movie.title;
    document.getElementById("txt-year").value = movie.year;
    document.getElementById("txt-rating").value = movie.rating;
    document.getElementById("txt-description").value = movie.description;
}

async function addMovie() {
    let movieTitle = document.getElementById("txt-add-title").value;
    let movieYear = document.getElementById("txt-add-year").value;
    let movieRating = document.getElementById("txt-add-rating").value;
    let movieDescription = document.getElementById("txt-add-description").value;
    let span = document.getElementById("span-response-add");

    let movie = {"title":movieTitle, "description":movieDescription, "year":movieYear, "rating":movieRating};

    let response = await fetch('/api/movies', {
        method:"POST",
        headers:{
            'Content-Type':'application/json;charset=utf-8'
        },
        body:JSON.stringify(movie)
    });

    if(response.status != 200){
        console.log("ERROR Posting data");
        span.textContent = "ERROR: Movie could not be added!";
        window.setTimeout(clearSpans, 3000);
        return;
    }

    span.textContent = "Movie has been Added!";
    window.setTimeout(clearSpans, 3000);

    let result = await response.json();
    console.log(result);
    displayMovies();
}

async function editMovie() {
    let movieId = document.getElementById("movie-id").textContent;
    let movieTitle = document.getElementById("txt-title").value;
    let movieYear = document.getElementById("txt-year").value;
    let movieRating = document.getElementById("txt-rating").value;
    let movieDescription = document.getElementById("txt-description").value;
    let span = document.getElementById("span-response-details");

    
    let movie = {"title":movieTitle, "description":movieDescription, "year":movieYear, "rating":movieRating};

    let response = await fetch(`/api/movies/${movieId}`, {
        method:'PUT',
        headers:{
            'Content-Type':'application/json;charset=utf-8'
        },
        body: JSON.stringify(movie)
    });

    if(response.status != 200){
        console.log("Error updating movie");
        span.textContent = "ERROR: Movie could not be updated!";
        setTimeout(clearSpans(), 3000);
        return;
    }

    span.textContent = "Movie has been updated!";
    window.setTimeout(clearSpans, 3000);

    let results = await response.json();
    displayMovies();
}

async function deleteMovie() {
    console.log("In delete function");
    let movieId = document.getElementById("movie-id").textContent;
    let span = document.getElementById("span-response-details");

    let response = await fetch(`/api/movies/${movieId}`,{
        method:"DELETE",
        headers:{
            'Content-Type':'application/json;charset=utf-8'
        }
    });

    if(response.status != 200) {
        console.log("Error deleting");
        span.textContent = "ERROR: Movie could not be deleted!";
        return;
    }

    span.textContent = "Movie has been deleted!";
    window.setTimeout(clearSpans, 3000);

    let result = await response.json();
    displayMovies();
}

function clearSpans() {
    console.log("Clearing spans...");
    let detailsSpan = document.getElementById("span-response-details");
    let addSpan = document.getElementById("span-response-add");

    detailsSpan.textContent = "";
    addSpan.textContent = "";
}

window.onload = function(){
    this.displayMovies();

    let addBtn = document.getElementById("btn-add-movie");
    addBtn.onclick = addMovie;

    let editBtn = document.getElementById("btn-edit-movie");
    editBtn.onclick = editMovie;

    let deleteBtn = document.getElementById("btn-delete-movie");
    deleteBtn.onclick = deleteMovie;
}