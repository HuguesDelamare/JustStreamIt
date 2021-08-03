
/**
 * Asynch function to get and display all the movies by category
 * @param {array} array 
 */
async function getMovieData (array) {
  array.forEach(element => {
    if (element != "bestMovies") {
      for (i=1; i <= 10; i++) {
        var data = fetchData(`http://localhost:8000/api/v1/titles/?genre=${element}&sort_by=-imdb_score&page=`+i)
        .then(value => {
          var node = document.getElementById(`${element}`)
          var sliders = node.querySelector('.track')
          result = value.results
          result.map(function (cur) {
            sliders.insertAdjacentHTML(
              "beforeend",
              `
              <div class="card-container">
                <div class="card" data-title="${cur.title}">
                <div class="img"><img class="img" id="${cur.id}" src="${cur.image_url}"></div>
                </div>
              </div>
              `
            )
          })
        })
      }
    }else {
      for (i=1; i <= 10; i++) {
        var data = fetchData(`http://localhost:8000/api/v1/titles/?sort_by=-imdb_score&page=`+i)
        .then(value => {
          var node = document.getElementById(`${element}`)
          var sliders = node.querySelector('.track')
          result = value.results
          result.map(function (cur) {
            sliders.insertAdjacentHTML(
              "beforeend",
              `
              <div class="card-container">
                <div class="card" data-title="${cur.title}">
                <div class="img"><img class="img" id="${cur.id}" src="${cur.image_url}"></div>
                </div>
              </div>
              `
            )
          })
        })
      }
    }
  })
}

/**
 * Modal class to display data from clicked carousel movie
 * @class
 */
class Modal {
  /**
   * @param {HTMLElement} element 
   * @constructor
   */
  constructor (element) {
    this.image_url = element.image_url,
    this.title = element.title,
    this.genres = element.genres,
    this.date_published = element.date_published,
    this.rated = element.rated, 
    this.score = element.imdb_score,   
    this.votes = element.votes,
    this.directors = element.directors,
    this.writers = element.writers
    this.actors = element.actors,
    this.duration = element.duration,
    this.countries = element.countries,
    this.boxOffice = element.metascore,
    this.description = element.description

    // Modification du DOM
    this.root = document.getElementById('modal')
    this.root.innerHTML = ''
    this.modal_content = this.createDivWithClass('modal-content')
    this.root.appendChild(this.modal_content)
    this.close = document.getElementsByClassName('close')
    this.html = `
    <span class="close" id="close">&times;</span>
    <div class="header-container">
      <div class="header-title">
        <h1>${this.title}</h1>
      </div>
      <div class="header-infos">
        <div class="movie-infos1">
          <ul class="movie-infos-list">
            <li>${this.date_published}</li>
            <li>${this.rated}</li>
            <li>${this.duration} min</li>
          </ul>
          <ul class="movie-infos-list">
            <li>${this.countries}</li></li>
          </ul>
        </div>
        <div class="movie-infos2">
          <div class="imdb-rating">
            <p>IMDb RATING</p>
            <a href="#"><span class="material-icons">star</span> ${this.score}/10</a>
            <p>${this.votes} votes</p>
          </div>
          <div class="my-rating">
            <p>YOUR RATING</p>
            <a href="#"><span class="material-icons">star_border</span>Rate</a>
          </div>
        </div>
      </div>
    </div>
    <div class="body_container">
      <div class="img_container">
        <a><img src="${this.image_url}" alt="moviePicture"></a>
      </div>
      <div class="body-infos">
        <div class="movies-infos-genres" id="movies-infos-genres"></div>
        <div class="movie_title"<p>${this.description}</p></div>
        <div class="staff_infos">
          <ul>
            <li><p><span>Directors</span> <a href="#"> ${this.directors}</a></p></li>
            <li><p><span>Writer</span><a href="#"> ${this.writers}</a></p></li>
            <li><p id="actors_list"><span>Stars</span></p></li>
          </ul>
        </div>
      </div>
    </div>
    `
  this.modal_content.innerHTML = this.html
  this.getGenres(this.genres)
  this.getActors(this.actors)
  }

