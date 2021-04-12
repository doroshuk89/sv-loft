<?php

namespace atlasBitrixRestApi;

use atlasBitrixRestApi\Exceptions as Custom;

use GuzzleHttp\Client;
use GuzzleHttp\Psr7\Request;
use Respect\Validation\Validator as V;
use \Respect\Validation\Exceptions\ValidationException;

class ClientBitrix implements \atlasBitrixRestApi\Interfaces\ClientInterface {
    
    public $domain;
    public $hooks;
    public $uri_api;
    
    public function __construct($domain='', $hooks ='', $uri_api='') {
        $this->domain = $this->str_clear($domain);
        $this->hooks= $this->str_clear($hooks);
        $this->uri_api = $this->str_clear($uri_api);
        $this->container = $this->loader();
    }
    
    //Сервис-контейнер
    protected function loader () {
        return BootLoader::registerFactory();
    }

    //Добавить uri api
    public function setUriApi ($uri) {
        if(isset($uri)) {
            $this->uri_api = $this->str_clear($uri);
        }
    }
    
    //Получить uri_api
    public function getUri_api() {
        return $this->uri_api;
    }
    
    //Добавить название домена bitrix24
    public function setDomain ($domain) {
        if(isset($domain)) {
            $this->domain = $this->str_clear($domain);
        }
    }
    
    //Получить domen
    public function getDomain () {
        return $this->domain;
    }
    
    //Добавить webHook
    public function setHook ($hook) {
        if(isset($hook)) {
            $this->hooks = $this->str_clear($hook);
        }
    }
    //Получить вебхук
    public function getHook () {
        return $this->hooks;
    }
    
    //Функция получения полного uri для restAPI bitrix24
    public function get_full_URI () {
        if(isset($this->domain, $this->hooks, $this->uri_api)  && !(empty($this->domain)) && !(empty($this->hooks)) && !empty($this->uri_api)) {
            return "https://".$this->domain.".bitrix24.by/".$this->hooks."/".$this->uri_api;
        }else 
            throw new Custom\DataException("Проверьте правильность указанных параметров для API (domain/hook/uriAPI)");
    }
    
   
    //Функция создания лида в bitrix24
    public function createLead (array $data_lead) {

        //Проверка контакта в битриксе с указаннами телефонном или e-mail
        $data_lead = $this->searchContactIDforPhone($data_lead);
        $data_lead = $this->searchContactIDforEmail($data_lead);
        
        $data = $this->queryBuilderCreateLead($data_lead);
        
                    $response  = $this->container['http']->request('POST', $this->get_full_URI(),
                        [
                            "body" =>  $data
                        ]);
                    
                    if ($response->getStatusCode() == 200) {
                            return json_encode(["status" => true, "message" => "Новый лид успешно добален"]);
                    }
    }
    
    //Получение всех лидов в битрикс24
    public function getLeads () {
            $response  = $this->container['http']->request('GET', $this->get_full_URI());
        return $response->getBody();
    }
    
    //Получение контактов из bitrix24
    public function getContacts ($data = []) {
            if(isset($data) && !empty($data)) {
                $data  = http_build_query($data);
                        $response = $this->container['http']->request('POST', $this->get_full_URI(), ["body" => $data]);
                }else {
                        $response = $this->container['http']->request('GET', $this->get_full_URI());
                }
        return $response->getBody();
    }
    
    //Функция удаление лишних слешей
    protected function str_clear ($str) {
        return trim($str, "/");
    }
    
    protected function queryBuilderCreateLead (array $data) {
        if(is_array($data) && !empty($data)) {
            return http_build_query(["fields" => $data]);
        }else {
            throw new Custom\DataException ("Проверьте массив данных для добавления нового лида (пустой или не массив)");
        }
    }
    
    protected function searchContactIDforPhone (array $data) {
        //Текущий uri api
        $current_hook = $this->getUri_api();
        
        if(array_key_exists("PHONE", $data) && !empty($data["PHONE"])) {
            foreach ($data["PHONE"] as $item) {
                if(isset($item["VALUE"])) {
                    $number [] = $this->validPhone($item["VALUE"]);
                }
            }
        } else {
            return $data;
        }
            
        //Проверка номера телефона на наличие в базе контактов Битрикс24
            foreach ($number as $item) {
                    $filter_phone =[
                            "filter" => [
                                "PHONE" => $item,
                            ],
                            "select" => [
                                "ID"
                            ]
                        ];
                    $this->setUriApi("crm.contact.list");
                    $result = json_decode($this->getContacts($filter_phone), true);

                    if($result["total"] > 0) {
                        $CONTACT_ID = $result["result"][0]["ID"];
                        break;
                    }
            }
         
                if(isset($CONTACT_ID) && !empty($CONTACT_ID)) {
                        $data ["CONTACT_ID"] =  $CONTACT_ID;
                }
            $this->setUriApi($current_hook);
        return $data;
    }
    
    protected function searchContactIDforEmail (array $data) {
        //Текущий uri api
        $current_hook = $this->getUri_api();
        
        if(array_key_exists("EMAIL", $data) && !empty($data["EMAIL"])) {
            foreach ($data["EMAIL"] as $item) {
                if(isset($item["VALUE"])) {
                    $number [] = $this->validEmail($item["VALUE"]);
                }
            }
        } else {
            return $data;
        }
            
        //Проверка номера телефона на наличие в базе контактов Битрикс24
            foreach ($number as $item) {
                $filter_email =[
                        "filter" => [
                            "EMAIL" => $item,
                        ],
                        "select" => [
                            "ID"
                        ]
                    ];
                
                $this->setUriApi("crm.contact.list");
                
                $result = json_decode($this->getContacts($filter_email), true);

                if($result["total"] > 0) {
                    $CONTACT_ID = $result["result"][0]["ID"];
                    break;
                }
            }
         
            if(isset($CONTACT_ID) && !empty($CONTACT_ID)) {
                $data ["CONTACT_ID"] =  $CONTACT_ID;
            }
        
        $this->setUriApi($current_hook);
        
        return $data;
    }
    
    //Валидация номера телефона с помощью RespectValidation
    protected function validPhone ($phone) {
            if(isset($phone) && !empty($phone)) {
                //Проверяем валидатором
                    V::notEmpty()->digit(' ', '+', '-', '(', ')')->assert($phone);
            }else {
                throw new Custom\DataException ("Пустое значение номера телефона адреса");
            }
        return $phone;
    }
    
    //валидация email с помощью respectValidation
    protected function validEmail ($email) {
            if(isset($email) && !empty($email)) {
                V::notEmpty()->email()->assert($email);
            }else {
                throw new Custom\DataException ("Пустое значение e-mail адреса");
            }
        return $email;
    }
}
