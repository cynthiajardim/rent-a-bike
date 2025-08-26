<?php

use Slim\Psr7\UploadedFile;

/**
 * Valida o tipo da imagem a partir de um array de tipos válidos
 * @param UploadedFile $imagem
 * @param array<string> $tiposPermitidos
 * @return bool
 */
function validarTipoImagemPermitido(UploadedFile $imagem, array $tiposPermitidos) : bool{
    $caminhoImagem = $imagem->getStream()->getMetadata('uri');

    $finfo = new finfo(FILEINFO_MIME_TYPE);
    $mimeImagem = $finfo->file($caminhoImagem);

    $infoImagem = getimagesize($caminhoImagem);
    $tipoImagem = $infoImagem != false ? $infoImagem['mime'] : '';
    
    return in_array($mimeImagem, $tiposPermitidos) && $mimeImagem == $tipoImagem;
}