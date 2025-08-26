<?php
require_once __DIR__.'/../../infra/util/validarId.php';

class ItemLocacao implements \JsonSerializable {
    private int   $id = 0;
    private Item  $item;
    private float $precoLocacao;
    private float $subtotal;

    public function __construct(int $id, Item $item, float $precoLocacao){
        $this->id = $id;
        $this->item = $item;
        $this->precoLocacao = $precoLocacao;
        $this->subtotal = 0.0;
    }

    /**
     * Calcula subtotal
     * @param int $horas
     * @throws \DominioException
     * @return float
     */
    public function calculaSubtotal(int $horas) : float{
        if($horas < 0)
            throw new DominioException("Horas devem ser maior do que 0.");

        $this->subtotal = $this->precoLocacao * $horas;
        return $this->subtotal;
    }

    public function setId(int $id): void{
        $this->id = $id;
    }

    public function getId(): int{
        return $this->id;
    }

    public function setItem(Item $item): void{
        $this->item = $item;
    }

    public function getItem(): Item{
        return $this->item;
    }

    public function setPrecoLocacao(float $precoLocacao): void{
        $this->precoLocacao = $precoLocacao;
    }

    public function getPrecoLocacao(): float{
        return $this->precoLocacao;
    }

    public function setSubtotal(float $subtotal): void{
        $this->subtotal = $subtotal;
    }

    public function getSubtotal(): float{
        return $this->subtotal;
    }

    /**
     * Valida dados de ItemLocacao
     * @return array<string>
     */
    public function validar() : array {
        $problemas = [];
        $problemas = validarId($this->id);

        if($this->precoLocacao <= 0.0){
            array_push($problemas, "O preço da locação deve ser maior que 0.0 .");
        }

        if($this->subtotal <= 0.0){
            array_push($problemas, "O subtotal deve ser maior que 0.0 .");
        }

        return $problemas;
    }

    /**
     * Serializa ItemLocacao para manuseio da API.
     * @return array{id: int, item: Item, precoLocacao: float, subtotal: float}
     */
    public function jsonSerialize(): mixed {
        return [
            'id'            => $this->id,
            'item'          => $this->item,
            'precoLocacao'  => $this->precoLocacao,
            'subtotal'      => $this->subtotal
        ];
    }
}