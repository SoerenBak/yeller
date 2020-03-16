console.log('Hello world');

const form = document.querySelector('form');
const loadingElement = document.querySelector('.loading');
const yellsElement = document.querySelector('.yells');
const API_URL = 'http://localhost:5000/yells'

loadingElement.style.display = 'none';

listAllYells();

form.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const name = formData.get('name');
    const content = formData.get('content');

    const yell = {
        name,
        content
    };

    console.log(yell);
    form.style.display = 'none';
    loadingElement.style.display = '';

    fetch(API_URL, {
        method: 'POST',
        body: JSON.stringify(yell),
        headers: {
            'content-type': 'application/json'
        }
    }).then(response => response.json())
        .then(createdYell => {
            form.reset();
            setTimeout(() => {
                form.style.display = '';
            }, 30000)
            listAllYells();
        });
});

function listAllYells() {
    yellsElement.innerHTML = '';
    fetch(API_URL)
        .then(response => response.json())
        .then(yells => {
            yells.reverse();
            yells.forEach(yell => {
                const div = document.createElement('div');

                const header = document.createElement('h3');
                header.textContent = yell.name;

                const contents = document.createElement('p');
                contents.textContent = yell.content;

                const date = document.createElement('small');
                date.textContent = new Date(yell.created); 

                div.appendChild(header);
                div.appendChild(contents);
                div.appendChild(date);

                yellsElement.appendChild(div);
            });
            loadingElement.style.display = 'none';
        });
}