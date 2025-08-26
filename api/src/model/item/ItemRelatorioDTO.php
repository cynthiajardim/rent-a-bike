<?php

class ItemRelatorioDTO implements \JsonSerializable{
    public function __construct(private string $codigo, private int $qtdVezesAlugado,  private string $descricao, private float $porcentagem){
        
    }

    public function jsonSerialize(): mixed{
        return [
            "codigo"    => $this->codigo,
            "descricao" => $this->descricao,
            "qtdVezesAlugado" => $this->qtdVezesAlugado,
            "porcentagem" => $this->porcentagem
        ];
    }
}