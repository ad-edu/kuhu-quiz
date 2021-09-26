<?php
 
if(isset($_POST['submit'])){ 
	$quizName=trim($_POST["quizName"]);
	$fileName=trim($_POST["quizFile"]);

    $fileName='qbank/'.$fileName
    echo $quizName. "======" . $fileName;

    // read json file
$data = file_get_contents('qbank/quizes.json');

// decode json
$json_arr = json_decode($data, true);

// add data
$json_arr[] = array('name'=>$quizName, 'quizData'=>$fileName);

// encode json and save to file
file_put_contents('qbank/quizes.json', json_encode($json_arr));
}
?>