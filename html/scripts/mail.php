<?php

//Корень сайта
$root = rtrim($_SERVER['DOCUMENT_ROOT']);
// Лог для почты
$emailLog = $root.'/log/email-transfer.log';

ini_set('display_errors', 0);
ini_set('log_errors', 1);
ini_set('error_log', $root.'/log/errors_log.log');

//Composer
require_once $root.'/vendor/autoload.php';

use \Respect\Validation\Validator;
use \Respect\Validation\Exceptions\ValidationException;
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception as PhpMailerExceptions;

//File Settings
$config = file_get_contents("config.json");
$option = json_decode($config, true);

//Функция очистки от тегов и лишних пробелов
function clear_str($str) {
    return strip_tags(trim($str));
}
//функция передачи json ответа в js
function response ($message, $status) {
    echo json_encode([
        "status" => $status,
        "message" => $message,
    ]);
}
//фунция записи в файл
function emailLog (array $data, $file, $status) {
    if (is_file($file) && is_writable($file)) {
                $str = "[".date('d.m.Y H:i')."] :: ".$status . ":: ";
                $str.= implode(" / ", $_POST)."\r\n";
            file_put_contents($file, $str, FILE_APPEND);
    }else {
        throw new Exception("Нет доступа к файлу - ". $file);
    }
}

//Очистка от пробелов и тегов
if (isset($_POST) && !empty($_POST)) {
                //Очиста от тегов
                foreach ($_POST as &$item) {
                        $item = clear_str($item);
                    unset($item);
                }
        }

 try{
     //Валидация с помощью Respect Validation
     if (isset($_POST) && !empty($_POST)) {
            foreach ($_POST as $key=>$item) {
                switch ($key) {
                    case 'email':
                            Validator::email()->notEmpty()->assert($item);
                        break;
                    default:
                            Validator::notEmpty()->assert($item);
                }
         }
     }

     //Адрес указаный пользователем для связи с ним
     $email_reply = (isset($_POST['email']))?$_POST['email']:'';
     $title = "SV-LOFT || Запрос с сайта";
     /*=============================================================================*/
     //Template for mail
             $body = "<!DOCTYPE html>"; // создаем тело письма
             $body .= "<html><head>"; // структуру я минимизирую, шаблонов в сети много, либо создайте свой
             $body .= "<meta charset='UTF-8' />";
             $body .= "<title>".$title."</title>";
             $body .= "</head><body>";
             $body .= "<table><tr><td>";
             $body .= "<table style='width:600px; border-spacing: 10px; border: 1px solid silver; padding: 10px; font-size:20px;'><tr><td>";
             $body .= "<tr style='height: 150px;'><td valign='top' style='padding:0' bgcolor='#ffffff'>
                <a href='#'>
                        <img src='http://p29820n8.beget.tech/loft/img/email-header-loft.jpg' alt='' border='0' style='display: block; border-radius: 4px;' />
                </a>
                </td></tr>";
             $body .= "<tr><td ><h3 style='text-align:center; border-bottom: 1px solid silver; color:#d61c22;'>".$title."</h3></td></tr>";
                $i =0;
             foreach ($_POST as $value) {
                 $body .= "<tr><td><strong>".++$i.")</strong> ".nl2br($value)."</td></tr>";
             }
             $body .= "<tr><td></td></tr>";
             $body .= "<tr style='cellpadding: 10px;'><td style='text-align:center; border-top: 1px solid silver;'><em>All rights reserved | Copyright &copy; Atlas&Comp ".date("d-m-Y")."</em></td></tr>";
             $body .= "</table></td></tr></table>";
             $body .= "</body></html>";
     /*=============================================================================*/

     $mail = new PHPMailer(true); // Создаем экземпляр класса PHPMailer
     $mail->IsSMTP(); // Указываем режим работы с SMTP сервером
     $mail->Host       = $option['host'];  // Host SMTP сервера: ip или доменное имя
     $mail->SMTPDebug  = $option['debug'];  // Уровень журнализации работы SMTP клиента PHPMailer
     $mail->SMTPAuth   = $option['auth'];  // Наличие авторизации на SMTP сервере
     $mail->Port       = $option['port'];  // Порт SMTP сервера
     $mail->SMTPSecure = $option['secure'];  // Тип шифрования. Например ssl или tls
     $mail->CharSet="UTF-8";  // Кодировка обмена сообщениями с SMTP сервером
     $mail->Username   = $option['username'];  // Имя пользователя на SMTP сервере
     $mail->Password   = $option['password'];  // Пароль от учетной записи на SMTP сервере
     $mail->AddAddress ($option['addAddress'], 'W');  // Адресат почтового сообщения
     $mail->AddReplyTo($email_reply, 'Client');  // Альтернативный адрес для ответа
     $mail->SetFrom($option['username'], $option['mail_name']);  // Адресант почтового сообщения
     $mail->Subject = htmlspecialchars($title);  // Тема письма
     $mail->MsgHTML($body); // Текст сообщения

     if ($mail->send()) {
         response("Ожидайте. Мы свяжемся с вами!", true);
         emailLog($_POST, $emailLog, 'SUCCESS TRANSFER');


     }else {
         response('Ошибка! Попробуйте позже', false);
         emailLog($_POST, $emailLog, 'ERROR TRANSFER');
     };
 }

catch(ValidationException $ex){
        //Запись в лог Ошибки
        error_log("Ошибка валидации -". $ex->getFullMessage(), 0);
        response("Проверьте правильность введенных данных", false);
     return FALSE;
 }
catch (PhpMailerExceptions $e) {
        //Запись в лог Ошибки
        error_log("Ошибка PhpMailer передачи почты - ". $e->errorMessage(), 0);
        response("Ошибка передачи. Попробуйте позже!", false);
    return FALSE;
}
catch (Exception $e) {
    //Исключение при ошибки записи в файл
    error_log($e->getMessage(), 0);
}

