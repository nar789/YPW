<?php
$x1=$_GET['x1'];
$y1=$_GET['y1'];
$x2=$_GET['x2'];
$y2=$_GET['y2'];

$x=$_GET['x'];
$y=$_GET['y'];
$k=$_GET['k'];

$words=$_GET['words'];

$init=$_GET['init'];

if($init)
{
    $html_brand = "localhost:8080/init";
}
else if($k)
    $html_brand = "localhost:8080/bkq/$x/$y/$k/$words";
else    
    $html_brand = "localhost:8080/brq/$x1/$y1/$x2/$y2/$words";

$ch = curl_init();

$options = array(
    CURLOPT_URL            => $html_brand,
    CURLOPT_RETURNTRANSFER => true,
//    CURLOPT_HEADER         => true,
    CURLOPT_FOLLOWLOCATION => true,
    CURLOPT_ENCODING       => "",
    CURLOPT_AUTOREFERER    => true,
    CURLOPT_CONNECTTIMEOUT => 600,
    CURLOPT_TIMEOUT        => 600,
    CURLOPT_MAXREDIRS      => 10,
);
curl_setopt_array( $ch, $options );
$response = curl_exec($ch); 
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);

if ( $httpCode != 200 ){
    //echo "Return code is {$httpCode} \n"
        curl_error($ch);
} else {
    echo  $response;
}

curl_close($ch);

?>