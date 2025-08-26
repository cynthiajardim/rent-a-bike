<?php
require_once __DIR__.'/../../infra/util/validarId.php';

class Locacao implements \JsonSerializable{
    const PORCENTAGEM_DESCONTO = 0.1; 

    private string | int $id;
    /**
     * @var array<ItemLocacao>
     */
    private $itensLocacao = [];
    private Cliente $cliente;
    private Funcionario $funcionario;
    private DateTime $entrada;
    private int $numeroDeHoras;
    private float $desconto;
    private float $valorTotal;
    private DateTime $previsaoDeEntrega;

    /**
     * @param array<ItemLocacao> $itens
     */
    public function __construct(string|int $id, array $itens, Cliente $cliente, Funcionario $funcionario, DateTime $entrada, int $numeroDeHoras){
        $this->id = $id;
        $this->itensLocacao = $itens;
        $this->cliente = $cliente;
        $this->funcionario = $funcionario;
        $this->entrada = $entrada;
        $this->numeroDeHoras = $numeroDeHoras;
        $this->valorTotal = $this->calculaValorTotal();
        $this->desconto = $this->calculaDesconto();
        $this->previsaoDeEntrega = $this->calculaEntrega();
    }

    public function getId(): string|int {
        return $this->id;
    }

    public function setId(string|int $id): void {
        $this->id = $id;
    }

    /**
     * @return array<ItemLocacao>
     */
    public function getItensLocacao(): array {
        return $this->itensLocacao;
    }

    /**
     * @param array<ItemLocacao> $itens
     */
    public function setItensLocacao(array $itens): void {
        $this->itensLocacao = $itens;
    }

    public function getCliente(): Cliente {
        return $this->cliente;
    }

    public function setCliente(Cliente $cliente): void {
        $this->cliente = $cliente;
    }

    public function getFuncionario(): Funcionario {
        return $this->funcionario;
    }

    public function setFuncionarioId(Funcionario $funcionarioId): void {
        $this->funcionario = $funcionarioId;
    }

    public function getEntrada(): DateTime {
        return $this->entrada;
    }

    public function setEntrada(DateTime $entrada): void {
        $this->entrada = $entrada;
    }

    public function getNumeroDeHoras(): int {
        return $this->numeroDeHoras;
    }

    public function setNumeroDeHoras(int $numeroDeHoras): void {
        $this->numeroDeHoras = $numeroDeHoras;
    }

    public function getDesconto(): float {
        return $this->desconto;
    }

    public function setDesconto(float $desconto): void {
        $this->desconto = $desconto;
    }

    public function getValorTotal(): float {
        return $this->valorTotal;
    }

    public function setValorTotal(float $valorTotal): void {
        $this->valorTotal = $valorTotal;
    }

    public function getPrevisaoDeEntrega(): DateTime {
        return $this->previsaoDeEntrega;
    }

    public function setPrevisaoDeEntrega(DateTime $previsaoDeEntrega): void {
        $this->previsaoDeEntrega = $previsaoDeEntrega;
    }

    /**
     * Calcula valor total da Locação
     * @return float
     */
    public function calculaValorTotal() : float {
        $total = 0.0;

        /** @var ItemLocacao */
        foreach($this->itensLocacao as $itemLocacao){
            $total += $itemLocacao->getSubtotal();
        }

        return $total;
    }

    /**
     * Calcula desconto
     * @return float
     */
    public function calculaDesconto() : float {
        $desconto = 0.0;
        if($this->numeroDeHoras > 2)
            $desconto = $this->valorTotal * self::PORCENTAGEM_DESCONTO;

        return $desconto;
    }

    /**
     * Calcula data de entrega prevista
     * @return DateTime
     */
    public function calculaEntrega() : DateTime {
        $entrega = clone $this->entrada;
        $entrega->add(new DateInterval("PT{$this->numeroDeHoras}H"));

        return $entrega;
    }

    /**
     * Serializa objeto para JSON para manuseio da API
     * @return array{cliente: Cliente, entrada: string, funcionario: Funcionario, horas: int, id: int|string, itensLocacao: ItemLocacao[], previsaoDeEntrega: string, valorTotal: float}
     */
    public function jsonSerialize(): mixed {
        return [
            'id'                => $this->id,
            'cliente'           => $this->cliente,
            'funcionario'       => $this->funcionario,
            'itensLocacao'      => $this->itensLocacao,
            'entrada'           => $this->entrada->format('Y-m-d H:i:s'),
            'horas'             => $this->numeroDeHoras,
            'valorTotal'        => $this->valorTotal,
            'previsaoDeEntrega' => $this->previsaoDeEntrega->format('Y-m-d H:i:s')
        ];
    }

    /**
     * Valida dados de Locação
     * @return array<string>
     */
    public function validar(): array { 
        $problemas = validarId($this->id);

        if($this->entrada > new DateTime()){
            array_push($problemas, "A data de entrada não pode ser posterior a atual.");
        }

        if($this->numeroDeHoras <= 0){
            array_push($problemas, "O número de horas deve ser maior que 0.");
        }

        if($this->desconto < 0.0){
            array_push($problemas, "O desconto não pode ser menor que 0.");
        }

        if($this->valorTotal < 0.0){
            array_push($problemas,"Valor total não pode ser menor que 0.");
        }

        if($this->previsaoDeEntrega < $this->entrada){
            array_push($problemas, "A previsão de entrega deve ser posterior a data de entrada.");
        }

        return $problemas;
    }
}