function MainMenu(){
    const layout = document.getElementsByClassName('layout');
    const mainMenu = document.createElement('div');
    mainMenu.setAttribute('class', 'main layer0');

    const divImg = document.createElement('div');
    const img = new Image();
    img.src = 'img/firstDisplay.jpg';
    img.setAttribute('class', 'img-first-display');
    divImg.appendChild(img);

    const welcomeText = document.createElement('div');
    welcomeText.innerHTML = 'Welcome to the Adventure';
    welcomeText.setAttribute('class', 'welcome-text');

    const startBtn = document.createElement('div');
    startBtn.setAttribute('class', 'start-button');
    const button = document.createElement('a');
    button.innerHTML = 'START';
    button.setAttribute('class', 'text-button')
    startBtn.appendChild(button);

    mainMenu.appendChild(divImg);
    mainMenu.appendChild(welcomeText);
    mainMenu.appendChild(startBtn);
    layout.appendChild(mainMenu);
}

export default MainMenu;

