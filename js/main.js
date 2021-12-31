var border={}
border.R=908
border.L=0
border.B=656
border.T=0
var tank = {
    x:450,
    y:600,
    speed:2,
    element:document.getElementById('mytank'),
    dir:'up'
}
var bullet = {
    speed:4,
    x:0,
    y:0,
    dir:'up'
}
var firing = false
var keys = {}
keys.UP = 38
keys.LEFT = 37
keys.RIGHT = 39
keys.DOWN = 40
document.addEventListener('keyup',f)
document.addEventListener('keydown',f)
function f(e){
     var kc =e.keyCode
    keys[kc]= e.type=='keydown'
    if(kc==32 && e.type == 'keydown' && !firing)
     fire()
}
function fire(){
    firing= true
    $('#bf').append("<div class='bullet'></div>")
    if(tank.dir=='up')
    {
        bullet.x = tank.x
        bullet.y = tank.y - 42  
        $('.bullet').css('left',bullet.x+'px')
        $('.bullet').css('top',bullet.y +'px')
    }
}

moveTank =  function(dx,dy){
    if(tank.x<=border.R && tank.x>=border.L)
    tank.x += dx*tank.speed
    else if(tank.x<border.L) tank.x = border.L
    else tank.x = border.R
    if(tank.y<=border.B && tank.y>=border.T)
    tank.y+= dy*tank.speed
    else if(tank.y<border.T) tank.y = border.T
    else tank.y = border.B
  tank.element.style.left = tank.x +'px'
    tank.element.style.top = tank.y +'px'
  }
moveBullet = function(dx,dy){
    if(bullet.x<=border.R && bullet.x>=border.L)
    bullet.x += dx*bullet.speed
    else if(bullet.x<border.L) bullet.x = border.L
    else bullet.x = border.R
    if(bullet.y<=border.B && bullet.y>=border.T)
    bullet.y+= dy*bullet.speed
    else if(bullet.y<border.T){
        firing = false
        $('.bullet').remove()
    }
    else bullet.y = border.B
    $('.bullet').css('left',bullet.x+'px')
    $('.bullet').css('top',bullet.y +'px')

}
detectMove = function(){
    if ( keys[keys.LEFT] ) {
        tank.element.style.transform='rotate(-90deg)'
        
        moveTank(-1, 0);
      }
      if ( keys[keys.RIGHT] ) {
        tank.element.style.transform='rotate(90deg)'
        moveTank(1, 0);
      }
      if ( keys[keys.UP] ) {
        tank.element.style.transform='rotate(0deg)'
        moveTank(0, -1);
      }
      if ( keys[keys.DOWN] ) {
            tank.element.style.transform='rotate(-180deg)'
        
        moveTank(0, 1);
      }
   
      if(firing){
          if(bullet.dir=='up') moveBullet(0,-1)
      }
}
moveTank(0,0)
setInterval(function(){
    detectMove();
  }, 1000/24);