<?php
 
if(isset($_POST['submit'])){ 
	$quizName=trim($_POST["quizName"]);
	$fileName=trim($_POST["quizFile"]);

    echo $quizName. "---" . $fileName;
}
?>