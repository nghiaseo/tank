const tankSize = 64;
const bulletSize = 64;
const tankStyle = "Hull_02.png";
const gunStyle = "Gun_07.png";
var enemy = [];
var eBullet = []
var enemyId = 0;
var score = 0;
var ebs = 8;
const enemySpeed = 2;
const mySpeed = 4;
class Tank {
  constructor(pos, id) {
    $("#" + id).css({
      position: "absolute",
      left: pos.x + "px",
      top: pos.y + "px",
      width: tankSize + "px",
      height: tankSize + "px",
      "background-image": 'url("assets/' + tankStyle + '")',
      "background-size": "cover",
    });
    switch (pos.dir) {
      case "up":
        $("#" + id).css("transform", "rotate(0deg)");
        break;
      case "down":
        $("#" + id).css("transform", "rotate(-180deg)");
        break;
      case "left":
        $("#" + id).css("transform", "rotate(-90deg)");
        break;
      case "right":
        $("#" + id).css("transform", "rotate(90deg)");
    }
    $("#" + id).append(
      '<img class="gun" src="assets/' + gunStyle + '" alt="gun"></img>'
    );
    this.destroyed = false;
    this.firing = false;
    this.pos = pos;
    this.id = id;
    this.speed = enemySpeed;
    this.bullet = {
      speed:ebs,
      x: Number,
      y: Number,
      dir: String,
    };
  }
}

//----summon enemy----------------
function summon() {
let x = Math.floor(Math.random()*900)
  let pos = {
    x: x,
    y: 0,
    dir: "down",
  };
  let id = "e" + enemyId++;

  $("#bf").append("<div id='" + id + "' class='enemy'></div>");
  enemy.push(new Tank(pos, id));
  
}

//----------------------------------
var border = {};
border.R = 908;
border.L = 0;
border.B = 656;
border.T = 0;
var tank = {
  x: 450,
  y: 600,
  speed: mySpeed,
  element: document.getElementById("mytank"),
  dir: "up",
};
var bullet = {
  speed: 8,
  x: 0,
  y: 0,
  dir: "up",
};
var gunSize = 42;
var firing = false;
var keys = {};
keys.UP = 38;
keys.LEFT = 37;
keys.RIGHT = 39;
keys.DOWN = 40;
document.addEventListener("keyup", f);
document.addEventListener("keydown", f);
function f(e) {
  var kc = e.keyCode;
  keys[kc] = e.type == "keydown";
  if (kc == 32 && e.type == "keydown" && !firing) fire();
}
function fire() {
  
  firing = true;
  $("#bf").append("<div class='bullet'></div>");
  if (tank.dir == "up") {
    $(".bullet").css("transform", "rotate(0deg)");
    bullet.dir = "up";
    bullet.x = tank.x;
    bullet.y = tank.y - gunSize;
    $(".bullet").css("left", bullet.x + "px");
    $(".bullet").css("top", bullet.y + "px");
  }
  if (tank.dir == "down") {
    $(".bullet").css("transform", "rotate(-180deg)");
    bullet.dir = "down";
    bullet.x = tank.x;
    bullet.y = tank.y + gunSize;
    $(".bullet").css("left", bullet.x + "px");
    $(".bullet").css("top", bullet.y + "px");
  }
  if (tank.dir == "left") {
    $(".bullet").css("transform", "rotate(-90deg)");
    bullet.dir = "left";
    bullet.x = tank.x - gunSize;
    bullet.y = tank.y;
    $(".bullet").css("left", bullet.x + "px");
    $(".bullet").css("top", bullet.y + "px");
  }
  if (tank.dir == "right") {
    $(".bullet").css("transform", "rotate(90deg)");
    bullet.dir = "right";
    bullet.x = tank.x + gunSize;
    bullet.y = tank.y;
    $(".bullet").css("left", bullet.x + "px");
    $(".bullet").css("top", bullet.y + "px");
  }
}

