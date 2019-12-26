const canvas = document.getElementById('canvas'),
    context = canvas.getContext('2d'),
    tileSprite = new Image(),
    bgSprite = new Image();
tileSprite.src = 'img/treeTile.png';
bgSprite.src = 'img/grassTile.png';

function Tile(size, x, y){
    this.size = size;
    this.x = x*this.size;
    this.y = y*this.size;
    this.isHidden = true;

    this.draw = ()=>{
        var x = this.x, y = this.y;
        if(this.isHidden){
            context.drawImage(tileSprite, x, y);
        } else {
            context.drawImage(bgSprite, x, y)
        }
    }
};

function Board(width, height, tileSize){
    this.width = width;
    this.height = height;
    this.tileSize = tileSize;
    this.tiles = [];
    this.numOfHiddenTiles = width*height;

    this.init = ()=>{
        let row, col;

        for(row = this.height-1; row>=0; row--){
            this.tiles[row] = [];
            for(col = this.width-1; col>=0; col--){
                this.tiles[row][col] = new Tile(tileSize, row, col);
            }
        }
    };

    this.draw = ()=>{
        var row, col;

        for (row = this.height-1; row>=0; row--) {
            for (col = this.width-1; col>=0; col--) {
                this.tiles[row][col].draw();
            }
        }
    };

    this.reveal = (x, y) => {
        const clickedTile = that.tiles[x][y];
        if(clickedTile.isHidden) {
            clickedTile.isHidden = false;
            this.numOfHiddenTiles--;
        }
        clickedTile.draw();
    }
};

function Game(width, height){
    this.width = width;
    this.height = height;
    this.tileSize = 32;
    this.board = new Board(this.width, this.height, this.tileSize);

    this.init = () => {
        console.log('start');
        canvas.setAttribute('class', 'layer1')
        canvas.width = width * this.tileSize;
        canvas.height = height * this.tileSize;
        this.board.init();
        this.board.draw();
        // tileSprite.onload = () => {
        //     this.board.draw()
        // };
    };
};

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
    const button = document.createElement('button');
    button.innerHTML = 'START';
    button.setAttribute('class', 'text-button')
    button.addEventListener('click', ()=>{
        game = new Game(20,20);
        game.init();
        mainMenu.setAttribute('class', 'main layermin2')
    });
    startBtn.appendChild(button);
    
    mainMenu.appendChild(divImg);
    mainMenu.appendChild(welcomeText);
    mainMenu.appendChild(startBtn);
    layout[0].appendChild(mainMenu);
}

(function(){
    window.onload = () => {
        const main = new MainMenu();
    }
}());
