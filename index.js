// The Wrong Way v0.8.0
function Game(T,h,e_,W,r,o,n,g,__,w,a,y) {
  var that = this;
  this.elems = {
    play:$('#play'),
    levels:$('#levels'),
    startup:$('#startup'),
    game:$('#game')
  }
  this.context = $('canvas')[0].getContext('2d');
  this.drawCircle = function(x, y, r, c) {
    that.context.beginPath();
    that.context.arc(x, y, r, 0, Math.PI * 2);
    that.context.fillStyle = c;
    that.context.fill();
  };
  noise.seed(Math.random());
  this.player = {};
  this.hideouts = [];
  this.watchers = [];
  this.background = T;
  this.keys = {};
  this.points = 0;
  this.levels = h;
  this.currentLevel = 0;
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
        var alpha = 0.051;
        var distance = Math.sqrt((that.player.y - i.y)**2 + (that.player.x - i.x)**2);
        if (distance < that.player.radarRadius + 10) {
          alpha = 0.3;
        }
        if (distance < that.player.radius + 10) {
          alpha = 0.6;
          that.player.color = [25,118,210];
          that.player.safe = true;
          if (!i.clctd) {
            that.points += i.points;
            i.clctd = true;
          }
          that.player.radarRadius = that.player.radius;
        }
        that.drawCircle(i.x,i.y,10,'rgba(25,118,210,'+alpha+')');
    });
    that.watchers.forEach(function (i) {
      var distance = Math.sqrt((that.player.y - i.y)**2 + (that.player.x - i.x)**2);
      var noisexstep = Math.abs(noise.simplex2(i.noise+1000,i.noise+1000))*innerWidth+16;
      var noiseystep = Math.abs(noise.simplex2(i.noise,i.noise))*innerHeight+16;
      if (distance < that.player.radius + i.rr && !that.player.safe) {
        i.followplayer = true;
      }
      if (i.followplayer && !that.player.safe) {
        i.followplayer = true;
        if (that.player.x - i.x > 0) {
          i.x += i.speed;
        } else if (that.player.x - i.x < 0) {
          i.x -= i.speed;
        } if (that.player.y - i.y > 0) {
          i.y += i.speed;
        } else if (that.player.y - i.y < 0) {
          i.y -= i.speed;
        }
      } else {
        i.noise+=i.speed/10000;
        i.y = noiseystep;
        i.x = noisexstep;
      }
      if (that.player.safe) i.followplayer = false;
      if (distance < that.player.radius + 10 && !that.player.safe) {
        that.player.x = that.hideouts[0].x;
        that.player.y = that.hideouts[0].y;
        that.points -= 10;
        i.followplayer = false;
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
      $('#gamedialog').css({opacity:1,display:'flex'});
      $('#points').text(that.points);
      that.player.x = that.hideouts[0].x;
      that.player.y = that.hideouts[0].y;
      var maxpoints = 0;
      that.hideouts.forEach(function(i) {i.clctd = false;maxpoints+=i.points;});
      that.levels[that.currentLevel+1].locked = false;
      $($('#levels').children()[that.currentLevel+1]).prop("disabled",false);
      if (that.points > maxpoints*(1/4)) {
        $($('#stars').children()[0]).css('fill','yellow');
      } if (that.points > maxpoints*(1/2)) {
        $($('#stars').children()[0]).css('fill','yellow');
        $($('#stars').children()[1]).css('fill','yellow');
      } if (that.points > maxpoints*(3/4)) {
        $($('#stars').children()[0]).css('fill','yellow');
        $($('#stars').children()[1]).css('fill','yellow');
        $($('#stars').children()[2]).css('fill','yellow');
      }
      var points = 0;
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
  };
  this.Level = function(ob) {
    cancelAnimationFrame(that.perFrame);
    that.player = ob.player;
    that.hideouts = ob.hideouts;
    that.watchers = ob.watchers;
    requestAnimationFrame(that.perFrame);
  };
  this.elems.play.click(function() {
    that.elems.startup.hide();
    that.elems.levels.show();
  });
  this.levels.forEach(function(a,b) {
    el = $('<button class="levelsbutton">'+(b+1)+'</button>');
    if (a.locked) el.prop("disabled",true)
    that.elems.levels.append(el);
  });
  $('#levelsbtn').text('Levels').click(function() {
    that.elems.levels.show();
    that.elems.game.hide();
    $('#gamedialog').hide().css('opacity',0);
  });
  $('.levelsbutton').each(function(a,b) {
    $(b).click(function(){
      that.Level(that.levels[a]);
      that.currentLevel = a;
      that.elems.levels.hide();
      that.elems.game.show();
    });
  })
}
var game = new Game('#333', [
  {
    completed:false,
    locked:false,
    points:0,
    player:{
      x:40,
      y:250,
      color:[210,53,80],
      radius:14,
      radarRadius:14,
      maxRadRadius:60,
      safe:false,
    },hideouts:[
      {x:40,y:250,points:0,clctd:false},
      {x:100,y:200,points:20,clctd:false},
      {x:200,y:300,points:20,clctd:false},
      {x:300,y:500,points:20,clctd:false},
      {x:400,y:400,points:30,clctd:false},
      {x:500,y:100,points:40,clctd:false},
      {x:600,y:600,points:20,clctd:false},
    ],watchers:[
      {x:150,y:16,speed:3,rr:16,maxrr:62,noise:0,followplayer:false},
      {x:250,y:16,speed:6,rr:16,maxrr:62,noise:20,followplayer:false},
      {x:350,y:16,speed:2,rr:16,maxrr:62,noise:40,followplayer:false},
      {x:450,y:16,speed:4,rr:16,maxrr:62,noise:60,followplayer:false},
      {x:550,y:16,speed:7,rr:16,maxrr:62,noise:80,followplayer:false},
      {x:650,y:16,speed:5,rr:16,maxrr:62,noise:100,followplayer:false},
    ]
  },{
    completed:false,
    locked:true,
    points:0,
    player:{
      x:40,
      y:250,
      color:[210,53,80],
      radius:14,
      radarRadius:14,
      maxRadRadius:60,
      safe:false,
    },hideouts:[
      {x:40,y:250,points:0,clctd:false},
      {x:100,y:200,points:20,clctd:false},
      {x:200,y:300,points:20,clctd:false},
      {x:300,y:500,points:20,clctd:false},
      {x:400,y:400,points:30,clctd:false},
      {x:500,y:100,points:40,clctd:false},
      {x:600,y:600,points:20,clctd:false},
    ],watchers:[
      {x:150,y:16,speed:2.2,rr:16,maxrr:62,noise:0,followplayer:false},
      {x:250,y:16,speed:2.1,rr:16,maxrr:62,noise:20,followplayer:false},
      {x:350,y:16,speed:1.9,rr:16,maxrr:62,noise:40,followplayer:false},
      {x:450,y:16,speed:1.8,rr:16,maxrr:62,noise:60,followplayer:false},
      {x:550,y:16,speed:2.3,rr:16,maxrr:100,noise:80,followplayer:false},
      {x:650,y:16,speed:1.7,rr:16,maxrr:62,noise:170,followplayer:false},
    ]
  }
]);
