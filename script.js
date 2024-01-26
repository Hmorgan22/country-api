'use strict';

const btn = document.querySelector('.btn-country');
const countriesContainer = document.querySelector('.countries');

const renderCountry = function (data, className = '') {
  const html = `<article class="country ${className}">
      <img class="country__img" src="${data.flag}" />
      <div class="country__data">
        <h3 class="country__name">${data.name}</h3>
        <h4 class="country__region">${data.region}</h4>
        <p class="country__row"><span>👫</span>${(
          +data.population / 1000000
        ).toFixed(1)}M People</p>
        <p class="country__row"><span>🗣️</span>${data.languages[0].name}</p>
        <p class="country__row"><span>💰</span>${data.currencies[0].name}</p>
      </div>
    </article>`;
  countriesContainer.insertAdjacentHTML('beforeend', html);
};

const renderError = function (msg) {
  countriesContainer.insertAdjacentText('beforeend', msg);
};

const getJSON = function (url, message) {
  return fetch(url).then(response => {
    if (!response.ok) {
      throw new Error(`${message} (${response.status})`);
    }
    return response.json();
  });
};

const getCountryAndNeighbor = function (country) {
  //fetch for country 1
  getJSON(
    `https://countries-api-836d.onrender.com/countries/name/${country}`,
    'country not found'
  )
    .then(data => {
      renderCountry(data[0]);
      const neighbour = data[0].borders?.[0];

      if (!neighbour) {
        throw new Error('Country does not have a neighbor');
      }
      //country 2
      return getJSON(
        `https://countries-api-836d.onrender.com/countries/alpha/${neighbour}`,
        'no neighbor country found'
      );
    })
    .then(data => renderCountry(data, 'neighbour'))
    .catch(err => {
      console.log(err);
      renderError(`Something went wrong ${err.message}. Try again!`);
    })
    .finally(() => {
      countriesContainer.style.opacity = 1;
    });
};

btn.addEventListener('click', function () {
  getCountryAndNeighbor('usa');
});
