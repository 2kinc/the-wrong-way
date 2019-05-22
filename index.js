// v1.0.0
function Game(T,h,e_,W,r,o,n,g,__,w,a,y) {
  var that = this;
  this.elems = {
    play:$('#play'),
    startup:$('#startup')
  }
  this.context = $('canvas')[0].getContext('2d');
  this.drawCircle = function(x, y, r, c) {
    that.context.beginPath();
    that.context.arc(x, y, r, 0, Math.PI * 2);
    that.context.fillStyle = c;
    that.context.fill();
  }
  this.player = {
    x:40,
    y:50,
    color:[210,53,80],
    name:'NANI',
    radius:14,
    radarRadius:14,
    maxRadRadius:60,
  }
  this.background = T;
  this.perFrame = function() {
    that.context.canvas.width = innerWidth;
    that.context.canvas.height = innerHeight;
    that.context.canvas.style.background = that.background;
    that.drawCircle(that.player.x, that.player.y, that.player.radarRadius, 'rgba('+that.player.color[0]+','+that.player.color[1]+','+that.player.color[2]+','+(1-that.player.radarRadius/that.player.maxRadRadius)+')');
    that.drawCircle(that.player.x, that.player.y, that.player.radius, 'rgb('+that.player.color[0]+','+that.player.color[1]+','+that.player.color[2]+')');
    that.player.radarRadius += 0.4;
    if (that.player.radarRadius >= that.player.maxRadRadius) {
      that.player.radarRadius = that.player.radius;
    }
    if (that.player.x < that.player.radius) {
      that.player.x = that.player.radius;
    } if (that.player.x > innerHeight - that.player.radius) {
      that.player.x = innerHeight - that.player.radius;
    } if (that.player.y < that.player.radius) {
      that.player.y = that.player.radius;
    } if (that.player.y > innerHeight - that.player.radius) {
      that.player.y = innerHeight - that.player.radius;
    }
  }
  $(document).keypress(function(e) {
    key = e.key.toLowerCase();
    if (key == 'w' || key == 'arrowup') {
      that.player.y -= 2;
    } if (key == 's' || key == 'arrowdown') {
      that.player.y += 2;
    }
  });
  this.elems.play.click(function() {
    that.elems.startup.hide();
    $(that.context.canvas).show();
    setInterval(that.perFrame, 18);
  });
}
var game = new Game('#333');
