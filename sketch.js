// letiable to hold a reference to our A-Frame world
let world;
let mainMenu;

let menuText;
let textMenuCont;
let textMenu;
let textbgMenu;

let pointsLost = 0;

// let endMenu;
// let endBox;


let ground = [];
let borders = [];

let speed = 0.1;

let beat1;
let beat2;
let beat3;
let beat4;
let conesound;
let torussound;
let boxsound;
let correct;
let wrong;
let dancin;
let soundplay = false;
let skybox;
let skyCanvas;

let xoff = 0.0, yoff = 10000; 
let t = 0;
let colorOffset = 0;

let gameOver = false;

let currentdatetime = new Date();

let startseconds;
let currentseconds;
let duration;


let score = 0;
let textCont;
let text;
let textbg;
let soundButton;

let skyCue = true;

let match = false;

let instruments;

let platform;
let platformXcoord = -30;

let randominstrument = Math.floor(Math.random() * 3);

let playBox;
let playCone;
let playTorus;


let gameState = 0;
let playSong = false;


function sceneChange() {
  if(gameState==0){
    document.getElementById('main').setAttribute('visible', 'false')
    document.getElementById('menu').setAttribute('visible', 'true')
  }
  else if (gameState==1){
    document.getElementById('menu').setAttribute('visible', 'false')
    document.getElementById('main').setAttribute('visible', 'true')
  }
}

function preload() {
  beat1 = loadSound("sounds/beat1.mp3");
  beat2 = loadSound("sounds/beat2.mp3");
  beat3 = loadSound("sounds/beat3.mp3");
  beat4 = loadSound("sounds/beat4.mp3");
  conesound = loadSound("sounds/cone.wav");
  torussound = loadSound("sounds/torus.wav");
  correct = loadSound("sounds/correct.wav");
  wrong = loadSound("sounds/wrong.wav");
  wrong.setVolume(0.01);
  torussound.setVolume(0.1);
  boxsound = loadSound("sounds/box.wav");
  dancin = loadSound("sounds/dancin.mp3");
}

