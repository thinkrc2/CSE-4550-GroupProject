<?php

session_start();

session_destroy();

header("Location: index.php"); //"index.html" needs to be updated with php
exit;