moveTank = function (dx, dy) {
  if (tank.x <= border.R && tank.x >= border.L) tank.x += dx * tank.speed;
  else if (tank.x < border.L) tank.x = border.L;
  else tank.x = border.R;
  if (tank.y <= border.B && tank.y >= border.T) tank.y += dy * tank.speed;
  else if (tank.y < border.T) tank.y = border.T;
  else tank.y = border.B;
  tank.element.style.left = tank.x + "px";
  tank.element.style.top = tank.y + "px";
};
//--- checkhit-----------------
hit = function () {
  x = bullet.x + bulletSize / 2;
  y = bullet.y + bulletSize / 2;
  if (enemy.length > 0)
    for (let index = 0; index < enemy.length; index++)
      if (
        x > enemy[index].pos.x &&
        x < enemy[index].pos.x + tankSize &&
        y > enemy[index].pos.y &&
        y < enemy[index].pos.y + tankSize
      ) {
        $("#" + enemy[index].id).remove();
        enemy[index].destroyed = true;
        enemy[index].pos.x = -100;
        enemy[index].pos.y = -100;
       
      //  enemy.splice(index, 1);
      $('.score').text(++score);
      if(score%5==0)
      ebs+=4;
     
        return true;
      }

  return false;
};
moveBullet = function (dx, dy) {
  if (bullet.x <= border.R && bullet.x >= border.L)
    bullet.x += dx * bullet.speed;
  else {
    firing = false;
    $(".bullet").remove();
  }

  if (bullet.y <= border.B && bullet.y >= border.T)
    bullet.y += dy * bullet.speed;
  else {
    firing = false;
    $(".bullet").remove();
  }
  if (hit()) {
    firing = false;
    $(".bullet").remove();
  }
  $(".bullet").css("left", bullet.x + "px");
  $(".bullet").css("top", bullet.y + "px");
};
detectMove = function () {
  //---move my tank-----------------------
  if (keys[keys.LEFT]) {
    tank.element.style.transform = "rotate(-90deg)";
    tank.dir = "left";

    moveTank(-1, 0);
  }
  if (keys[keys.RIGHT]) {
    tank.element.style.transform = "rotate(90deg)";
    tank.dir = "right";
    moveTank(1, 0);
  }
  if (keys[keys.UP]) {
    tank.element.style.transform = "rotate(0deg)";
    tank.dir = "up";
    moveTank(0, -1);
  }
  if (keys[keys.DOWN]) {
    tank.element.style.transform = "rotate(-180deg)";
    tank.dir = "down";
    moveTank(0, 1);
  }
  //------------move my bullet--------------------
  if (firing) {
    if (bullet.dir == "up") moveBullet(0, -1);
    if (bullet.dir == "down") moveBullet(0, 1);
    if (bullet.dir == "left") moveBullet(-1, 0);
    if (bullet.dir == "right") moveBullet(1, 0);
  }
  //---------------------------------------------
  if (enemy.length > 0)
    enemy.forEach((element) => {
      
      let vd = element.pos.y - tank.y;
      let hd = element.pos.x - tank.x;
      if (Math.abs(hd) < Math.abs(vd)) {
        if (hd < 0) {
          if (Math.abs(hd) > tankSize / 2) element.pos.dir = "right";
          else {
            if (vd < 0) element.pos.dir = "down";
            else element.pos.dir = "up";
            if (!element.firing&&!element.destroyed) enemyfire(element);
          }
        } else {
          if (Math.abs(hd) > tankSize / 2) element.pos.dir = "left";
          else {
            if (vd < 0) element.pos.dir = "down";
            else element.pos.dir = "up";
            if (!element.firing&&!element.destroyed) enemyfire(element);
          }
        }
      } else {
        if (vd < 0) {
          if (Math.abs(vd) > tankSize / 2) element.pos.dir = "down";
          else {
            if (hd < 0) element.pos.dir = "right";
            else element.pos.dir = "left";
            if (!element.firing&&!element.destroyed) enemyfire(element);
          }
        } else {
          if (Math.abs(vd) > tankSize / 2) element.pos.dir = "up";
          else {
            if (hd < 0) element.pos.dir = "right";
            else element.pos.dir = "left";
            if (!element.firing&&!element.destroyed) enemyfire(element);
          }
        }
      }
     
      if (element.firing) moveEnemyBullet(element);
    //  if(eBullet.length>0)    moveEb()
      findMe(element);
    });
};
moveEb = function (){
    eBullet.forEach((element)=>{
        let dx,dy
        switch (element.dir) {
          case "up":
            dx = 0
            dy = -1
            break;
          case "down":
            dx=0
            dy=1
            break;
          case "left":
            dx = -1
            dy = 0
            break;
          case "right":
            dx=1
            dy = 0
        }
        if (element.x <= border.R && element.x >= border.L)
        element.x += dx * element.speed;
        else {
          if(enemy[enemy.findIndex(el=>el.id==element.id)])
         enemy[enemy.findIndex(el=>el.id==element.id)].firing=false;        
          $("#bullet"+element.id).remove();
        }
      
        if (element.y <= border.B && element.y >= border.T)
        element.y += dy * element.speed;
        else {
          if(enemy[enemy.findIndex(el=>el.id==element.id)])
          enemy[enemy.findIndex(el=>el.id==element.id)].firing=false;
          $("#bullet"+element.id).remove();
        }
       
        $("#bullet"+element.id).css("left", element.x + "px");
        $("#bullet"+element.id).css("top", element.y + "px");

    })
    
}
//-----------------------------------
moveEnemyBullet = function (e) {
  let dx,dy
  switch (e.bullet.dir) {
    case "up":
      dx = 0
      dy = -1
      break;
    case "down":
      dx=0
      dy=1
      break;
    case "left":
      dx = -1
      dy = 0
      break;
    case "right":
      dx=1
      dy = 0
  }
  if (e.bullet.x <= border.R && e.bullet.x >= border.L&&!hitmytank(e))
  e.bullet.x += dx * e.bullet.speed;
  else {
    e.firing = false;
    $("#bullet"+e.id).remove();
    eBullet.splice(eBullet.findIndex(ev=>ev.id==e.id),1)
  }

  if (e.bullet.y <= border.B && e.bullet.y >= border.T&&!hitmytank(e))
  e.bullet.y += dy * e.bullet.speed;
  else {
    e.firing = false;
    $("#bullet"+e.id).remove();
    eBullet.splice(eBullet.findIndex(ev=>ev.id==e.id),1)
  }
 
  $("#bullet"+e.id).css("left", e.bullet.x + "px");
  $("#bullet"+e.id).css("top", e.bullet.y + "px");
};
//=-----------------------------
function hitmytank(e){
  x = e.bullet.x + bulletSize / 2;
  y = e.bullet.y + bulletSize / 2;
  
      if (
        x > tank.x &&
        x < tank.x + tankSize &&
        y > tank.y &&
        y < tank.y + tankSize
      ) {
    //   $('#mytank').remove();
       $('#gameover').css('display','block');
        return true;
      }

  return false;

}
function restart(){
  $('#gameover').css('display','none');
  tank.element.style.left = '450px';
  tank.element.style.top = '600px';
  tank.x = 450;
  tank.y = 600;
  score = 0;
  $('.score').text('0');
  
    $('.enemy').remove();
    $('.eb').remove();
    enemy = [];
    eBullet = [];
  
  //moveTank(0,0);
}
//------------------------------------
function enemyfire(e) {
  
  var eb = {id:e.id, dir:String,x:Number,y:Number,speed:8};
  e.firing = true;
  $("#bf").append("<div class='eb' id='bullet" + e.id + "'></div>");
  if (e.pos.dir == "up") {
    $("#bullet" + e.id).css("transform", "rotate(0deg)");
    e.bullet.dir = "up";
    eb.dir = 'up'
    e.bullet.x = e.pos.x;
    eb.x = e.pos.x
    e.bullet.y = e.pos.y - gunSize;
    eb.y = e.pos.y-gunSize
    $("#bullet" + e.id).css("left", eb.x + "px");
    $("#bullet" + e.id).css("top", eb.y + "px");
  }
  if (e.pos.dir == "down") {
    $("#bullet" + e.id).css("transform", "rotate(-180deg)");
    e.bullet.dir = "down";
    eb.dir = 'down'
    e.bullet.x = e.pos.x;
    eb.x = e.pos.x
    e.bullet.y = e.pos.y + gunSize;
    eb.y = e.pos.y + gunSize
    $("#bullet" + e.id).css("left", eb.x + "px");
    $("#bullet" + e.id).css("top", eb.y + "px");
  }
  if (e.pos.dir == "left") {
    $("#bullet" + e.id).css("transform", "rotate(-90deg)");
    e.bullet.dir = "left";
    eb.dir='left'
    e.bullet.x = e.pos.x - gunSize;
    eb.x = e.pos.x - gunSize
    e.bullet.y = e.pos.y;
    eb.y = e.pos.y
    $("#bullet" + e.id).css("left", eb.x + "px");
    $("#bullet" + e.id).css("top", eb.y + "px");
  }
  if (e.pos.dir == "right") {
    $("#bullet" + e.id).css("transform", "rotate(90deg)");
    e.bullet.dir = "right";
    eb.dir = 'right'
    e.bullet.x = e.pos.x + gunSize;
    eb.x = e.pos.x +gunSize
    e.bullet.y = e.pos.y;
    eb.y = e.pos.y
    $("#bullet" + e.id).css("left", eb.x + "px");
    $("#bullet" + e.id).css("top", eb.y + "px");
  }
  eBullet.push(eb)
  
}
//---------------------------------------
function findMe(e) {
  if(!e.destroyed)
  switch (e.pos.dir) {
    case "up":
      $("#" + e.id).css("transform", "rotate(0deg)");
      moveEnemy(e, 0, -1);
      break;
    case "down":
      $("#" + e.id).css("transform", "rotate(-180deg)");
      moveEnemy(e, 0, 1);
      break;
    case "left":
      $("#" + e.id).css("transform", "rotate(-90deg)");
      moveEnemy(e, -1, 0);
      break;
    case "right":
      $("#" + e.id).css("transform", "rotate(90deg)");
      moveEnemy(e, 1, 0);
  }
}
moveEnemy = function (e, dx, dy) {
  if (e.pos.x <= border.R && e.pos.x >= border.L) e.pos.x += dx * e.speed;
  else if (e.pos.x < border.L) e.pos.x = border.L;
  else e.pos.x = border.R;
  if (e.pos.y <= border.B && e.pos.y >= border.T) e.pos.y += dy * e.speed;
  else if (e.pos.y < border.T) e.pos.y = border.T;
  else e.pos.y = border.B;
  $("#" + e.id).css({ left: e.pos.x + "px", top: e.pos.y + "px" });
};
moveTank(0, 0);
setInterval(summon,3000)
setInterval(function () {
  detectMove();
}, 1000 / 24);
