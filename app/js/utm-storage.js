(function ($) {
    "use strict";
    
    //Объявляем коллекцию (ассоциативный массив)
    var arr_utm = new Map();
    
    //full uri
    var url = decodeURIComponent(window.location.href);
    //строка параметров запроса
    var queryString = decodeURIComponent(window.location.search.substring(1));
    
    
    var uri = new URL(url);
    var urlParams = new URLSearchParams(queryString); 
    
    if(urlParams.has("utm_source")) {
        arr_utm.set("utm_source", urlParams.get("utm_source"));
    }
    
    
    
    //console.log(queryString);
    
    
    //var utm = {};
    //Создаем ассоциативный массив используя объект Map
    //var arr_utm = new Map();
    
    //arr_utm.set("utm_sourc2e", "vk");
    //arr_utm.set("utm_content", "cpc");
    
    var json_utm = JSON.stringify(arr_utm);
    
    alert(arr_utm.size);
    
    console.log((json_utm));
   
    
    
    
    
    
    
    
    
    
    var person = {
            name: "Иван",
            age: 25
        };
   
   
   
   
  
   
    //console.log(JSON.stringify(arr_utm));
})();


