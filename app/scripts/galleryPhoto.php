<?php
    //Корень сайта
    $root = rtrim($_SERVER['DOCUMENT_ROOT']);
    //Composer
    require_once $root.'/vendor/autoload.php';
                            
    $pathFIle = $root.'/scripts/';
    //file json data for gallery
    $fileNameJson = 'projects-loft.json';

    //Создаем объект класса Галерея
    $gallery = new \MyClasses\GalleryPhoto();
    try{
        $data = $gallery->getDataPhotoJsonFile($pathFIle, $fileNameJson, 'object');
    } 
    catch (\CustomException\FileException $e) {
        echo 'Ошибка: ',  $e->getMessage(), "\n";
        exit;
    }
    catch (\Exception $e) {
        echo 'Ошибка: ',  $e->getMessage(), "\n";
        exit;
    }


 
               
              
