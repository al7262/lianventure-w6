const canvas = document.getElementById('game'),
    context = canvas.getContext('2d'),
        tileSprite = new Image(),
        narutoSprite = new Image(),
        bgSprite = new Image(),
        homeSprite = new Image();
    let game;
    tileSprite.src = 'img/treeTile.png';
    narutoSprite.src = 'img/narutoTile.png';
    bgSprite.src = 'img/grassTile.png';
    homeSprite.src = "img/homeTile.png";

function Tile(size, x, y){
    this.size = size;
    this.x = x*this.size;
    this.y = y*this.size;
    this.isHidden = true;
    this.isSasuke = false;
    this.isFriend = false;
    this.isEnemy = false;
    this.name = null;

    this.draw = ()=>{
        var x = this.x, y = this.y;
        if(this.isHidden){
            context.drawImage(bgSprite, x, y);
            context.drawImage(tileSprite, x, y);
        } else {
            context.drawImage(bgSprite, x, y);
        }
        
        if(!this.isHidden){
            if(this.isNaruto) {
                context.drawImage(narutoSprite, x, y);
            } else {
                context.drawImage(bgSprite, x, y);
            }
        }
        context.drawImage(bgSprite, 0, 0);
        context.drawImage(homeSprite, 0, 0);
    };
}

