<?php
    $currentDirectory = getcwd();
    $uploadDirectory = "/qbank/";

    $errors = []; 

    $fileExtensionsAllowed = ['jpeg','jpg','png','json','txt'];  

    $fileName = $_FILES['the_file']['name'];
    $fileSize = $_FILES['the_file']['size'];
    $fileTmpName  = $_FILES['the_file']['tmp_name'];
    $fileType = $_FILES['the_file']['type'];
    $fileExtension = strtolower(end(explode('.',$fileName)));

    $uploadPath = $currentDirectory . $uploadDirectory . basename($fileName); 

   // $dir=$currentDirectory . $uploadDirectory;
  //  $dirlist = scandir($dir);
   // print_r($dirlist);

   // echo "<pre>",print_r($dirlist),"</pre>";

    if (isset($_POST['submit'])) {

      if (! in_array($fileExtension,$fileExtensionsAllowed)) {
        $errors[] = "This file extension is not allowed. Please upload a valid file";
      }

      if ($fileSize > 5000000) {
        $errors[] = "File exceeds maximum size (5MB)";
      }

      if (empty($errors)) {
        $didUpload = move_uploaded_file($fileTmpName, $uploadPath);

        if ($didUpload) {
          echo "The file " . basename($fileName) . " has been uploaded at ".$uploadPath;

        } else {
          echo "An error occurred. Please contact the administrator.";
        }
      } else {
        foreach ($errors as $error) {
          echo $error . "These are the errors" . "\n";
        }
      }

    }
?>