/* eslint-disable no-undef */
function saveNewCard(query, cb) {
  return fetch(`save/card?q=${query}`, {
    accept: 'application/json',
  }).then(checkStatus)
    .then(parseJSON)
    .then(cb);
}

function saveLayout(query) {
  return fetch(`save/layout?q=${query}`, {
    accept: 'application/json',
  }).then(checkStatus)
}

function getLayout(cb) {
  return fetch(`api/layout`, {
    accept: 'application/json',
  }).then(checkStatus)
      .then(parseJSON)
      .then(cb);
}

function getCards(cb) {
  return fetch(`api/cards`, {
    accept: 'application/json',
  }).then(checkStatus)
      .then(parseJSON)
      .then(cb);
}

function updateCard(query, key) {
  return fetch(`update/card?q=${query}&key=${key}`, {
    accept: 'application/json',
  }).then(checkStatus)
}

function deleteCard(key) {
  return fetch(`delete/card?key=${key}`, {
    accept: 'application/json',
  }).then(checkStatus)
}

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  } else {
    const error = new Error(`HTTP Error ${response.statusText}`);
    error.status = response.statusText;
    error.response = response;
    console.log(error); // eslint-disable-line no-console
    throw error;
  }
}

function uploadImage(imageFile) {
  return new Promise((resolve, reject) => {
    let imageFormData = new FormData();

    imageFormData.append('imageFile', imageFile);

    var xhr = new XMLHttpRequest();

    xhr.open('post', '/upload', true);

    xhr.onload = function () {
      if (this.status == 200) {
        resolve(this.response);
      } else {
        reject(this.statusText);
      }
    };

    xhr.send(imageFormData);

  });
}

function parseJSON(response) {
  return response.json();
}

const Client = { saveNewCard, getCards, saveLayout, getLayout, updateCard, deleteCard, uploadImage };
export default Client;
