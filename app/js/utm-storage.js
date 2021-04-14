(function ($) {
    "use strict";
    
        //Объявляем коллекцию (ассоциативный массив)
        //var arr_utm = new Map();
        var arr_utm = {};

        //full uri
        var url = decodeURI(window.location.href);

        //строка параметров запроса
        var queryString = decodeURIComponent(window.location.search.substring(1));
        //Объект url для создания и парсинга uri
        var uri = new URL(url);
        var urlParams = new URLSearchParams(queryString); 

        if(urlParams.has("utm_source")) {
            arr_utm["utm_source"] = urlParams.get("utm_source");
        }
        if(urlParams.has("utm_medium")) {
            arr_utm["utm_medium"] = urlParams.get("utm_medium");
        }
        if(urlParams.has("utm_campaign")) {
            arr_utm["utm_campaign"] = urlParams.get("utm_campaign");
        }
        if(urlParams.has("utm_content")) {
            arr_utm["utm_content"] = urlParams.get("utm_content");
        }
        if(urlParams.has("utm_term")) {
            arr_utm["utm_term"] = urlParams.get("utm_term");
        }

        if(Object.keys(arr_utm).length>0) {
            localStorage.setItem('utm-tags-atlas-plugin', JSON.stringify(arr_utm));
        }
})();


