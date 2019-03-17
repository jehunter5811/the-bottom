document.addEventListener("DOMContentLoaded", function(event) {
  document.getElementById('signin-button').addEventListener('click', function(event) {
    event.preventDefault()
    blockstack.redirectToSignIn()
  })
  document.getElementById('signout-button-game').addEventListener('click', function(event) {
    event.preventDefault()
    blockstack.signUserOut(window.location.href)
  })

  function showProfile(profile) {
    // var person = new blockstack.Person(profile)
    // document.getElementById('heading-name').innerHTML = person.name() ? person.name() : "Nameless Person"
    // if(person.avatarUrl()) {
    //   document.getElementById('avatar-image').setAttribute('src', person.avatarUrl())
    // }
    // document.getElementById('section-1').style.display = 'none'
    // document.getElementById('section-2').style.display = 'none'
    document.getElementsByClassName('site-wrapper')[0].style.display = "none";
    document.getElementById('game-wrapper').style.display = "block";
    loadGame()
  }

  function loadGame() {
    // document.getElementById('start-game-btn').style.display = "none";
    var config = {
        type: window.Phaser.AUTO,
        width: 800,
        height: 600,
        physics: {
          default: 'arcade',
          arcade: {
              gravity: { y: 300 },
              debug: false
          }
      },
        scene: {
            preload: preload,
            create: create,
            update: update
        }
    };

    var game = new window.Phaser.Game(config);
  }


  function preload ()
  {
      this.load.image('sky', 'assets/sky.png');
      this.load.image('ground', 'assets/platform.png');
      this.load.image('star', 'assets/star.png');
      this.load.image('bomb', 'assets/bomb.png');
      this.load.spritesheet('dude',
          'assets/dude.png',
          { frameWidth: 32, frameHeight: 48 }
      );
  }

function create ()
{
  //Sky
  this.add.image(400, 300, 'sky');

  //Platforms
  platforms = this.physics.add.staticGroup();

  platforms.create(400, 568, 'ground').setScale(2).refreshBody();

  platforms.create(600, 400, 'ground');
  platforms.create(50, 250, 'ground');
  platforms.create(750, 220, 'ground');

  //Player
  player = this.physics.add.sprite(100, 450, 'dude');

  player.setBounce(0.2);
  player.setCollideWorldBounds(true);

  this.anims.create({
      key: 'left',
      frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
      frameRate: 10,
      repeat: -1
  });

  this.anims.create({
      key: 'turn',
      frames: [ { key: 'dude', frame: 4 } ],
      frameRate: 20
  });

  this.anims.create({
      key: 'right',
      frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
      frameRate: 10,
      repeat: -1
  });

  //controls
  cursors = this.input.keyboard.createCursorKeys();

  this.physics.add.collider(player, platforms);
}

function update ()
{
    if (cursors.left.isDown)
    {
        player.setVelocityX(-160);

        player.anims.play('left', true);
    }
    else if (cursors.right.isDown)
    {
        player.setVelocityX(160);

        player.anims.play('right', true);
    }
    else
    {
        player.setVelocityX(0);

        player.anims.play('turn');
    }

    if (cursors.up.isDown && player.body.touching.down)
    {
        player.setVelocityY(-330);
    }
}

  if (blockstack.isUserSignedIn()) {
    var profile = blockstack.loadUserData().profile
      showProfile(profile)
  } else if (blockstack.isSignInPending()) {
    blockstack.handlePendingSignIn().then(function(userData) {
      window.location = window.location.origin
    })
  }
})