function setup() {
  
  // noCanvas();
  skyCanvas = createCanvas(512,512).id();

  colorMode(RGB);

  world = new World('main');
  world.setBackground(0, 0, 0);
  document.getElementById('main').setAttribute('visible', 'false');

  mainMenu = new World('menu');

  // main menu to game scene transition
  menuBox = new Box({
    x: 0, y: 1, z: -5,
    width: 0.5, height: 0.5, depth: 0.5,
    red: 255, green: 0, blue: 255,
    side: 'double',
    rotationY: 45,
    rotationZ: 30,
    metalness: 0.8,
    clickFunction: function (myBox) {
      console.log("CLICKED");
      gameState = 1;
      gameOver = false;
      platform.speed = 0.1;
      score = 0;
      pointsLost = 0;
      sceneChange();
    }
  });

  mainMenu.add(menuBox);
  

  // add welcome message and game title to main menu scene
  menuText = new Text({
    x: 0, y: 1.5, z: -7,
    text: "Welcome to Tune Up! \n Click the box to start!",
    red: 255, green: 0, blue: 0,
    width: 5,
    height: 5,
    align: "center",
    wrapCount: "40",
    zOffset: 0.5,
    transparent: false,
    opacity: 1,
    side: "double",
    scaleX: 5, scaleY: 5, scaleZ: 5
  });

  // mainMenu.add(menuText);  

  textMenuCont = new Container3D({ x: 0, y: 2, z:0 });
  mainMenu.add(textMenuCont);

  // textMenu = new Text({
	// 	text: 'Score: ' + score,
	// 	red: 255, green: 255, blue: 255,
	// 	side: 'double',
	// 	x: 0, y: 1.5, z: -7,
	// 	scaleX: 10, scaleY: 10, scaleZ: 10
	// });
	// textMenuCont.addChild(textMenu);

  textMenuCont.addChild(menuText);

  // add a black box behind the text
  textbgMenu = new Box({
    x: 0, y: 1.5, z: -7,
    width: 3, height: 0.5, depth: 0.1,
    red: 0, green: 0, blue: 0,
    opacity: 0.3,
  });
  textMenuCont.addChild(textbgMenu);


  skybox = new Box({
    x: 0, y: 0, z: 0,
    width: 1000, height: 1000, depth: 1000,
    asset: skyCanvas,
    red: 255, green: 255, blue: 255,
    side: 'double',
    shader: 'flat',
    dynamicTexture: true,
  });

  world.add(skybox);

  platform = new movingPlatform(0, -0.01, platformXcoord, speed);

  // make 9 boxes in a 3x3 grid on the ground
  for (let x = -1; x <= 1; x++) {
    for (let z = -1; z <= 1; z++) {
      // ground.push(new Tiles(x*3, 0, z*3, null));
      // boxes in the middle of row and column should have beats 1 through 4
      if (x < 0 && z == 0) {
        ground.push(new Tiles(x * 3, 0, z * 3, beat1, 255, 0, 0));
      }
      else if (x > 0 && z == 0) {
        ground.push(new Tiles(x * 3, 0, z * 3, beat2, 0, 0, 255));
      }
      else if (x == 0 && z < 0) {
        ground.push(new Tiles(x * 3, 0, z * 3, beat3, 0, 255, 0));
      }
      else if (x == 0 && z > 0) {
        ground.push(new Tiles(x * 3, 0, z * 3, beat4, 255, 255, 0));
      }
      // boxes in the corners should have no beats
      else {
        ground.push(new Tiles(x * 3, 0, z * 3, null, 0, 0, 0));
      }
    }
  }
  borders.push(new railings(0,0.1,4.8, 0, 0, 255))
  borders.push(new railings(0,0.1,-4.8, 0, 0, 255))
  borders.push(new railings(4.8,0.1,0, 90, 0, 255))
  borders.push(new railings(-4.8,0.1,0, 90, 0, 255))
  
  instruments = new Instruments(0, 0.5, 0);

  let b1 = new Box({
    x: 0, y: 0, z: -2,
    width: 0.3, height: 0.3, depth: 0.3,
    // asset: 'purpbox',
    red: 205, green: 180, blue: 219,
    rotationY: 45,
    rotationZ: 30,
    metalness: 0.8,
    opacity: 0.6,
    enterFunction: function (myBox) {
      instruments.enterFunction(myBox);
    },
    leaveFunction: function (myBox) {
      instruments.leaveFunction(myBox);
    },
    clickFunction: function (myBox) {
      instruments.clickFunction(myBox);
    },
    spin: true,
    sound: boxsound,
    name: "box",
  });

  // // add the box to the instruments
  // // create a second box
  let b2 = new Cone({
    x: -0.8, y: 0, z: -1.2,
    red: 255, green: 175, blue: 204,
    height: 0.3, radiusBottom: 0, radiusTop: 0.15,
    rotationX: 45,
    metalness: 0.8,
    opacity: 0.6,
    enterFunction: function (myBox) {
      instruments.enterFunction(myBox);
    },
    leaveFunction: function (myBox) {
      instruments.leaveFunction(myBox);
    },
    clickFunction: function (myBox) {
      instruments.clickFunction(myBox);
    },
   
    spin: true,
    sound: conesound,
    name: "cone",
  });

  let b3 = new Torus({
    x: 0.8, y: 0, z: -1.2,
    radius: 0.1, radiusTubular: 0.02,
    red: 162, green: 210, blue: 255,
    metalness: 0.8,
    opacity: 0.6,
    enterFunction: function (myBox) {
      instruments.enterFunction(myBox);
    },
    leaveFunction: function (myBox) {
      instruments.leaveFunction(myBox);
    },
    clickFunction: function (myBox) {
      instruments.clickFunction(myBox);
    },
    
    spin: true,
    sound: torussound,
    name: "torus",
  });

  //   // add the box to the instruments
  instruments.addObj(b1);
  instruments.addObj(b2);
  instruments.addObj(b3);
  //   instruments.addChild(b3);
  //   instruments.addChild(b4);
  for (let i = 0; i < instruments.children.length; i++) {
    instruments.children[i].spin = true;
  }
  instruments.children[0].sound = boxsound;
  instruments.children[0].name = "box";
  instruments.children[1].sound = conesound;
  instruments.children[1].name = "cone";
  instruments.children[2].sound = torussound;
  instruments.children[2].name = "torus";

  textCont = new Container3D({ x: 0, y: 2, z:0 });
  world.add(textCont);

  text = new Text({
		text: 'Score: ' + score,
		red: 255, green: 255, blue: 255,
		side: 'double',
		x: 0, y: 1.5, z: -7,
		scaleX: 10, scaleY: 10, scaleZ: 10
	});
	textCont.addChild(text);

  // add a black box behind the text
  textbg = new Box({
    x: 0, y: 1.5, z: -7,
    width: 3, height: 0.5, depth: 0.1,
    red: 0, green: 0, blue: 0,
    opacity: 0.3,
  });
  textCont.addChild(textbg);

  instrumentPlayContainer = new Container3D({ x: 0, y: 0, z:0 });
  
  playBox = new Box({
    x: 0, y: 0, z: -6,
    width: 0.3, height: 0.3, depth: 0.3,
    red: 205, green: 180, blue: 219,
    rotationY: 45,
    rotationZ: 45,
    metalness: 0.8,
    visible: false,
     opacity: 0.6,
     scaleX: 1.5, scaleY: 1.5, scaleZ: 1.5,
  });

  playCone = new Cone({
    x: 0, y: 0, z: -6,
    red: 255, green: 175, blue: 204,
    height: 0.3, radiusBottom: 0, radiusTop: 0.15,
    rotationX: 45,
    rotationZ: 45,
    metalness: 0.8,
    visible: false,
    opacity: 0.6,
    scaleX: 1.5, scaleY: 1.5, scaleZ: 1.5,
  });
  playTorus = new Torus({
    	x: 0, y: 0, z: -6,
    radius: 0.1, radiusTubular: 0.02,
    red: 162, green: 210, blue: 255,
    metalness: 0.8,
    visible: false,
     opacity: 0.6,
      scaleX: 1.5, scaleY: 1.5, scaleZ: 1.5,
  });
  
  instrumentPlayContainer.addChild(playBox);
  instrumentPlayContainer.addChild(playCone);
  instrumentPlayContainer.addChild(playTorus);
  textCont.addChild(instrumentPlayContainer);
  
  world.setUserPosition(0, 1, 0);
}


