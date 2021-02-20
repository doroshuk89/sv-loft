<?php

namespace MyClasses;
    
class GalleryPhoto {
    
    public function getDataPhotoJsonFile ($path, $filename, $typeData = 'array') {
        
        //Тип возращаемый данных
        if($typeData == 'array'){
            $typeReturnData = true;
        }else if ($typeData == 'object') {
            $typeReturnData = false;
        }
        //file jsonData 
        $gallery_file = $path.$filename;
            if (file_exists($gallery_file)) {
                $gallery = file_get_contents($gallery_file);
                if($gallery){
                    return json_decode($gallery, $typeReturnData);
                }else {
                    throw new \CustomException\FileException("Ошибка получения файла ({$gallery_file})");
                }
            }else throw new \CustomException\FileException("Указаный файл json ({$gallery_file}) c информацией о фото не найден");
    }
    
}