  /**
   * Get method to show all actors from a movie in modal
   * @param {array} actors 
   */
  getActors (actors) {
    let actors_p = document.getElementById('actors_list')
    actors.forEach(element => {
      let a = document.createElement('a')
      a.setAttribute('href', '#')
      a.innerHTML = element + " "
      actors_p.append(a)
    });
  }

  /**
   * Get method to show all the genres from a movie in modal
   * @param {array} genres 
   */
  getGenres (genres) {
    let genres_div = document.getElementById('movies-infos-genres')
    genres.forEach(element => {
      let a = document.createElement('a')
      a.setAttribute('class', '')
      a.setAttribute('id', '')
      a.innerHTML = element
      genres_div.appendChild(a)
    })
  }

 /**
  * Helper to create a div with a class
  * @param {string} className
  * @returns {HTMLElement}
  */
    createDivWithClass (className) {
    let div = document.createElement('div')
    div.setAttribute('class', className)
    return div
  }
}

/**
 * Fetch method to get the data from the API url
 * @param {string} url
 * @returns {json} 
 */
function fetchData (url) {
  return fetch(url)
  .then(response => {
    return response.json()
  })
  .catch(err => console.log("Problem with fetch:" + err))
}

/**
 * Function to create the jumbotron and display the first best movie in database
 * Jumbotron
 */
function jumbotron () {
  let jumbotron = document.getElementById('jumbotron')
  let jumbotron__background = jumbotron.getElementsByTagName('div')[0]
  let jumbotron__infos = jumbotron.getElementsByTagName('div')[1]

  let data = fetchData(`http://localhost:8000/api/v1/titles/?format=json&sort_by=-imdb_score`)
  .then(value => {
    let movies = value.results[0];

    let jumbotron__img = document.getElementById('jumbotron__img')
    jumbotron__img.setAttribute('src', movies.image_url)
    
  })
}


// ON READY 
let onReady = function () {
  let carouselWidth = document.querySelector('.carousel-container').offsetWidth
  let categorie__array = ['bestMovies','action','adventure','romance']

  jumbotron()
  getMovieData(categorie__array)
  
  // Making the carousel slide Left and Right
  nav = document.querySelectorAll('.nav').forEach(node => {
    let track = node.previousElementSibling.firstElementChild
    let prev = node.querySelector('.prev')
    let next = node.querySelector('.next')
    let index = 0

    prev.addEventListener('click', () => {
      index--;
      next.classList.remove('hide')
      if (index === 0) {
        prev.classList.remove('show')
      }
      track.style.transform = `translateX(-${index * carouselWidth}px)`
    })

    next.addEventListener('click', () => {
      index++;
      prev.classList.add('show')
      track.style.transform = `translateX(-${index * carouselWidth}px)`
      
      if (track.offsetWidth - (index * carouselWidth) < carouselWidth) {
        next.classList.add('hide')
      }
    })
  })

  //
  window.addEventListener('resize', () => {
    carouselWidth = document.querySelector('.carousel-container').offsetWidth
  })
  
  // Select clicked movie
  var track = document.querySelectorAll('.track')
  
  document.querySelectorAll('.track').forEach(node => {
    node.children.firstElementChild
    let modalDiv = document.getElementById('modal')

    node.addEventListener('click', event => {
      // Displaying the modal
      modalDiv.style.display = "block"
      
      // Get movie from clicked card 
      let url = fetchData(`http://localhost:8000/api/v1/titles/${event.target.id}?format=json`)
      .then(data => {
        modal = new Modal(data)
        span = document.getElementsByClassName("close")[0];
        
        // When the user clicks anywhere outside of the modal, close it
        window.onclick = function(event) {
          if (event.target == modalDiv) {
            modalDiv.style.display = "none"
          }
        }
        // When user esc click the modal will close
        window.addEventListener('keydown', function (event){
          if (event.key == "Escape"){
            modalDiv.style.display = "none"
          }
        })

        // Will close the modal when click on X button
        span.onclick = function() {
          modalDiv.style.display = "none";
        }

      })
    })
  })
}

if (document.readyState !== 'loading') {
  onReady()
}

document.addEventListener('DOMContentLoaded', onReady)