function draw() {
  background(0, 0, 0, 50);
  for(let i = 0; i < width; i+=5) {
    for(let j = 0; j < height; j+=5) {
    
    if (skyCue) {
      // more purple sky
      fill((colorOffset + noise(i / 100, j / 100, t) * 360) %360, 40, 150);
      //(199,36,177)
    }
    else{
      fill((colorOffset + noise(i / 100, j / 100, t) * 360) %360, 70, 90);
    }
    noStroke();
    rect(i, j, 5, 5);
    }
  }  t = t + 0.003;
  colorOffset += 5;

  currentdatetime = new Date();
  currentseconds = currentdatetime.getTime() / 1000;

  duration = currentseconds - startseconds;

  if (gameState == 1) {
    menuText.setText("Press to restart");
    gameplayScreen();   
  }
}

function gameplayScreen() {
  if (playSong == false) {
    startseconds = currentdatetime.getTime() / 1000;
    dancin.loop();
    dancin.setVolume(0.1);
    playSong = true;
  }

  platform.speed += 0.0007;

  if (duration % 5 < 0.1 && gameOver == false) {
    startseconds = currentseconds-0.11;
    randominstrument = Math.floor(Math.random() * 3);
  }

  if (randominstrument == 0) {
    playBox.show();
    playCone.hide()
    playTorus.hide()
  }
  else if (randominstrument == 1) {
    playBox.hide()
    playCone.show()
    playTorus.hide()
  }
  else if (randominstrument == 2) {
    playBox.hide()
    playCone.hide()
    playTorus.show()
  }
  else {
    playBox.hide()
    playCone.hide()
    playTorus.hide()
  }

  if (duration > (3.14 * 60)){
    dancin.stop();
  }
  
  let userPos = world.getUserPosition();

  platform.move();
  match = platform.checkColors()
  if (!match) {
    // textCont.setOpacity(1);
    textCont.setGreen(0);
    textCont.setRed(255); 
    // console.log("Wrong Tile");
  }
  else {
    textCont.setRed(0);
    textCont.setGreen(255);
  }


  checkEdges();

  instruments.followUser();
  instruments.spin();

  // in instruments list, set all the boxes to spin

  
  textCont.setPosition(userPos.x, 3, userPos.z);
  text.setText("Score: " + score);
  
  let userRot = world.getUserRotation();
  let rotY = userRot.y * 180/3.142 //converstion from rad to degree - IMPORTANT
  textCont.setRotation(0, rotY, 0);


  if (score < 0 || pointsLost > 1) {
    text.setText("Last Chance!");
  }
  if (score < -1 || pointsLost > 2) {
    text.setText("You Lose!");
    gameOver = true;
    sceneChange();
  }
  if (score > 20) {
    text.setText("You Win!");
    noLoop();
    gameOver = true;
  }

  if (gameOver) {
    dancin.stop();
    platform.speed = 0;
    if (duration > 4) {
      gameState = 0;
      sceneChange();
    }
  }

}

