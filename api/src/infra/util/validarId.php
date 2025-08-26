<?php


/**
 * @param string | int $texto
 * @return array<string>
 */
function validarId(int | string $texto): array{
    $problemas = [];
    if($texto === '' || !is_numeric($texto) || $texto < 0){
        array_push($problemas, "O id deve ser um número positivo. Id enviado:".$texto);
    }
    return $problemas;
}