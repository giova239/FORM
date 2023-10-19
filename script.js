const username = 'alpenitedeveloper';
const password = '9trfpL2Fa1SMlih80dCvpdjhJ5';
const url = 'http://94.23.68.179/test/giovanni.json';
const authorizationHeader = "";

// Function to calculate the Digest Authentication response
function calculateDigestResponse(username, password, realm, nonce, method, uri) {
    const HA1 = md5(`${username}:${realm}:${password}`);
    const HA2 = md5(`${method}:${uri}`);
    const response = md5(`${HA1}:${nonce}:${HA2}`);
    return `username="${username}", realm="${realm}", nonce="${nonce}", uri="${uri}", response="${response}"`;
}

// Step 1: Send an unauthenticated request to get the WWW-Authenticate header
fetch('http://94.23.68.179', { method: 'GET', mode: 'no-cors' })
    .then(response => {
        const wwwAuthenticateHeader = response.headers.get('www-authenticate');
        if (wwwAuthenticateHeader) {
            // Parse the WWW-Authenticate header to extract the required values (realm, nonce, etc.)
            // Example parsing logic:
            const realm = /realm="([^"]+)"/.exec(wwwAuthenticateHeader)[1];
            const nonce = /nonce="([^"]+)"/.exec(wwwAuthenticateHeader)[1];

            // Step 2: Calculate the Digest Authentication response
            authorizationHeader = calculateDigestResponse(username, password, realm, nonce, 'PUT', url);
        }
    })



//FORM SUBMIT EVENT
const button = document.getElementById('send');
const form = document.getElementById('form');

async function postRequest(e) {
    e.preventDefault();
    button.setAttribute('disabled', 'disabled');

    const fd = new FormData(form);
    const response = await fetch('http://94.23.68.179/test/giovanni.json', {
        method: 'PUT',
        body: JSON.stringify({
            title: fd.get('firstname'),
            body: fd.get('message'),
            userId: 1,
        }),
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
            'Authorization': `Digest ${authorizationHeader}`,
        },
    });
    console.log(response);
    if (response.ok) {
        button.removeAttribute('disabled');
    } else {
        button.classList.replace('btn-primary', 'btn-danger');
    }
    const json = await response.json();
    console.log(json);
}

form.addEventListener('submit', postRequest);


//EDIT