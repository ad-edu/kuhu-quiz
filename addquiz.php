<?php
 
if(isset($_POST['submit'])){ 
	$name=trim($_POST["name"]);
	$age=trim($_POST["age"]);

    echo $name.$age;
}
?>