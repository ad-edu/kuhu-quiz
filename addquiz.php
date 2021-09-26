<?php
 
if(isset($_POST['submit'])){ 
	$name=trim($_POST["quizName"]);
	$age=trim($_POST["quizFile"]);

    echo $name.$age;
}
?>