class Carousel {
  /**
   * This callback type is called `requestCallback` and is displayed as a global symbol.
   *
   * @callback moveCallback
   * @param {number} index
   */

  /**
   *
   * @param {HTMLElement} element
   * @param {Object} options
   * @param {Object} [options.slidesToScroll=1] Nombre d'éléments à faire défiler
   * @param {Object} [options.slidesVisible=1] Nombre d'éléments visible dans un slide
   * @param {boolean} [options.loop=false] Doit-t-on boucler en fin de carousel
   * @param {boolean} [options.pagination=false]
   * @param {boolean} [options.navigation=true]
   */
  constructor (element, options = {}) {
    this.element = element
    this.options = Object.assign({}, {
      slidesToScroll: 1,
      slidesVisible: 1,
      loop: false,
      pagination: false,
      navigation: true
    }, options)
    let children = [].slice.call(element.children)
    this.isMobile = false
    this.currentItem = 0
    this.moveCallbacks = []

    // Modification du DOM
    this.root = this.createDivWithClass('carousel')
    this.container = this.createDivWithClass('carousel__container')
    this.root.setAttribute('tabindex', '0')
    this.root.appendChild(this.container)
    this.element.appendChild(this.root)
    this.items = children.map((child) => {
      let item = this.createDivWithClass('carousel__item')
      item.appendChild(child)
      this.container.appendChild(item)
      return item
    })
    this.setStyle()
    if (this.options.navigation) {
      this.createNavigation()
    }
    if (this.options.pagination) {
      this.createPagination()
    }

    // Evenements
    this.moveCallbacks.forEach(cb => cb(0))
    this.onWindowResize()
    window.addEventListener('resize', this.onWindowResize.bind(this))
    this.root.addEventListener('keyup', e => {
      if (e.key === 'ArrowRight' || e.key === 'Right') {
        this.next()
      } else if (e.key === 'ArrowLeft' || e.key === 'Left') {
        this.prev()
      }
    })
  }

  /**
   * Applique les bonnes dimensions aux éléments du carousel
   */
  setStyle () {
    let ratio = this.items.length / this.slidesVisible
    this.container.style.width = (ratio * 100) + "%"
    this.items.forEach(item => item.style.width = ((100 / this.slidesVisible) / ratio) + "%")
  }

  /**
   * Crée les flêches de navigation dans le DOM
   */
  createNavigation () {
    let nextButton = this.createDivWithClass('carousel__next')
    let prevButton = this.createDivWithClass('carousel__prev')
    this.root.appendChild(nextButton)
    this.root.appendChild(prevButton)
    nextButton.addEventListener('click', this.next.bind(this))
    prevButton.addEventListener('click', this.prev.bind(this))
    if (this.options.loop === true) {
      return
    }
    this.onMove(index => {
      if (index === 0) {
        prevButton.classList.add('carousel__prev--hidden')
      } else {
        prevButton.classList.remove('carousel__prev--hidden')
      }
      if (this.items[this.currentItem + this.slidesVisible] === undefined) {
        nextButton.classList.add('carousel__next--hidden')
      } else {
        nextButton.classList.remove('carousel__next--hidden')
      }
    })
  }

  /**
   * Crée la pagination dans le DOM
   */
  createPagination () {
    let pagination = this.createDivWithClass('carousel__pagination')
    let buttons = []
    this.root.appendChild(pagination)
    for (let i = 0; i < this.items.length; i = i + this.options.slidesToScroll) {
      let button = this.createDivWithClass('carousel__pagination__button')
      button.addEventListener('click', () => this.gotoItem(i))
      pagination.appendChild(button)
      buttons.push(button)
    }
    this.onMove(index => {
      let activeButton = buttons[Math.floor(index / this.options.slidesToScroll)]
      if (activeButton) {
        buttons.forEach(button => button.classList.remove('carousel__pagination__button--active'))
        activeButton.classList.add('carousel__pagination__button--active')
      }
    })
  }

  /**
   *
   */
  next () {
    this.gotoItem(this.currentItem + this.slidesToScroll)
  }

  prev () {
    this.gotoItem(this.currentItem - this.slidesToScroll)
  }

  /**
   * Déplace le carousel vers l'élément ciblé
   * @param {number} index
   */
  gotoItem (index) {
    if (index < 0) {
      if (this.options.loop) {
        index = this.items.length - this.slidesVisible
      } else {
        return
      }
    } else if (index >= this.items.length || (this.items[this.currentItem + this.slidesVisible] === undefined && index > this.currentItem)) {
      if (this.options.loop) {
        index = 0
      } else {
        return
      }
    }
    let translateX = index * -100 / this.items.length
    this.container.style.transform = 'translate3d(' + translateX + '%, 0, 0)'
    this.currentItem = index
    this.moveCallbacks.forEach(cb => cb(index))
  }

