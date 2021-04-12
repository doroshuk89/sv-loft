<?php

namespace atlasBitrixRestApi;

use Pimple\Container as Pimple;
use GuzzleHttp\Client;
use GuzzleHttp\Psr7\Request;

class BootLoader {
    
    static public function registerFactory () {
            $container = new Pimple();
                //GuzzleHttpClient
                $container['http'] = function () {
                    return new Client();
                };
        return $container;
    }
}
