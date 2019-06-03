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
  this.drawRect = function(x, y, w, h, c) {
    that.context.beginPath();
    that.context.rect(x, y, w, h);
    that.context.fillStyle = c;
    that.context.fill();
  };
  this.rectcirclecoll = function (circle,rect){
    var distX = Math.abs(circle.x - rect.x-rect.width/2);
    var distY = Math.abs(circle.y - rect.y-rect.height/2);
    if (distX > (rect.width/2 + circle.radius)) { return false; }
    if (distY > (rect.height/2 + circle.radius)) { return false; }
    if (distX <= (rect.width/2)) { return true; }
    if (distY <= (rect.height/2)) { return true; }
    return ((distX-rect.width/2)**2+(distY-rect.height/2)**2<=(circle.radius**2));
  }
  noise.seed(Math.random());
  this.player = {};
  this.hideouts = [];
  this.watchers = [];
  this.obstacles = [];
  this.background = T;
  this.keys = {};
  this.points = 0;
  this.levels = h;
  if (localStorage.tewgwy) {JSON.parse(localStorage.tewgwy).forEach(function(a,b) {
      that.levels[b].highscore = a;
  })};
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
    that.obstacles.forEach(function (i) {
        if (i.type == 'rect') {
          that.drawRect(i.x,i.y,i.width,i.height,i.color);
        }
    });
    that.watchers.forEach(function (i) {
      var distance = Math.sqrt((that.player.y - i.y)**2 + (that.player.x - i.x)**2);
      var noisexstep = Math.abs(noise.simplex2(0,i.noise+1000))*innerWidth+16;
      var noiseystep = Math.abs(noise.simplex2(i.noise,0))*innerHeight+16;
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
      if (that.points > maxpoints*(1/4)) {
        $($('#stars').children()[0]).css('fill','yellow');
      } if (that.points > maxpoints*(1/2)) {
        $($('#stars').children()[1]).css('fill','yellow');
      } if (that.points > maxpoints*(3/4)) {
        $($('#stars').children()[2]).css('fill','yellow');
      }
      if (that.points > that.levels[that.currentLevel].highscore) that.levels[that.currentLevel].highscore = that.points;
      that.points = 0;
      noise.seed(Math.random());
      that.elems.levels.html('');
      that.levels.forEach(function(a,b) {
        el = $('<button class="levelsbutton" id="level'+(b+1)+'"">'+(b+1)+'<br><span style=""><svg style="fill: rgba(0,0,0,0.4);width: 20px;height: 20px;"><path d="M 10.000 15.000L 15.878 18.090L 14.755 11.545L 19.511 6.910L 12.939 5.955L 10.000 0.000L 7.061 5.955L 0.489 6.910L 5.245 11.545L 4.122 18.090L 10.000 15.000"></path></svg><svg style="fill: rgba(0,0,0,0.4);width: 20px;height: 20px;"><path d="M 10.000 15.000L 15.878 18.090L 14.755 11.545L 19.511 6.910L 12.939 5.955L 10.000 0.000L 7.061 5.955L 0.489 6.910L 5.245 11.545L 4.122 18.090L 10.000 15.000"></path></svg><svg style="fill: rgba(0,0,0,0.4);width: 20px;height: 20px;"><path d="M 10.000 15.000L 15.878 18.090L 14.755 11.545L 19.511 6.910L 12.939 5.955L 10.000 0.000L 7.061 5.955L 0.489 6.910L 5.245 11.545L 4.122 18.090L 10.000 15.000"></path></svg> </span></button>');
        if (a.locked) el.prop("disabled",true);
        that.elems.levels.append(el);
        var maxpoints = 0;
        a.hideouts.forEach(function(i){i.clctd = false;maxpoints+=i.points;});
        if (a.highscore > maxpoints*(1/4)) {
          console.log($('#level'+(b+1)+' span').children()[0])
          $($('#level'+(b+1)+' span').children()[0]).css('fill','yellow');
        } if (a.highscore > maxpoints*(1/2)) {
          $($('#level'+(b+1)+' span').children()[1]).css('fill','yellow');
        } if (a.highscore > maxpoints*(3/4)) {
          $($('#level'+(b+1)+' span').children()[2]).css('fill','yellow');
        };
      });
      $('.levelsbutton').each(function(a,b) {
        $(b).click(function(){
          that.Level(that.levels[a]);
          that.currentLevel = a;
          that.elems.levels.hide();
          that.elems.game.show();
        });
      });
      that.levels[that.currentLevel+1].locked = false;
      $($('#levels').children()[that.currentLevel+1]).prop("disabled",false);
      return;
    } if (that.player.y < that.player.radius) {
      that.player.y = that.player.radius;
    } if (that.player.y > innerHeight - that.player.radius) {
      that.player.y = innerHeight - that.player.radius;
    }
    if (that.keys['w'] || that.keys['arrowup']) {
      var move = true;
      that.obstacles.forEach(function (i) {
          if (i.type == 'rect') if (that.rectcirclecoll(that.player,i) && !((that.player.y+that.player.radius) - i.y == 0)) move = false;
          if (i.pushable && that.rectcirclecoll(that.player,i)) {move=true;i.y-=2;}
      });
      if (move) that.player.y -= 2;
    } if (that.keys['s'] || that.keys['arrowdown']) {
      var move = true;
      that.obstacles.forEach(function (i) {
          if (i.type == 'rect') if (that.rectcirclecoll(that.player,i) && !((i.y+i.height)-(that.player.y) < 0)) move = false;
          if (i.pushable && that.rectcirclecoll(that.player,i)) {move=true;i.y+=2;}
      });
      if (move) that.player.y += 2;
    } if (that.keys['a'] || that.keys['arrowleft']) {
      var move = true;
      that.obstacles.forEach(function (i) {
          if (i.type == 'rect') if (that.rectcirclecoll(that.player,i) && !((that.player.x+that.player.radius) - i.x == 0)) move = false;
          if (i.pushable && that.rectcirclecoll(that.player,i)) {move=true;i.x-=2;}
      });
      if (move) that.player.x -= 2;
    } if (that.keys['d'] || that.keys['arrowright']) {
      var move = true;
      that.obstacles.forEach(function (i) {
          if (i.type == 'rect') if (that.rectcirclecoll(that.player,i) && !((i.x+i.width)-(that.player.x) < 0)) move = false;
          if (i.pushable && that.rectcirclecoll(that.player,i)) {move=true;i.x+=2;}
      });
      if (move) that.player.x += 2;
    }
    requestAnimationFrame(that.perFrame)
  };
  this.Level = function(ob) {
    cancelAnimationFrame(that.perFrame);
    that.player = ob.player;
    that.hideouts = ob.hideouts;
    that.watchers = ob.watchers;
    that.obstacles = ob.obstacles;
    requestAnimationFrame(that.perFrame);
  };
  this.elems.play.click(function() {
    that.elems.startup.hide();
    that.elems.levels.show();
  });
  if (localStorage.tewgwy) {JSON.parse(localStorage.tewgwy).forEach(function(a,b) {
      that.levels[b].highscore = a;console.log(a);
  })};
  this.levels.forEach(function(a,b) {
    el = $('<button class="levelsbutton" id="level'+(b+1)+'"">'+(b+1)+'<br><span style=""><svg style="fill: rgba(0,0,0,0.4);width: 20px;height: 20px;"><path d="M 10.000 15.000L 15.878 18.090L 14.755 11.545L 19.511 6.910L 12.939 5.955L 10.000 0.000L 7.061 5.955L 0.489 6.910L 5.245 11.545L 4.122 18.090L 10.000 15.000"></path></svg><svg style="fill: rgba(0,0,0,0.4);width: 20px;height: 20px;"><path d="M 10.000 15.000L 15.878 18.090L 14.755 11.545L 19.511 6.910L 12.939 5.955L 10.000 0.000L 7.061 5.955L 0.489 6.910L 5.245 11.545L 4.122 18.090L 10.000 15.000"></path></svg><svg style="fill: rgba(0,0,0,0.4);width: 20px;height: 20px;"><path d="M 10.000 15.000L 15.878 18.090L 14.755 11.545L 19.511 6.910L 12.939 5.955L 10.000 0.000L 7.061 5.955L 0.489 6.910L 5.245 11.545L 4.122 18.090L 10.000 15.000"></path></svg> </span></button>');
    if (a.locked) el.prop("disabled",true);
    that.elems.levels.append(el);
    var maxpoints = 0;
    a.hideouts.forEach(function(i){i.clctd = false;maxpoints+=i.points;});
    if (a.highscore > maxpoints*(1/4)) {
      console.log($('#level'+(b+1)+' span').children()[0])
      $($('#level'+(b+1)+' span').children()[0]).css('fill','yellow');
    } if (a.highscore > maxpoints*(1/2)) {
      $($('#level'+(b+1)+' span').children()[1]).css('fill','yellow');
    } if (a.highscore > maxpoints*(3/4)) {
      $($('#level'+(b+1)+' span').children()[2]).css('fill','yellow');
    };
  });
  $('#redobtn').click(function() {
    that.Level(that.levels[that.currentLevel]);
    $('#gamedialog').hide().css('opacity',0);
  });
  $('#nextbtn').click(function() {
    that.Level(that.levels[++that.currentLevel]);
    $('#gamedialog').hide().css('opacity',0);
  });
  $('#levelsbtn').click(function() {
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
  });
  onunload = function() {
    var push = [];
    that.levels.forEach(function(a) {
      push.push(a.highscore);
    })
    localStorage.setItem('tewgwy',JSON.stringify(push))
  }
}
var game = new Game('#222', [
  {
    completed:false,
    locked:false,
    points:0,
    highscore:0,
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
      {x:250,y:16,speed:6,rr:26,maxrr:62,noise:20,followplayer:false},
      {x:350,y:16,speed:2,rr:36,maxrr:62,noise:40,followplayer:false},
      {x:450,y:16,speed:4,rr:46,maxrr:62,noise:60,followplayer:false},
      {x:550,y:16,speed:7,rr:56,maxrr:62,noise:80,followplayer:false},
      {x:650,y:16,speed:5,rr:16,maxrr:62,noise:100,followplayer:false},
    ],obstacles:[]
  },{
    completed:false,
    locked:true,
    points:0,
    highscore:0,
    player:{
      x:80,
      y:250,
      color:[210,53,80],
      radius:14,
      radarRadius:14,
      maxRadRadius:60,
      safe:false,
    },hideouts:[
      {x:80,y:250,points:0,clctd:false},
      {x:100,y:200,points:20,clctd:false},
      {x:200,y:300,points:20,clctd:false},
      {x:300,y:500,points:20,clctd:false},
      {x:400,y:400,points:30,clctd:false},
      {x:500,y:100,points:40,clctd:false},
      {x:600,y:600,points:20,clctd:false},
      {x:50,y:600,points:20,clctd:false},
    ],watchers:[
      {x:150,y:16,speed:2.2,rr:16,maxrr:65,noise:0,followplayer:false},
      {x:250,y:16,speed:2.1,rr:26,maxrr:65,noise:20,followplayer:false},
      {x:350,y:16,speed:1.9,rr:36,maxrr:65,noise:40,followplayer:false},
      {x:450,y:16,speed:1.8,rr:46,maxrr:65,noise:60,followplayer:false},
      {x:550,y:16,speed:2,rr:56,maxrr:150,noise:80,followplayer:false},
      {x:650,y:16,speed:1.7,rr:16,maxrr:65,noise:170,followplayer:false},
      {x:1050,y:16,speed:1.0,rr:26,maxrr:65,noise:170,followplayer:false},
    ],obstacles:[
      {x:150,y:400,type:'rect',width:50,height:1000,color:'#9e9e9e',pushable:false},
      {x:150,y:0,type:'rect',width:50,height:300,color:'#9e9e9e',pushable:false}
    ]
  },{
    completed:false,
    locked:true,
    points:0,
    highscore:0,
    player:{
      x:60,
      y:200,
      color:[210,53,80],
      radius:14,
      radarRadius:14,
      maxRadRadius:60,
      safe:false,
    },hideouts:[
      {x:60,y:200,points:0,clctd:false},
      {x:100,y:200,points:20,clctd:false},
      {x:200,y:300,points:20,clctd:false},
      {x:300,y:500,points:20,clctd:false},
      {x:400,y:400,points:30,clctd:false},
      {x:500,y:100,points:40,clctd:false},
      {x:600,y:600,points:20,clctd:false},
      {x:700,y:100,points:25,clctd:false},
      {x:650,y:300,points:20,clctd:false},
    ],watchers:[
      {x:150,y:16,speed:2.2,rr:16,maxrr:65,noise:0,followplayer:false},
      {x:250,y:16,speed:2.1,rr:26,maxrr:65,noise:20,followplayer:false},
      {x:350,y:16,speed:1.9,rr:36,maxrr:65,noise:40,followplayer:false},
      {x:450,y:16,speed:1.8,rr:46,maxrr:65,noise:60,followplayer:false},
      {x:550,y:16,speed:2,rr:56,maxrr:150,noise:80,followplayer:false},
      {x:650,y:16,speed:1.7,rr:16,maxrr:65,noise:100,followplayer:false},
      {x:1050,y:16,speed:1.0,rr:26,maxrr:65,noise:120,followplayer:false},
      {x:1150,y:16,speed:1.0,rr:36,maxrr:100,noise:140,followplayer:false},
    ],obstacles:[
      {x:150,y:500,type:'rect',width:50,height:1000,color:'#9e9e9e',pushable:false},
      {x:150,y:0,type:'rect',width:50,height:400,color:'#9e9e9e',pushable:false},
      {x:150,y:400,type:'rect',width:50,height:100,color:'#3f51b5',pushable:true}
    ]
  }
]);

























/* Some blank space the DimaTheGoat left behind*/
