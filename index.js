// The Wrong Way v1.0.0
function Game(T,h,e_,W,r,o,n,g,__,w,a,y) {
  var that = this;
  this.elems = {
    play:$('#play'),
    levels:$('#levels'),
    startup:$('#startup')
  }
  this.context = $('canvas')[0].getContext('2d');
  this.drawCircle = function(x, y, r, c) {
    that.context.beginPath();
    that.context.arc(x, y, r, 0, Math.PI * 2);
    that.context.fillStyle = c;
    that.context.fill();
  };
  noise.seed(Math.random());
  this.player = {
    x:40,
    y:250,
    color:[210,53,80],
    name:'NANI',
    radius:14,
    radarRadius:14,
    maxRadRadius:60,
    safe:false,
  }
  this.hideouts = [
    {x:40,y:250},
    {x:100,y:200},
    {x:200,y:300},
    {x:300,y:500},
    {x:400,y:400},
    {x:500,y:100},
    {x:600,y:600},
  ];
  this.watchers = [
    {x:150,y:16,movingdown:true,speed:3,rr:16,maxrr:62,noise:0},
    {x:250,y:innerHeight-16,movingdown:false,speed:6,rr:16,maxrr:62,noise:20},
    {x:350,y:16,movingdown:true,speed:2,rr:16,maxrr:62,noise:40},
    {x:450,y:innerHeight-16,movingdown:false,speed:4,rr:16,maxrr:62,noise:60},
    {x:550,y:16,movingdown:true,speed:5.5,rr:16,maxrr:62,noise:80},
    {x:650,y:innerHeight-16,movingdown:false,speed:5,rr:16,maxrr:62,noise:100},
  ];
  this.background = T;
  this.keys = {};
  $(document).keydown((e)=>this.keys[e.key.toLowerCase()] = e.type = true);
  $(document).keyup((e) => this.keys[e.key.toLowerCase()] = false);
  this.perFrame = function() {
    that.context.canvas.width = innerWidth;
    that.context.canvas.height = innerHeight;
    that.context.canvas.style.background = that.background;
    that.drawCircle(that.player.x, that.player.y, that.player.radarRadius, 'rgba('+that.player.color[0]+','+that.player.color[1]+','+that.player.color[2]+','+(1-that.player.radarRadius/that.player.maxRadRadius)+')');
    that.drawCircle(that.player.x, that.player.y, that.player.radius, 'rgb('+that.player.color[0]+','+that.player.color[1]+','+that.player.color[2]+')');
    that.player.color = [210,53,80];
    that.player.safe = false;
    that.hideouts.forEach(function (i) {
        var alpha = 0.021;
        var distance = Math.sqrt((that.player.y - i.y)**2 + (that.player.x - i.x)**2);
        if (distance < that.player.radarRadius + 10) {
          alpha = 0.3;
        }
        if (distance < that.player.radius + 10) {
          alpha = 0.6;
          that.player.color = [25,118,210];
          that.player.safe = true;
          that.player.radarRadius = that.player.radius;
        }
        that.drawCircle(i.x,i.y,10,'rgba(25,118,210,'+alpha+')');
    });
    that.watchers.forEach(function (i) {
      var distance = Math.sqrt((that.player.y - i.y)**2 + (that.player.x - i.x)**2);
      i.noise+=i.speed/10000;
      if (distance < that.player.radius + i.rr && !that.player.safe) {
        i.x += that.player.x - i.x;
        i.y += that.player.y - i.y;
      } else {
        i.y = Math.abs(noise.simplex2(i.noise,i.noise))*innerHeight+16;
        i.x = Math.abs(noise.simplex2(i.noise+1000,i.noise+1000))*innerWidth+16;
      }
      if (distance < that.player.radius + 10 && !that.player.safe) {
        that.player.x = 40;
        that.player.y = 250;
      }
      i.rr += 0.4;
      if (i.rr >= i.maxrr) {
        i.rr = 16;
      }
      that.drawCircle(i.x,i.y,i.rr,'rgba(29, 138, 34,'+(1-i.rr/i.maxrr)+')');
      that.drawCircle(i.x,i.y,16,'rgb(29, 138, 34)');
    });
    that.player.radarRadius += 0.4;
    if (that.player.radarRadius >= that.player.maxRadRadius) {
      that.player.radarRadius = that.player.radius;
    }
    if (that.player.x < that.player.radius) {
      that.player.x = that.player.radius;
    } if (that.player.x > innerWidth - that.player.radius) {
      that.player.x = innerWidth - that.player.radius;
      return;
    } if (that.player.y < that.player.radius) {
      that.player.y = that.player.radius;
    } if (that.player.y > innerHeight - that.player.radius) {
      that.player.y = innerHeight - that.player.radius;
    }
    if (that.keys['w'] || that.keys['arrowup']) {
      that.player.y -= 2;
    } if (that.keys['s'] || that.keys['arrowdown']) {
      that.player.y += 2;
    } if (that.keys['a'] || that.keys['arrowleft']) {
      that.player.x -= 2;
    } if (that.keys['d'] || that.keys['arrowright']) {
      that.player.x += 2;
    }
    requestAnimationFrame(that.perFrame)
  }
  this.elems.play.click(function() {
    that.elems.startup.hide();
    $(that.context.canvas).show();
    requestAnimationFrame(that.perFrame);
    //that.elems.levels.show();
  });
}
var game = new Game('#333');
