// 角色設定：載入圖片資源
let backgroundImg;
let walkSprite, jumpSprite, attackSprite, boomSprite;
let driveSprite, driveJumpSprite, driveAttackSprite, fufuSprite;
let leftCharacter, rightCharacter;
let leftHealth = 100, rightHealth = 100;

function preload() {
  backgroundImg = loadImage("backgroup.jpg");

  walkSprite = loadImage("walk.png");
  jumpSprite = loadImage("jamp.png");
  attackSprite = loadImage("attack.png");
  boomSprite = loadImage("boom.png");

  driveSprite = loadImage("drive.png");
  driveJumpSprite = loadImage("jumpp.png");
  driveAttackSprite = loadImage("atttck.png");
  fufuSprite = loadImage("Fufu.png");
}

// 設定兩個角色的基本資料
function setup() {
  createCanvas(windowWidth, windowHeight);
  textFont("sans-serif");
  textSize(20);
  textAlign(LEFT, TOP);

  initializeGame();
}

function draw() {
  // 繪製背景與文字
  image(backgroundImg, 0, 0, width, height);
  fill(255, 182, 193, 128);
  textSize(100);
  textAlign(CENTER, CENTER);
  text("淡江教科", width / 2, height / 2);

  // 繪製遊戲說明
  fill(255);
  textSize(20);
  textAlign(LEFT, TOP);
  text("玩法：\n左角色: W跳, A左, D右, S攻擊\n右角色: ↑跳, ←左, →右, ↓攻擊\n按R重新遊玩", 10, 10);

  // 畫出生命值
  fill(255, 0, 0);
  rect(50, 120, leftHealth * 2, 20);
  rect(width - 250, 50, rightHealth * 2, 20);

  stroke(0);
  noFill();
  rect(50, 120, 200, 20);
  rect(width - 250, 50, 200, 20);
  noStroke();

  // 顯示角色
  leftCharacter.display();
  rightCharacter.display();

  // 更新角色狀態
  leftCharacter.update();
  rightCharacter.update();

  // 判斷勝負
  if (leftHealth <= 0 || rightHealth <= 0) {
    textAlign(CENTER, CENTER);
    textSize(50);
    fill(255);
    text(leftHealth <= 0 ? "右方勝利！" : "左方勝利！", width / 2, height / 2);
    noLoop();
  }
}

// 鍵盤控制
function keyPressed() {
  // 按下 R 重置遊戲
  if (key === 'R' || key === 'r') {
    initializeGame();
    loop();
  }

  // 左角色控制
  if (key === 'A' || key === 'a') {
    leftCharacter.vx = -5;
  } else if (key === 'D' || key === 'd') {
    leftCharacter.vx = 5;
  } else if (key === 'W' || key === 'w') {
    if (!leftCharacter.isJumping) {
      leftCharacter.vy = -15;
      leftCharacter.isJumping = true;
    }
  } else if (key === 'S' || key === 's') {
    leftCharacter.isAttacking = true;
    checkCollision(leftCharacter, rightCharacter);
  }

  // 右角色控制
  if (keyCode === LEFT_ARROW) {
    rightCharacter.vx = -5;
  } else if (keyCode === RIGHT_ARROW) {
    rightCharacter.vx = 5;
  } else if (keyCode === UP_ARROW) {
    if (!rightCharacter.isJumping) {
      rightCharacter.vy = -15;
      rightCharacter.isJumping = true;
    }
  } else if (keyCode === DOWN_ARROW) {
    rightCharacter.isAttacking = true;
    checkCollision(rightCharacter, leftCharacter);
  }
}

function keyReleased() {
  // 左角色停止移動
  if (key === 'A' || key === 'a' || key === 'D' || key === 'd') {
    leftCharacter.vx = 0;
  }

  // 左角色停止攻擊
  if (key === 'S' || key === 's') {
    leftCharacter.isAttacking = false;
  }

  // 右角色停止移動
  if (keyCode === LEFT_ARROW || keyCode === RIGHT_ARROW) {
    rightCharacter.vx = 0;
  }

  // 右角色停止攻擊
  if (keyCode === DOWN_ARROW) {
    rightCharacter.isAttacking = false;
  }
}

// 判斷碰撞與扣血
function checkCollision(attacker, defender) {
  let attackerCenterX = attacker.x + attacker.walkImg.width / attacker.walkFrames / 2;
  let defenderCenterX = defender.x + defender.walkImg.width / defender.walkFrames / 2;

  if (abs(attackerCenterX - defenderCenterX) < 50) {
    if (attacker === leftCharacter) {
      rightHealth -= 10;
    } else {
      leftHealth -= 10;
    }
  }
}

// 初始化遊戲(結束重新)
function initializeGame() {
  leftCharacter = new Character(100, height - 150, walkSprite, jumpSprite, attackSprite, boomSprite, 4, 5, 5, 6);
  rightCharacter = new Character(width - 200, height - 150, driveSprite, driveJumpSprite, driveAttackSprite, fufuSprite, 6, 12, 3, 4);
  leftHealth = 100;
  rightHealth = 100;
}

// 角色類別
class Character {
  constructor(x, y, walkImg, jumpImg, attackImg, projectileImg, walkFrames, jumpFrames, attackFrames, projectileFrames) {
    this.x = x;
    this.y = y;
    this.vx = 0;
    this.vy = 0;

    this.walkImg = walkImg;
    this.jumpImg = jumpImg;
    this.attackImg = attackImg;
    this.projectileImg = projectileImg;

    this.walkFrames = walkFrames;
    this.jumpFrames = jumpFrames;
    this.attackFrames = attackFrames;
    this.projectileFrames = projectileFrames;

    this.currentFrame = 0;
    this.frameDelay = 5;
    this.frameCounter = 0;

    this.isJumping = false;
    this.isAttacking = false;
  }

  display() {
    this.frameCounter++;
    if (this.frameCounter >= this.frameDelay) {
      this.currentFrame = (this.currentFrame + 1) % this.walkFrames;
      this.frameCounter = 0;
    }

    if (this.isJumping) {
      let frameWidth = this.jumpImg.width / this.jumpFrames;
      image(this.jumpImg, this.x, this.y, frameWidth, this.jumpImg.height, this.currentFrame * frameWidth, 0, frameWidth, this.jumpImg.height);
    } else if (this.isAttacking) {
      let frameWidth = this.attackImg.width / this.attackFrames;
      image(this.attackImg, this.x, this.y, frameWidth, this.attackImg.height, this.currentFrame * frameWidth, 0, frameWidth, this.attackImg.height);
    } else {
      let frameWidth = this.walkImg.width / this.walkFrames;
      image(this.walkImg, this.x, this.y, frameWidth, this.walkImg.height, this.currentFrame * frameWidth, 0, frameWidth, this.walkImg.height);
    }
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;

    if (this.y < height - 150) {
      this.vy += 1; // Gravity
    } else {
      this.vy = 0;
      this.y = height - 150;
      this.isJumping = false;
    }
  }
}
