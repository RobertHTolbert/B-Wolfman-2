window.onload = function() {

    "use strict";
    
    
  var game = new Phaser.Game(1000, 350, Phaser.AUTO, '', { preload: preload, create: create, update: update });

function preload() {
    //  Import assets
    //  game.load.type('name', 'location')
    game.load.image('police', 'assets/police.png');
    game.load.spritesheet('wolfman', 'assets/wolfman.png', 36, 53, 1);
    game.load.image('dummyFloor', 'assets/dummyFloor.png');
    game.load.image('dummyTrapdoor', 'assets/dummyTrapdoor.png');
    game.load.image('dummyWall', 'assets/dummyWall.png');
}

    //  Declare global variables

    var player;
    var cursors;
    var platforms;
    var walls;
    var trapdoors;
    var police;


function create() {
    
    game.physics.startSystem(Phaser.Physics.ARCADE);
    
    //add floors
    platforms = game.add.group();
    platforms.enableBody=true;
    var basement = platforms.create(0, game.world.height-50, 'dummyFloor');
    basement.body.immovable = true;
    var hallway = platforms.create(0, game.world.height-150, 'dummyFloor');
    hallway.body.immovable = true;
    var attic = platforms.create(0, game.world.height-250, 'dummyFloor');
    attic.body.immovable = true;
    
    //add walls
   
    walls = game.add.group();
    walls.enableBody = true;
    var wall1 = walls.create(0,0, 'dummyWall');
    wall1.scale.y = 2;
    wall1.body.immovable = true;
    var wall2 = walls.create(game.world.width-20, 0, 'dummyWall');
    wall2.scale.y = 2;
    wall2.body.immovable = true;
    
    
    //add trapdoors individually for now, in a loop later
    trapdoors=game.add.group();
    trapdoors.enableBody=true;
    var b_plat=trapdoors.create(200, game.world.height-51, 'dummyTrapdoor');
    var h_plat=trapdoors.create(400, game.world.height-151, 'dummyTrapdoor');
    var a_plat=trapdoors.create(800, game.world.height-251, 'dummyTrapdoor');
    
    //add player
    player=game.add.sprite(50,game.world.height-103, 'wolfman');
    game.physics.arcade.enable(player);
    player.body.collideWorldBounds=true;
    
    //add a policeman for now, add an array of them later
    police = game.add.group();
    police.enableBody = true;
    var police1 = police.create(500, game.world.height-200, 'police');
    police1.body.velocity.x = -100;
    var police2 = police.create(200, game.world.height-200, 'police');
    police2.body.velocity.x = 100;
    
    //  Define controls 
    cursors=game.input.keyboard.createCursorKeys();
        
}

function update() {
    
    
    //trapdoor movement
    game.physics.arcade.overlap(player,trapdoors, floorChange, null, this);
    game.physics.arcade.collide(police, walls);
    game.physics.arcade.collide(player, walls);
    
    game.physics.arcade.overlap(player, police, collisionhandler, null, this);
    //DOES NOT WORK
    //is supposed to turn the police around when they hit the walls
    game.physics.arcade.collide(police, walls, reverse, null, this);
    
    //movement
    player.body.velocity.x=0;
    if(cursors.left.isDown){player.body.velocity.x=-150;}
    else if(cursors.right.isDown){player.body.velocity.x=150;}

    
    
}
    
// floorchange function enables working trapdoors
    function floorChange(player){
        var cur = player.body.position.y;
        //basement case
        if (cur==247 && cursors.up.isDown){
            player.body.position.y=147;
        }
        //hallway case
        if (cur==147 && cursors.up.isDown){
            player.body.position.y=47;
        }
        if (cur==147 && cursors.down.isDown){
            player.body.position.y=247;
        }
        //attic case
        if (cur==47 && cursors.down.isDown){
            player.body.position.y=147;
        }
    }
    function collisionhandler(player, police){
        if (isSame(player, police) == true){
        police.kill();
        }
    }
    function reverse(police, walls){
        police.body.velocity.x = -police.body.velocity.x;
    }
    function isSame(player, police){
        if (player.body.velocity.x > 0 && police.body.velocity.x >= 0){
            return true;
        }
        if (player.body.velocity.x < 0 && police.body.velocity.x <= 0){
            return true;
        }
    }
};