function Board(width, height, tileSize){
    this.width = width;
    this.height = height;
    this.tileSize = tileSize;
    this.tiles = [];
    this.numOfHiddenTiles = width*height;
    this.friendList = [];
    this.enemyList = [];

    this.init = ()=>{
        let row, col;

        for(row = this.height-1; row>=0; row--){
            this.tiles[row] = [];
            for(col = this.width-1; col>=0; col--){
                this.tiles[row][col] = new Tile(tileSize, row, col);
            }
        }
        
        let x = Math.ceil(Math.random() * 19);
        let y = Math.ceil(Math.random() * 19);
        this.tiles[x][y].isSasuke = true;

        this.friendList = [
            {name: "Sakura", status: 'Sakura is beautiful as always...'},
            {name: "Hinata", status: 'Hinata, finally we meet again...'},
            {name: "Lee", status: "Hey.. Lee, what makes you angry...?"},
            {name: "Kakashi", status: 'Sensei, I want to go home, now!'},
            {name: "Shikamaru", status: "Do not be so lazy, Shikamaru!"},
            {name: "Kiba", status: "Kiba, let us find Sasuke..."},
            {name: "Neji", status: "Hey.. Neji, how are you today?"},
            {name: "Shino", status: "Would you lend me your insect?"},
            {name: "Choji", status: "Do not eat to much, Choji!"},
            {name: "Ino", status: 'Ino, where is Sakura?'}
        ];

        this.enemyList = [
            {name: "Hidan", status: "Don't fight them, fight me!"},
            {name: "Kakuzu", status: 'I am your truly enemy...'},
            {name: "Kisame", status: "I won't allow you to destroy my Village!"},
            {name: "Pein", status: 'Pein, we have different mindset'},
            {name: "Kabuto", status: 'I will fight you till one of us die!'},
            {name: "Orochimaru", status: 'I will not give up to fight you!'},
            {name: "Zetsu", status: 'Zetsu, show your face!'},
            {name: "Madara", status: 'Our fight is eternal blood ceremony!'},
            {name: "Deidara", status: "Come on, don't fly away anymore"},
            {name: "Sasori", status: 'Your dolls are the cause of people suffering...'}
        ];

        let arr = [[0, 0], [x, y]];
        let a, b;
        let friendId = 0;
        while (arr.length < 12) {
            a = Math.ceil(Math.random() * 19);
            b = Math.ceil(Math.random() * 19);
            if (!arr.includes([a, b])) {
                arr.push([a, b]);
                this.tiles[a][b].isFriend = true;
                this.tiles[a][b].name = this.friendList[friendId].name;
                friendId += 1;
            }
        }

        let enemyId = 0;
        while (arr.length < 22) {
            a = Math.ceil(Math.random() * 19);
            b = Math.ceil(Math.random() * 19);
            if (!arr.includes([a, b])) {
                arr.push([a, b]);
                this.tiles[a][b].isEnemy = true;
                this.tiles[a][b].name = this.enemyList[enemyId].name;
                enemyId += 1;
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
        const clickedTile = this.tiles[x][y];
        if(clickedTile.isHidden) {
            clickedTile.isHidden = false;
            this.numOfHiddenTiles--;
        }
        clickedTile.draw();
        this.draw();
    };

    this.naruto = (x, y, prevX, prevY) => {
        const currentTile = this.tiles[x][y];
        const prevTile = this.tiles[prevX][prevY];
        if(!currentTile.isNaruto){
            currentTile.isNaruto = true;
        }
        if(prevTile.isNaruto){
            prevTile.isNaruto = false;
        }
    };
}

function Naruto(x, y) {
    this.x = x;
    this.y = y;
    this.stamina = 200;
};

function Game(width, height){
    this.width = width;
    this.height = height;
    this.tileSize = 32;
    const sideBar = new SideBar();
    this.board = new Board(this.width, this.height, this.tileSize);
    this.naruto = new Naruto(0, 0);

    // ===== GAME OVER ===== //

    this.gameOver = (win) => {
        var popup = document.getElementById("musuh");
        var image = popup.children[0];
        image.style.display = "block";
        if (win) {
            image.setAttribute("src", "img/win.gif");
        } else {
            image.setAttribute("src", "img/lose.gif");
        }
        window.removeEventListener("keydown", this.move);
        image.onclick = () => {
            location.reload();
        }
    };

    // ===== MOVE HANDLER ===== //

    this.meetSomeone = (person) => {
        var popup = document.getElementById("musuh");
        var image = popup.children[0];
        image.style.display = "block";
        image.setAttribute("src", "img/" + person.name + ".gif");
        
        image.onclick = () => {
            image.style.display = "none";
            window.addEventListener("keydown", this.move);
            sideBar.updateStatus(person.status);
            sideBar.hideMeetNotif();
        }
    }

    this.move = (e) => {
        this.board.reveal(this.naruto.x, this.naruto.y);

        if (this.board.tiles[this.naruto.x][this.naruto.y].isSasuke) {
            this.gameOver(true);
        }

        if (this.board.tiles[this.naruto.x][this.naruto.y].isEnemy){
            sideBar.showMeetNotif();
            const name = this.board.tiles[this.naruto.x][this.naruto.y].name;
            currentPerson = this.board.enemyList.filter((enemy)=>{
                return enemy['name']===name
            })
            document.getElementById('yesButton').onclick = () => {
                this.naruto.stamina -= 10;
                return this.meetSomeone(currentPerson[0]);
            }
            this.board.tiles[this.naruto.x][this.naruto.y].isEnemy = false;
        }

        if (this.board.tiles[this.naruto.x][this.naruto.y].isFriend){
            sideBar.showMeetNotif();
            const name = this.board.tiles[this.naruto.x][this.naruto.y].name;
            currentPerson = this.board.friendList.filter((friend)=>{
                return friend['name']===name
            })
            document.getElementById('yesButton').onclick = () => {
                this.naruto.stamina += 10;
                return this.meetSomeone(currentPerson[0]);
            }
            this.board.tiles[this.naruto.x][this.naruto.y].isFriend = false;
        }

        if (e.keyCode == '38') {
            if (this.naruto.y > 0) {
                this.naruto.y -= 1;
                this.board.reveal(this.naruto.x, this.naruto.y);
                this.board.naruto(this.naruto.x, this.naruto.y, this.naruto.x, this.naruto.y+1);
            }
        }
        else if (e.keyCode == '40') {
            if (this.naruto.y < 19) {
                this.naruto.y += 1;
                this.board.reveal(this.naruto.x, this.naruto.y);
                this.board.naruto(this.naruto.x, this.naruto.y, this.naruto.x, this.naruto.y-1);
            }
        }
        else if (e.keyCode == '37') {
            if (this.naruto.x > 0) {
                this.naruto.x -= 1;
                this.board.reveal(this.naruto.x, this.naruto.y);
                this.board.naruto(this.naruto.x, this.naruto.y, this.naruto.x+1, this.naruto.y);
            }
        }
        else if (e.keyCode == '39') {
            if (this.naruto.x < 19) {
                this.naruto.x += 1;
                this.board.reveal(this.naruto.x, this.naruto.y);
                this.board.naruto(this.naruto.x, this.naruto.y, this.naruto.x-1, this.naruto.y);
            }
        }
        this.board.tiles[this.naruto.x][this.naruto.y].isHidden = false;
        this.board.draw();
        
        this.naruto.stamina -= 1;
        sideBar.updateHpBar(this.naruto.stamina, 200); // setiap gerak
        sideBar.updateHp(this.naruto.stamina);
        if (this.naruto.stamina < 1) {
            this.gameOver(false);
        }
    };

    // ===== INITIALIZE GAME ===== //

    this.init = () => {
        console.log('start');
        this.show();
        sideBar.show();
        sideBar.initHpBar()
        sideBar.initStatus(this.naruto.stamina, 'I dont know what i have done');
        sideBar.initMeetNotif();
        canvas.width = width * this.tileSize;
        canvas.height = height * this.tileSize;
        window.addEventListener("keydown", this.move);
        
        this.board.init();
        this.board.draw();
    };

    this.show = () => {
        canvas.setAttribute('class', 'layer1');
    }

    this.hide = () => {
        canvas.setAttribute('class', 'layermin2');
    }
}

function SideBar(){
    const layout = document.getElementsByClassName('layout');
    const sideBar = document.createElement('div');
    sideBar.setAttribute('class', 'side-bar layer0');

    const profPic = document.createElement('div');
    profPic.setAttribute('class', 'naruto-side');

    const hpBar = document.createElement('div');
    this.initHpBar = () => {
        hpBar.setAttribute('class', 'progress-circle progress-100 hp-bar');
    }
    this.updateHpBar = (currentHp, maxHp=200) => {
        const percentage = Math.ceil((currentHp/maxHp)*100);
        hpBar.setAttribute('class', `progress-circle progress-${percentage} hp-bar`);
    }

    const statusInfo = document.createElement('div');
    const nameInfo = document.createElement('p');
    const hpInfo = document.createElement('p');
    const statusText = document.createElement('p');
    statusInfo.appendChild(nameInfo);
    statusInfo.appendChild(hpInfo);
    statusInfo.appendChild(statusText);
    this.initStatus = (currentHp, status='Feeling Nothing', maxHp=200, name='Naruto') => {
        statusInfo.setAttribute('class', 'status-info');
        nameInfo.innerHTML = `<strong>Name: ${name}</strong>`;
        hpInfo.innerHTML = `Stamina: <strong>${currentHp}</strong>/${maxHp}`;
        statusText.innerHTML = `Status: ${status}`;
    }
    this.updateHp = (currentHp, maxHp=200) => {
        hpInfo.innerHTML = `Stamina: ${currentHp}/${maxHp}`;
    }
    this.updateStatus = (status='Feeling Nothing') => {
        statusText.innerHTML = `Status: ${status}`;
    }

    const meetNotif = document.createElement('div');
    meetNotif.setAttribute('class', 'meet-notif');
    const meetText = document.createElement('p');
    const yesBtn = document.createElement('button');
    yesBtn.setAttribute('id', 'yesButton');
    yesBtn.addEventListener('click', () =>{
        decision = true;
    });
    const noBtn = document.createElement('button');
    noBtn.addEventListener('click', () =>{
        window.addEventListener("keydown", game.move);
        this.hideMeetNotif();
    });
    meetNotif.appendChild(meetText);
    meetNotif.appendChild(yesBtn);
    meetNotif.appendChild(noBtn);
    this.initMeetNotif = () => {
        meetText.innerHTML = 'You just saw someone, do you want to meet them?'
        yesBtn.innerHTML = 'YES!';
        noBtn.innerHTML = 'NOO!';
        meetText.setAttribute('class', 'hide');
        yesBtn.setAttribute('class', 'hide');
        noBtn.setAttribute('class', 'hide');
    }
    this.showMeetNotif = () => {
        let decision;
        window.removeEventListener("keydown", game.move);
        meetText.setAttribute('class', 'show');
        yesBtn.setAttribute('class', 'show');
        noBtn.setAttribute('class', 'show');
    }
    this.hideMeetNotif = () => {
        meetText.setAttribute('class', 'hide');
        yesBtn.setAttribute('class', 'hide');
        noBtn.setAttribute('class', 'hide');
    }

    sideBar.appendChild(hpBar);
    sideBar.appendChild(profPic);
    sideBar.appendChild(statusInfo);
    sideBar.append(meetNotif);
    layout[0].appendChild(sideBar);
    
    this.show = () => {
        sideBar.setAttribute('class', 'side-bar layer0');
    }

    this.hide = () => {
        sideBar.setAttribute('class', 'side-bar layermin2');
    }
}

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
        this.hide();
    });
    startBtn.appendChild(button);
    
    mainMenu.appendChild(divImg);
    mainMenu.appendChild(welcomeText);
    mainMenu.appendChild(startBtn);
    layout[0].appendChild(mainMenu);

    this.show = () => {
        mainMenu.setAttribute('class', 'main layer0');
    }

    this.hide = () => {
        mainMenu.setAttribute('class', 'main layermin2');
    }
 }

(function(){
    window.onload = () => {
        const main = new MainMenu();
        main.show();
    }
}());
