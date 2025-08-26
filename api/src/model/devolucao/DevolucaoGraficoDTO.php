<?php

class DevolucaoGraficoDTO implements JsonSerializable{
    public function __construct(private DateTime $dataLocacao, private float $totalPagoDevolucao) {}

    /**
      * Serializa em JSON para manuseio da API
      * @return array{dataLocacao: string, totalPagoDevolucao: float}
      */
    public function jsonSerialize(): mixed {
        return [
            
            'dataLocacao'   => $this->dataLocacao->format('Y-m-d'),
            'totalPagoDevolucao'         => $this->totalPagoDevolucao
        ];
    }
}