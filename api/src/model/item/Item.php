<?php
require_once __DIR__.'/../../infra/util/validarId.php';


class Item implements \JsonSerializable{
    const TAM_CODIGO = 8;
    const TAM_MIN_STRING = 2;
    const TAM_MAX_DESCRICAO = 200;
    const TAM_MAX_MODELO = 60;
    const TAM_MAX_FABRICANTE = 60;

    private int    $id;
    private string $codigo;
    private string $descricao;
    private string $modelo;
    private string $fabricante;
    private float  $valorPorHora;
    private bool   $disponibilidade;
    private string $tipo;

    public function  __construct(int | null $id, string $codigo, string $descricao, string $modelo, string $fabricante, float $valorPorHora, bool $disponibilidade, string $tipo){
        $this->id = $id;
        $this->codigo = $codigo;
        $this->descricao = $descricao;
        $this->modelo = $modelo;
        $this->fabricante = $fabricante;
        $this->valorPorHora = $valorPorHora;
        $this->disponibilidade = $disponibilidade;
        $this->tipo = $tipo;
    }

    public function setId(int $id): void {
        $this->id = $id;
    }

    public function getId(): int {
        return $this->id;
    }

    public function setCodigo(string $codigo): void {
        $this->codigo = $codigo;
    }

    public function getCodigo(): string {
        return $this->codigo;
    }

    public function setDescricao(string $descricao): void {
        $this->descricao = $descricao;
    }

    public function getDescricao(): string {
        return $this->descricao;
    }

    public function setModelo(string $modelo): void {
        $this->modelo = $modelo;
    }

    public function getModelo(): string {
        return $this->modelo;
    }

    public function setFabricante(string $fabricante): void {
        $this->fabricante = $fabricante;
    }

    public function getFabricante(): string {
        return $this->fabricante;
    }

    public function setValorPorHora(float $valorPorHora): void {
        $this->valorPorHora = $valorPorHora;
    }

    public function getValorPorHora(): float {
        return $this->valorPorHora;
    }

    public function setDisponibilidade(bool $disponibilidade): void {
        $this->disponibilidade = $disponibilidade;
    }

    public function getDisponibilidade(): bool {
        return $this->disponibilidade;
    }

    public function setTipo(string $tipo): void {
        $this->tipo = $tipo;
    }

    public function getTipo(): string {
        return $this->tipo;
    }

    /**
     * Valida dados de item.
     * @return array<string>
     */
    public function validar() : array {
        $problemas = [];
        $problemas = validarId($this->id);

        if($this->valorPorHora <= 0){
            $problemas[] = "Valor por hora inválido. O valor deve ser maior do que R$0,00.";
        }

        if(mb_strlen($this->codigo) != self::TAM_CODIGO){
            $problemas[] = "O código deve ter 8 caracteres.";
        }
        
        if(mb_strlen($this->modelo) < self::TAM_MIN_STRING || mb_strlen($this->modelo) > self::TAM_MAX_MODELO){
            $problemas[] = "O modelo deve ter entre ".self::TAM_MIN_STRING." e ".self::TAM_MAX_MODELO." caracteres.";
        }

        if(mb_strlen($this->descricao) < self::TAM_MIN_STRING || mb_strlen($this->descricao) > self::TAM_MAX_DESCRICAO){
            $problemas[] = "A descrição deve ter entre ".self::TAM_MIN_STRING." e ".self::TAM_MAX_DESCRICAO." caracteres.";
        }

        if(mb_strlen($this->fabricante) < self::TAM_MIN_STRING || mb_strlen($this->fabricante) > self::TAM_MAX_FABRICANTE){
            $problemas[] = "O fabricante deve ter entre ".self::TAM_MIN_STRING." e ".self::TAM_MAX_FABRICANTE." caracteres.";
        }

        if(!TipoItem::isValid($this->tipo)){
            $problemas[] = "Tipo de item inválido.";
        }

        return $problemas;
    }

    /**
     * Serializa item para manuseio da API.
     * @return array{codigo: string, descricao: string, disponibilidade: bool, fabricante: string, id: int, modelo: string, tipo: string, valorPorHora: float}
     */
    public function jsonSerialize(): mixed {
        return [
            'id'                => $this->id,
            'codigo'            => $this->codigo,
            'descricao'         => $this->descricao,
            'modelo'            => $this->modelo,
            'fabricante'        => $this->fabricante,
            'valorPorHora'      => $this->valorPorHora,
            'disponibilidade'   => $this->disponibilidade,
            'tipo'              => $this->tipo
        ];
    }
}