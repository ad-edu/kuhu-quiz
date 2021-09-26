<?php
 
if(isset($_POST['submit'])){ 
	$quizName=trim($_POST["quizName"]);
	$fileName=trim($_POST["quizFile"]);

    echo $quizName. "======" . $fileName;

    // read json file
$data = file_get_contents('results.json');

// decode json
$json_arr = json_decode($data, true);

// add data
$json_arr[] = array('name'=>$quizName, 'quizData'=>$fileName);

// encode json and save to file
file_put_contents('results_new.json', json_encode($json_arr));
}
?>