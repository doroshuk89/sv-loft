<?php


namespace atlasBitrixRestApi\Interfaces;


interface ClientInterface
{
    //Функция получения uri для отправки запросов
    public function get_full_URI();
    
    //Добавление нового лида в битрикс24
    public function createLead (array $data);
    
    //Получение всех лидов 
    public function getLeads();
}