  /**
   * Rajoute un écouteur qui écoute le déplacement du carousel
   * @param {moveCallback} cb
   */
  onMove (cb) {
    this.moveCallbacks.push(cb)
  }

  /**
   * Ecouteur pour le redimensionnement de la fenêtre
   */
  onWindowResize () {
    let mobile = window.innerWidth < 800
    if (mobile !== this.isMobile) {
      this.isMobile = mobile
      this.setStyle()
      this.moveCallbacks.forEach(cb => cb(this.currentItem))
    }
  }

  /**
   * Helper pour créer une div avec une classe
   * @param {string} className
   * @returns {HTMLElement}
   */
  createDivWithClass (className) {
    let div = document.createElement('div')
    div.setAttribute('class', className)
    return div
  }

  /**
   * @returns {number}
   */
  get slidesToScroll () {
    return this.isMobile ? 1 : this.options.slidesToScroll
  }

  /**
   * @returns {number}
   */
  get slidesVisible () {
    return this.isMobile ? 1 : this.options.slidesVisible
  }
}

class Modal {
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
            <li>${this.duration}</li>
          </ul>
        </div>
        <div class="movie-infos2">
          <div class="imdb-rating">
            <p>IMDb RATING</p>
            <a href="#"><span class="material-icons">star</span> ${this.score}/10</a>
            <p>${this.votes}</p>
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
        <div class="movies-infos-genres" id="movies-infos-genres">
     
        </div>
        <p>${this.description}</p>
        <ul class="staff-infos">
          <li><p><span>Directors</span> <a href="#"> ${this.directors}</a></p></li>
          <li><p><span>Writer</span><a href="#"> ${this.writers}</a></p></li>
          <li><p><span>Stars</span><a href="#"> ${this.actors}</a></p></li>
        </ul>
      </div>
    </div>
    `
  this.modal_content.innerHTML = this.html
  this.getGenres(this.genres)
  }

  /**
   * 
   * @param {array} genres 
   */
  getGenres (genres) {
    this.genres_div = document.getElementById('movies-infos-genres')
    this.genres.forEach(element => {
      var a = document.createElement('a')
      a.setAttribute('class', '')
      a.setAttribute('id', '')
      a.innerHTML = element
      this.genres_div.appendChild(a)
    })
  }

 /**
  * Helper pour créer une div avec une classe
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
 * 
 * @param {array} array
 */
function insertData(array) {
  array.forEach(function (elementNode) {
    let node = document.getElementById(elementNode)
    let category = node.id
    let childrens = node.children[0].firstChild.children
    if (category == 'bestMovies') {
      let data = fetchData(`http://localhost:8000/api/v1/titles/?format=json&sort_by=-imdb_score`)
      .then(value => {
        var movies = value.results;
        for (i = 0; i < childrens.length; i++) {
          var div = childrens[i].getElementsByClassName('item__image')[0]
          div.setAttribute('data-title', movies[i].title)
          var img = document.createElement('img')
          img.setAttribute('src', movies[i].image_url)
          img.setAttribute('id', movies[i].id)
          div.append(img)
        }
      })     
    } else {
      let data = fetchData(`http://localhost:8000/api/v1/titles/?format=json&sort_by=-imdb_score&genre=${category}`)
      .then(value => {
        let movies = value.results;
        for (i = 0; i < childrens.length; i++) {
          let div = childrens[i].getElementsByClassName('item__image')[0]
          div.setAttribute('data-title', movies[i].title)
          let img = document.createElement('img')
          img.setAttribute('src', movies[i].image_url)
          img.setAttribute('id', movies[i].id)
          div.append(img)
        }
      })
    }
  })
}


/**
 * 
 * 
 */
function fetchData(url) {
  return fetch(url)
  .then(response => {
    return response.json();
  })
  .catch(err => console.log("Problem with fetch:" + err))
}

/**
 *
 * 
 */
function jumbotron() {
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
  jumbotron()
  let categorie__array = ['bestMovies', 'romance', 'action', 'adventure']
  categorie__array.forEach(function (element) {
    new Carousel(document.querySelector(`#${element}`), {
      slidesVisible: 4,
      slidesToScroll: 1,
      loop: true
    })    
  })

  // Insert les datas dans les divs
  insertData(categorie__array)
  
  // Select clicked movie
  document.querySelectorAll('.item__image').forEach(item => {
    let modalDiv = document.getElementById("modal")

    item.addEventListener('click', event => {
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

        //
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




