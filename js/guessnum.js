let ans=Math.floor(Math.random() * 100);
//if 0 regenerate
while(!ans){
    ans=Math.floor(Math.random() * 100);
}
// not included up & down
let up=100;
let down=0;
console.log(ans);
alert("guess interger in (down,up)");
while(true){
    g=prompt("pls guess a interger between "+down+"-"+up);
    if(g>down&&g<up){
        if(g>ans){
            up=g;
        }else if(g<ans){
            down=g;
        }else{
            alert("win & replay!");
            break;
        }
    }else{
        alert("not in range!");
    }
}
window.location.reload();