class movingPlatform {
  constructor(x, y, z, speed) {
    this.speed = speed;
    this.myBox = new Plane({
      x: x, y: y, z: z,
      width: 9, height: 9, depth: 1,
      asset: 'purpbox',
      red: 255,
      green: 0,
      blue: 0,
      rotationX: -90, metalness: 0.25,
      checkcolors: true,
    });
    world.add(this.myBox);
  }

  move() {
    let mpz = this.myBox.z;
    if (mpz < 0) {
      this.myBox.setPosition(0, -0.01, mpz + this.speed);
    }
    if (mpz >= 0) {
      this.myBox.setPosition(0, -0.01, platformXcoord);
      let randp = Math.floor(Math.random() * 4);
      if (gameOver == false){
        if (match) {
          score += 1;
          pointsLost = 0;
          for(let i=0; i<4;i++){
            borders[i].setcolorgreen();
          }
          skyCue = true;
          correct.play();
          if (dancin.isPlaying() == false) {
            dancin.play();
          }
        }
        else{
          score -= 1;
          pointsLost += 1;
          for(let i=0; i<4;i++){
            borders[i].setcolorred();
          }
          skyCue = false;
          if (wrong.isPlaying() == false && dancin.isPlaying() == true) {
            wrong.play();
          }
          dancin.pause();
        }
      }
      else {
        skyCue = false;
      }
      if (randp == 0) {
        this.myBox.setRed(255);
        this.myBox.setGreen(0);
        this.myBox.setBlue(0);
      }
      else if (randp == 1) {
        this.myBox.setRed(0);
        this.myBox.setGreen(255);
        this.myBox.setBlue(0);
      }
      else if (randp == 2) {
        this.myBox.setRed(0);
        this.myBox.setGreen(0);
        this.myBox.setBlue(255);
      }
      else {
        this.myBox.setRed(255);
        this.myBox.setGreen(255);
        this.myBox.setBlue(0);
      }
    }
  }

  checkColors() {
    let userPos = world.getUserPosition();
    // let mpz = this.myBox.z;
    if (this.myBox.getRed() == 255 && this.myBox.getGreen() == 0 && this.myBox.getBlue() == 0) {
      // soundplay = true;
      if (userPos.x > -4.5 && userPos.z > -1.5 && userPos.x < -1.5 && userPos.z < 1.5) {
        return true;
      }
      else {  
        return false;
      }
    }
    else if (this.myBox.getRed() == 0 && this.myBox.getGreen() == 255 && this.myBox.getBlue() == 0) {
      // soundplay = true;
      if (userPos.x > -1.5 && userPos.z > -4.5 && userPos.x < 1.5 && userPos.z < -1.5) {
        return true;
      }
      else {
        return false;
      }
    }
    else if (this.myBox.getRed() == 0 && this.myBox.getGreen() == 0 && this.myBox.getBlue() == 255) {
      // soundplay = true;
      if (userPos.x > 1.5 && userPos.z > -1.5 && userPos.x < 4.5 && userPos.z < 1.5) {
        return true;
      }
      else {
        return false;
      }
    }
    else if (this.myBox.getRed() == 255 && this.myBox.getGreen() == 255 && this.myBox.getBlue() == 0) {
      // soundplay = true;
      if (userPos.x > -1.5 && userPos.z > 1.5 && userPos.x < 1.5 && userPos.z < 4.5) {
        return true;
      }
      else {
        return false;
      }
    }
    // return true;
  }
}

function checkEdges() {
  let userPos = world.getUserPosition();
  let currX = userPos.x;
  let currZ = userPos.z;

  if (userPos.x < -4.5) {
    world.setUserPosition(-4.5, 1, currZ);
  }
  else if (userPos.x > 4.5) {
    world.setUserPosition(4.5, 1, currZ);
  }
  else if (userPos.z < -4.5) {
    world.setUserPosition(currX, 1, -4.5);
  }
  else if (userPos.z > 4.5) {
    world.setUserPosition(currX, 1, 4.5);
  }
}

class Tiles {
  constructor(x, y, z, sound, colorR, colorG, colorB) {

    this.myBox = null;

    if (sound == null) {
      this.myBox = new Plane({
        x: x, y: y, z: z,
        width: 3, height: 3, depth: 3,
        asset: 'purpbox',
        rotationX: -90, metalness: 0.25
      });
    }
    else {
      this.myBox = new Plane({
        x: x, y: y, z: z,
        width: 3, height: 3, depth: 1,
        asset: 'purpbox',
        red: colorR,
        green: colorG,
        blue: colorB,
        rotationX: -90, metalness: 0.25
      });
    }

    world.add(this.myBox);
    this.sound = sound;
  }

