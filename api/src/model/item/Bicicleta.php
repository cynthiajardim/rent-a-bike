<?php
require_once __DIR__.'/../../infra/util/validarId.php';

class Bicicleta extends Item{
    private int $id;
    private int $idItem;
    private string $numeroSeguro;

    public function __construct(null | int $id, null | int $idItem, string $numeroSeguro, string $codigo, string $descricao, string $modelo, string $fabricante, float $valorPorHora, bool $disponibilidade, string $tipo){
        $this->id = $id;
        $this->idItem = $idItem;
        $this->numeroSeguro = $numeroSeguro;
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

    public function setNumeroSeguro(string $numeroSeguro): void{
        $this->numeroSeguro = $numeroSeguro;
    }

    public function getNumeroSeguro(): string{
        return $this->numeroSeguro;
    }

    /**
     * Valida dados de bicicleta.
     * @return array<string>
     */
    public function validar(): array{
        $problemas = [];
        $problemas = validarId($this->id);

        return $problemas;
    }
}