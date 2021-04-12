<?php

session_start();

if(isset($_GET['utm_source'])) {$_SESSION['utm_source'] = $_GET['utm_source'];} else $_SESSION['utm_source'] = "formaSite";
if(isset($_GET['utm_medium'])) $_SESSION['utm_medium'] = $_GET['utm_medium'];
if(isset($_GET['utm_campaign'])) $_SESSION['utm_campaign'] = $_GET['utm_campaign'];
