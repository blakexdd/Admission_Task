/* FILE NAME: main.js
 * PROGRAMMER: VG6
 * DATE: 19.05.2020
 * PURPOSE: To give user link for redirection
 */

/* for further implementation of events behaviour */
const form = document.querySelector('.url-form');
const result = document.querySelector('.result-section');

/* implementing event's behaviour */
form.addEventListener('submit', event => {
    /* preventing default behaviour */
    event.preventDefault();

    /* to further extract values from it */
    const input = document.querySelector('.url-input');

    /* sending information to server */
    fetch('/new', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            url: input.value,
        })
    })
        .then(response => {
            if (!response.ok) {
                throw Error(response.statusText);
            }
            return response.json();
        })
        .then(data => {
            while (result.hasChildNodes()) {
                result.removeChild(result.lastChild);
            }
            /* displaying short link */
            result.insertAdjacentHTML('afterbegin', `
        <div class="result">
          <a target="_blank" class="short-url" rel="noopener" href="/${data.short_id}">
            ${location.origin}/${data.short_id}
          </a>
        </div>
      `)
        })
        .catch(console.error)
});