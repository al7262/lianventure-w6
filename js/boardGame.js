(function () {
    const canvas = document.getElementById('canvas'),
        context = canvas.getContext('2d'),

        tileSprite = new Image(),
        narutoSprite = new Image(),
        bgSprite = new Image(),
        homeSprite = new Image();
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
            
            let x = Math.ceil(Math.random() * 19);
            let y = Math.ceil(Math.random() * 19);
            this.tiles[x][y].isSasuke = true;

            let friendList = [
                {name: "Sakura"},
                {name: "Hinata"},
                {name: "Lee"},
                {name: "Kakashi"},
                {name: "Shikamaru"},
                {name: "Kiba"},
                {name: "Neji"},
                {name: "Shino"},
                {name: "Choji"},
                {name: "Ino"}
            ];

            let enemyList = [
                {name: "Hidan"},
                {name: "Kakuzu"},
                {name: "Kisame"},
                {name: "Pein"},
                {name: "Kabuto"},
                {name: "Orochimaru"},
                {name: "Zetsu"},
                {name: "Madara"},
                {name: "Deidara"},
                {name: "Sasori"}
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
                    this.tiles[a][b].name = friendList[friendId].name;
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
                    this.tiles[a][b].name = enemyList[enemyId].name;
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
        }

        this.naruto = (x, y, prevX, prevY) => {
            const currentTile = this.tiles[x][y];
            const prevTile = this.tiles[prevX][prevY];
            if(!currentTile.isNaruto){
                currentTile.isNaruto = true;
            }
            if(prevTile.isNaruto){
                prevTile.isNaruto = false;
            }
        }
    };

    function Naruto(x, y) {
        this.x = x;
        this.y = y;
        this.stamina = 100;
    };

    function Game(width, height){
        this.width = width;
        this.height = height;
        this.tileSize = 32;
        this.board = new Board(this.width, this.height, this.tileSize);
        this.naruto = new Naruto(0, 0);

        // ===== GAME OVER ===== //

        this.gameOver = (win) => {
            if (win) {
                alert("YOU WIN");
            } else {
                alert("YOU LOSE");
            }

            window.removeEventListener("keydown", this.move);
        };

        // ===== MOVE HANDLER ===== //

        this.move = (e) => {
            this.board.reveal(this.naruto.x, this.naruto.y);

            if (this.board.tiles[this.naruto.x][this.naruto.y].isSasuke) {
                alert("SASKEHHHHH!!!!!!");
                this.gameOver(true);
            }
            if (this.board.tiles[this.naruto.x][this.naruto.y].isFriend) {
                alert(this.board.tiles[this.naruto.x][this.naruto.y].name);
                this.naruto.stamina += 10;
            }
            if (this.board.tiles[this.naruto.x][this.naruto.y].isEnemy) {
                alert(this.board.tiles[this.naruto.x][this.naruto.y].name);
                this.naruto.stamina -= 10;
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
            if (this.naruto.stamina < 1) {
                alert("MODYARRRRR!!!!");
                this.gameOver(false);
            }
        };

        // ===== INITIALIZE GAME ===== //

        this.init = () => {
            canvas.width = width * this.tileSize;
            canvas.height = height * this.tileSize;

            window.addEventListener("keydown", this.move);

            this.board.init();
            this.board.draw();
        };
    };

    window.onload = () => {
        console.log('start');
        const game = new Game(20, 20);
        game.init();
        
    }
}());