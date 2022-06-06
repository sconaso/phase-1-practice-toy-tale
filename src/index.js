let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });
});

// add toys from database to page

function getToys(){
  fetch('http://localhost:3000/toys')
  .then((resp) => resp.json())
  .then((data) => {
    data.forEach((toy) => {
      postToysToPage(toy) // created a function so I could use it during GET and POST calls
    })
  })
}

function postToysToPage(toy){
  let cardHeading = document.createElement('h2')
  let cardImg = document.createElement('img')
  let cardLikes = document.createElement('p')
  let cardButton = document.createElement('button')

  cardHeading.innerText = toy.name
  cardImg.src = `${toy.image}`
  cardImg.setAttribute('class', 'toy-avatar')
  cardLikes.innerText = `${toy.likes} Likes`
  cardButton.className = 'like-btn'
  cardButton.setAttribute('id', `${toy.id}`)
  cardButton.innerText = 'Like me'

  let div = document.querySelector('#toy-collection')
  let cardDiv = document.createElement('div')
  div.appendChild(cardDiv)
  cardDiv.className = 'card'
  cardDiv.appendChild(cardHeading)
  cardDiv.appendChild(cardImg)
  cardDiv.appendChild(cardLikes)
  cardDiv.appendChild(cardButton)
}

document.addEventListener('DOMContentLoaded', getToys)

// add a new toy to the database

function addNewToy(e){
  // create object with form data
  e.preventDefault()
  let newToyObj = {
    name: e.target.name.value,
    image: e.target.image.value,
    likes: 0
  }
  // post object to database and post to DOM if successful
  fetch('http://localhost:3000/toys', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'accept': 'application/json'
    },
    body: JSON.stringify(newToyObj)
  })
  .then((resp) => resp.json())
  .then((data) => {
    console.log('Success: ', data)
    postToysToPage(data)
  })
  .catch((error) => console.log('Error: ', error))
}

let form = document.querySelector('.add-toy-form')
form.addEventListener('submit', addNewToy)

// increase the likes on a toy

setTimeout(updateLikes, 1000) // wait 1 second for DOM to load

function updateLikes(){
  let likeButtons = document.querySelectorAll('.like-btn')
  likeButtons.forEach((button) => {
    button.addEventListener('click', () => {
      // grab the current number of likes from the string and build object for PATCH
      let currentLikeString = button.parentElement.querySelector('p').innerText
      let currentLikes = currentLikeString.split(' ')[0]
      currentLikes++
      let newNumLikeObj = {
        'likes': `${currentLikes}`
      }
      // call PATCH
      fetch(`http://localhost:3000/toys/${button.id}`, {
      method: 'PATCH',
      headers: {
        'content-type': 'application/json',
        'accept': 'application/json'
      },
      body: JSON.stringify(newNumLikeObj)
      })
      // update the DOM to reflect the new number of likes
      .then((resp) => resp.json())
      .then((data) => {
        console.log('Success: ', data)
        button.parentElement.querySelector('p').innerText = `${data.likes} Likes`
      })
      .catch((error) => console.log('Error: ', error))
    })
  })
}

