<?php
require_once __DIR__.'/../../infra/util/validarId.php';

class Equipamento extends Item{
    private int $id;
    private int $idItem;

    public function __construct(null | int $id, null | int $idItem, string $codigo, string $descricao, string $modelo, string $fabricante, float $valorPorHora, bool $disponibilidade, string $tipo){
        $this->id = $id;
        $this->idItem = $idItem;
        parent::__construct($idItem, $codigo, $descricao, $modelo, $fabricante, $valorPorHora, $disponibilidade, $tipo);
    }

    public function setId(int $id): void{
        $this->id = $id;
    }

    public function getId(): int{
        return $this->id;
    }

    public function setIdItem(int $idItem): void{
        $this->idItem = $idItem;
    }

    public function getIdItem(): int{
        return $this->idItem;
    }

    /**
     * Valida dados de equipamento.
     * @return array<string>
     */
    public function validar() : array {
        $problemas = [];
        $problemas = validarId($this->id);

        return $problemas;
    }
}