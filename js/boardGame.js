(function () {
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
            canvas.width = width * this.tileSize;
            canvas.height = height * this.tileSize;
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