  // playSound() {

  //   if (this.sound != null) {
  //     let userPos = world.getUserPosition();

  //     let dist = sqrt(pow(userPos.x - this.myBox.getX(), 2) + pow(userPos.z - this.myBox.getZ(), 2));

  //     if (dist < 1.5) {
  //       if (this.sound.isPlaying() == false && this.sound != null) { //
  //         this.sound.loop();
  //       }
  //     }
  //     // if the user is not within 1.5 units of the box, stop the sound
  //     else {
  //       this.sound.stop();
  //     }
  //   }
  // }
}


class Instruments {
  constructor(x, y, z) {
    this.container = new Container3D({ x: x, y: y, z: z });
    this.children = []
    world.add(this.container);
  }

  addObj(obj) {
    this.container.addChild(obj);
    this.children.push(obj);
  }
  followUser() {
    let userPos = world.getUserPosition();

    // demon follows user
    let dX = this.container.x;
    let dY = this.container.y;
    let dZ = this.container.z;

    let uX = userPos.x;
    let uY = userPos.y;
    let uZ = userPos.z;

    let dXdiff = dX - uX;
    let dYdiff = dY - uY;
    let dZdiff = dZ - uZ;

    let dXnew = dX - dXdiff / 15;
    let dYnew = dY - dYdiff / 15;
    let dZnew = dZ - dZdiff / 15;

    this.container.setPosition(dXnew, dY, dZnew);
  }


  // make all the objects have a slight spin 
  spin() {
    for (let i = 0; i < this.children.length; i++) {
      if (this.children[i].spin == true) {
        this.children[i].spinX(0.5);
        this.children[i].spinY(0.8);
        this.children[i].spinZ(1.2);
      }

    }
  }

  enterFunction(obj) {
    for (let i = 0; i < this.children.length; i++) {
      if (this.children[i] == obj) {
        this.children[i].spin = false;
        this.children[i].setOpacity(1);
        this.children[i].setScale(1.2,1.2,1.2);
      }
    }
  }

  leaveFunction(obj) {
    for (let i = 0; i < this.children.length; i++) {
      if (this.children[i] == obj) {
        this.children[i].setOpacity(0.6);
        this.children[i].spin = true;
        this.children[i].setScale(1,1,1);
      }
    }
  }

  clickFunction(obj) {
    for (let i = 0; i < this.children.length; i++) {
      if (this.children[i] == obj) {
        // console.log("clicked", this.children[i]);
        this.children[i].sound.play();
        if (obj.name == "cone" && randominstrument == 1){
          randominstrument = -1;
          // console.log("correct");
          pointsLost = 0;
          score += 1;
        }
        else if (obj.name == "torus" && randominstrument == 2){
          randominstrument = -1;
          // console.log("correct");
          pointsLost = 0;
          score += 1;
        }
        else if (obj.name == "box" && randominstrument == 0){
          randominstrument = -1;
          // console.log("correct");  
          pointsLost = 0;
          score += 1;
        }
      }
    }
  }
}

class railings {
	constructor(x,y,z,rot, r, g) {
		this.cylinder = new Cylinder({
      x:x, 
      y:y, 
      z:z, 
      red:r, 
      green:g, 
      blue:0,
      scaleX: 0.06, scaleY: 4.8, scaleZ: 0.06,
      rotationZ:90, rotationY:rot,
    });
    this.cg = g;
    this.cr = r;
	world.add(this.cylinder);
	}
  setcolorred(){
      this.cr=255;
      this.cg=0;
      this.cylinder.setRed(this.cr);
      this.cylinder.setGreen(this.cg);
  }
  setcolorgreen(){
      this.cr=0;
      this.cg=255;
      this.cylinder.setRed(this.cr);
      this.cylinder.setGreen(this.cg);
  }
}

function keyPressed(){
  let userPos = world.getUserPosition();
  let currX = userPos.x;
  let currZ = userPos.z;
  if (keyCode === 76) {
    // world.setUserPosition(currX+3, 1, currZ);
    world.setUserPosition(3, 1, 0);
  } else if (keyCode === 74) {
    // world.setUserPosition(currX-3, 1, currZ);
    world.setUserPosition(-3, 1, 0);
  } else if (keyCode === 73) {
    // world.setUserPosition(currX, 1, currZ-3);
    world.setUserPosition(0, 1, -3);
  } else if (keyCode === 75) {
    // world.setUserPosition(currX, 1, currZ+3);
    world.setUserPosition(0, 1, 3);
  }
}