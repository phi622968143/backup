 <?php

// $day=1;
// $day_component=[
//     1=>'monday',
//     2=>"thuesday",
//     3=>"wed",
// ]; 

// if(in_array($day,array_keys($day_component))){
//     echo $day_component[$day];
// } 

// $tot=210;
// $page=25;
// $p_c=ceil($tot/$page);
// for($i=1;$i<$p_c;$i++){
//     echo '<a href="?page='.$i.'">'.$i.'</a>';
// }   
// $tot=30;
// $completed=5;
// $percent=number_format((($completed/$tot)*100),0);

// echo "u've completed {$percent}%";
// $a=10;
// echo $a**4;
// function fullname($fn,$ln,$sep=' '){
//     return "{$fn}{$sep}{$ln}";
// }
// function first(){
//     return 'alex';
// }
// $fn="andy";
// $ln="peter";
// echo fullname($fn,$ln);
// echo fullname(first(),'end','_');
// $users=[
//     ["name"=>"garry","age"=>21],
//     ["name"=>"tom","age"=>20]
// ];
// var_dump($users);

// switch(3){
//     case 1:
//         echo 'value=1';
//          break;
//     default:
//         echo 'unknown';
//         break;
// }
// $w=['cloudy','sunny','typhoon'];
// $color=null;
// switch($w[1]){
//     case 'cloudy':
//         $color='grey';
//         break;
//     case 'sunny':
//         $color='yellow';
//         break;
//     default:
//         echo 'unknown';
//         break;
// }
// echo $color;

// $w=['cloudy','sunny','typhoon'];

// foreach($w as $condition){
//     echo $condition, '<br>';
// }
function add(){
    $tot=0;
    foreach(func_get_args() as $n){
        if(!is_int($n)){
            continue;
        }
        $tot+=$n;
    }
    echo $tot;
}
add(1,45,674,"tom");
