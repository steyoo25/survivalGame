const usernameInput = document.querySelector('input');
const playButton = document.querySelector('#play');
const labelElm = document.querySelector('label');

playButton.addEventListener('click', ()=>{
    let username = usernameInput.value;
    if (username.length >= 3 && username.length <= 15){
        sessionStorage.setItem('username', username);
        window.location.href = './main.html';
        // redirect the user to the main.html page
    } else {
        labelElm.textContent = 'Username must be between 3-15 characters';
    }
})