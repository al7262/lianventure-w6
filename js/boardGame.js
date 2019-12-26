(function () {
    const canvas = document.getElementById('canvas'),
        context = canvas.getContext('2d'),

        tileSprite = new Image(),
        narutoSprite = new Image();
    tileSprite.src = 'img/treeTile.png';
    narutoSprite.src = 'img/narutoTile.png';
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
            }

            if(!this.hidden){
                if(this.isNaruto) {
                    context.drawImage(narutoSprite, x, y);
                } 
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
    };

    function Game(width, height){
        this.width = width;
        this.height = height;
        this.tileSize = 32;
        this.board = new Board(this.width, this.height, this.tileSize);
        this.naruto = new Naruto(5, 5);

        // ===== MOVE HANDLER ===== //

        this.move = (e) => {
            this.board.naruto(5,5,4,4)
            this.board.reveal(this.naruto.x, this.naruto.y);
            // this.board.tiles[this.naruto.x][this.naruto.y+1].draw();
            
            if (e.keyCode == '38') {
                this.naruto.y -= 1;
                this.board.reveal(this.naruto.x, this.naruto.y);
                this.board.naruto(this.naruto.x, this.naruto.y, this.naruto.x, this.naruto.y+1);
                // this.board.tiles[this.naruto.x][this.naruto.y+1].draw();
            }
            else if (e.keyCode == '40') {
                this.naruto.y += 1;
                this.board.reveal(this.naruto.x, this.naruto.y);
                this.board.naruto(this.naruto.x, this.naruto.y, this.naruto.x, this.naruto.y-1);
                // this.board.tiles[this.naruto.x][this.naruto.y-1].draw();
            }
            else if (e.keyCode == '37') {
                this.naruto.x -= 1;
                this.board.reveal(this.naruto.x, this.naruto.y);
                this.board.naruto(this.naruto.x, this.naruto.y, this.naruto.x+1, this.naruto.y);
                // this.board.tiles[this.naruto.x+1][this.naruto.y].draw();
            }
            else if (e.keyCode == '39') {
                this.naruto.x += 1;
                this.board.reveal(this.naruto.x, this.naruto.y);
                this.board.naruto(this.naruto.x, this.naruto.y, this.naruto.x-1, this.naruto.y);
                // this.board.tiles[this.naruto.x-1][this.naruto.y].draw();
            }
            this.board.tiles[this.naruto.x][this.naruto.y].isHidden = false;
            // this.board.tiles[this.naruto.x][this.naruto.y].draw();
            this.board.draw();

        };

        // ===== INITIALIZE GAME ===== //

        this.init = () => {
            canvas.width = width * this.tileSize;
            canvas.height = height * this.tileSize;

            // canvas.removeEventListener("mousedown", this.init);
            window.addEventListener("keydown", this.move); // OPTIONS = FALSE ?

            this.board.init();
            this.board.draw();
            // tileSprite.onload = () => {
            //     this.board.draw()
            // };
        };
    };

    window.onload = () => {
        console.log('start');
        const game = new Game(20, 20);
        game.init();
        
    }
}());