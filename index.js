// The Wrong Way v1.0.0
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
    y:250,
    color:[210,53,80],
    name:'NANI',
    radius:14,
    radarRadius:14,
    maxRadRadius:60,
    safe:false,
  }
  this.hideouts = [
    [100,200],
    [200,300],
    [300,500],
    [400,400],
    [500,100],
    [600,600],
  ];
  this.watchers = [
    [150,16,true,3,16,62],
    [250,innerHeight-16,false,6,16,62],
    [350,16,true,2,16,62],
    [450,innerHeight-16,false,4,16,62],
    [550,16,true,5.5,16,62],
    [650,innerHeight-16,false,5,16,62],
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
        var distance = Math.sqrt((that.player.y - i[1])**2 + (that.player.x - i[0])**2);
        if (distance < that.player.radarRadius + 10) {
          alpha = 0.3;
        }
        if (distance < that.player.radius + 10) {
          alpha = 0.6;
          that.player.color = [25,118,210];
          that.player.safe = true;
          that.player.radarRadius = that.player.radius;
        }
        that.drawCircle(i[0],i[1],10,'rgba(25,118,210,'+alpha+')');
    });
    that.watchers.forEach(function (i) {
      var distance = Math.sqrt((that.player.y - i[1])**2 + (that.player.x - i[0])**2);
      i[1] = (i[2]) ? i[1] + i[3] : (true) ? i[1] - i[3] : 0;
      if (i[1] < 16) {
        i[2] = true;
      } if (i[1] > innerHeight - 16) {
        i[2] = false;
      };
      if (distance < that.player.radius + i[4]) {
        console.log('hi')
      }
      if (distance < that.player.radius + 10 && !that.player.safe) {
        that.player.x = 40;
        that.player.y = 250;
      }
      i[4] += 0.4;
      if (i[4] >= i[5]) {
        i[4] = 16;
      }
      that.drawCircle(i[0],i[1],i[4],'rgba(29, 138, 34,'+(1-i[4]/i[5])+')');
      that.drawCircle(i[0],i[1],16,'rgb(29, 138, 34)');
    });
    that.player.radarRadius += 0.4;
    if (that.player.radarRadius >= that.player.maxRadRadius) {
      that.player.radarRadius = that.player.radius;
    }
    if (that.player.x < that.player.radius) {
      that.player.x = that.player.radius;
    } if (that.player.x > innerHeight - that.player.radius) {
      that.player.x = innerHeight - that.player.radius;
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
  });
}
var game = new Game('#333');
