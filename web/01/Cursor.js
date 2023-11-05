// const
var FPS=70;
var SRC_W=window.innerWidth;
var SRC_H=window.innerHeight;
var G=0.5;

//var
var ctx;
var pl=[];
var mx=null;//pos
var my=null;

//class of particle
//constructor
var Particle=function(x,y){
    this.x=x;
    this.y=y;
};
//att,method
Particle.prototype={
    x:null,
    y:null,
    vx:0,
    vy:0,
    radius:0,
    color:null,
    isRemove:false,
    create:function(){
        this.vx=Math.random()*6-3;
        this.vy=Math.random()*(-6)-1;
        this.radius=Math.random()*15+5;
        //color var
        var r=150;
        var g=Math.floor(Math.random()*100+155);
        var b=Math.floor(Math.random()*155+100);
        this.color="rgb("+r+","+g+", "+b+")";
    },//to mask gravity
    update:function(){
        this.vy+=G;
        this.x+=this.vx;
        this.y+=this.vy;
        this.radius *=.97;
        //catch
        if(this.x<0||this.x>SRC_W||this.y>SRC_H||this.y<0){
            this.isRemove=true;
        }

    },
    draw:function(){
        ctx.fillStyle=this.color;
        ctx.beginPath();
        ctx.arc(this.x,this.y,this.radius,0,Math.PI*2);//the centre,size,StartEnd,direction
        ctx.fill();
    }
}

window.onload=function(){
    init();
};
var init=function() {
    //check
    var canvas=document.getElementById("my");
    if(!canvas||!canvas.getContext){
        return false;
    }
    //set
    canvas.width=SRC_W;
    canvas.height=SRC_H;
    //CTX to record mouse
    ctx=canvas.getContext("2d");
    canvas.addEventListener("mousemove",updateMousePos,false);
    canvas.addEventListener("mouseout",resetMousePos,false);

    loop();

};
//Pos
var updateMousePos=function(e){
    var rect=e.target.getBoundingClientRect();//|pos|
    mx=e.clientX-rect.left;
    my=e.clientY-rect.top;
};
var resetMousePos=function(e){
    mx=null;
    my=null;
};

var loop=function(){
    add();
    update();
    draw();
    setTimeout(loop,1000/FPS);//1 sec do 60 times    
};
var add=function(){
    if(mx!=null&&my!=null){

    var p=new Particle(mx,my);
    p.create();
    
    pl.push(p);
    }
};

var update=function(){
    var list=[];
    var numberOfParticles = pl.length;
    console.log("目前有 " + numberOfParticles + " 個粒子。");
    for(var i=0;i<pl.length;i++){
        pl[i].update();

        if(!pl[i].isRemove){
            list.push(pl[i]);
        }
    }
    pl=list;
};
var draw=function(){
    //bg
    ctx.fillStyle="rgb(0,0,0)";
    ctx.fillRect(0,0,SRC_W,SRC_H);
    ctx.save();//save rect
    //p
    ctx.globalCompositeOperation="lighter";
    for(var i=0;i<pl.length;i++){
        pl[i].draw();
    }
    ctx.restore();
};




