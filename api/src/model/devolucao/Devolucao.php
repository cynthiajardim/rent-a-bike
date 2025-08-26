<?php
require_once __DIR__.'/../../infra/util/validarId.php';
class Devolucao implements \JsonSerializable{
    private string | int $id;
    private Locacao $locacao;
    private Funcionario $funcionario;
    private DateTime $dataDeDevolucao;
    private float $valorPago;

    public function  __construct(string | int $id, Locacao $locacao, DateTime $data, Funcionario $funcionario) {
        $this->id = $id;
        $this->locacao = $locacao;
        $this->dataDeDevolucao = $data;
        $this->funcionario = $funcionario;
    }

    public function getId() : int | string{
        return $this->id;
    }

    public function getLocacao(): Locacao{
        return $this->locacao;
    }

    public function getFuncionario(): Funcionario{
        return $this->funcionario;
    }

    public function setFuncionario(Funcionario $funcionario): void{
        $this->funcionario = $funcionario;
    }

    public function getDataDeDevolucao(): DateTime{
        return $this->dataDeDevolucao;
    }

    public function getValorPago(): float{
        return $this->valorPago;
    }

    public function setId(int $id): void{
        $this->id = $id;
    }

    public function setLocacao(Locacao $locacao): void{
        $this->locacao = $locacao;
    }

    public function setDataDeDevolucao(DateTime $dataDeDevolucao): void{
        $this->dataDeDevolucao = $dataDeDevolucao;
    }

    public function setValorPago(float $valorPago): void{
        $this->valorPago = $valorPago;
    }

    /**
	 * Valida dados do devolução.
	 * @return array<string>
	 */
    public function validar(): array {
    $problemas = validarId($this->id);

    if ($this->dataDeDevolucao > new DateTime()) {
        array_push($problemas, "A data de devolução deve ser inferior ou igual a data atual.");
    }

    if($this->dataDeDevolucao < $this->locacao->getEntrada()){
        array_push($problemas, "A data de devolução não pode ser menor do que a data de locação.");
    }

    if ($this->valorPago <= 0.0) {
        array_push($problemas, "O valor pago deve ser maior que 0.");
    }

    if($this->funcionario == null){
        array_push($problemas,"Um funcionário deve ser associado a devolução.");
    }

    if($this->locacao == null){
        array_push($problemas,"Uma locação deve ser associada a devolução.");
    }

    return $problemas;
}


    /**
     * Calcula valor a ser pago
     * @param array<int,array{
     *          dataHora:string,
     *          item:string,
     *          funcionario:string,
     *          descricao:string,
     *          valor:string
     * }> $dadosAvarias,
     * @param array<int,int|string> $itensParaLimpeza
     * @return float
     */
    public function calcularValorASerPago(array $dadosAvarias, array $itensParaLimpeza): float{
        $total = 0;
        $multa = 0;
        $taxaLimpeza = 0;
        $horasCorridas = $this->calcularHorasCorridas();
        $temAvarias = !empty($dadosAvarias);
        /**
         * @var ItemLocacao $item
         */
        foreach($this->locacao->getItensLocacao() as $item){
            $total += $item->calculaSubtotal($horasCorridas);
            if($temAvarias){
                foreach($dadosAvarias as $avaria){
                    if($avaria['item'] == $item->getItem()->getId()){
                        $multa += (float) $avaria['valor'];
                    }
                }
            }

            if(in_array($item->getItem()->getId(), $itensParaLimpeza)){
                $taxaLimpeza += (float) $item->getPrecoLocacao() * 0.1;
            }
        }
        $desconto = $this->calculaDesconto($total, $horasCorridas);
        return $total + $multa - $desconto + $taxaLimpeza;
    }

    /**
     * Calcula horas corridas da devolução
     * @return int
     */
    public function calcularHorasCorridas(): int{
        $dataLocacao = $this->locacao->getEntrada();

        $diff = $this->dataDeDevolucao->diff($dataLocacao);
        $horas = $diff->days * 24 + $diff->h + $diff->i / 60 + $diff->s / 3600;
    
        $numeroDeHoras = $this->locacao->getNumeroDeHoras();

        $horasCorridas = 0;
        if($horas == 0){
            $horas = 1;
        }if ($horas >= $numeroDeHoras && $horas <= $numeroDeHoras + 0.25) {
            $horasCorridas = $numeroDeHoras;
        }else if($horas < $numeroDeHoras){
            $horasCorridas = floor($horas) == 0 ? 1 : floor($horas);
        } else {
            $horasCorridas = ceil($horas);
        }
        return intval($horasCorridas);
    }

    /**
     * Calcula desconto
     * @param float $total
     * @param int $horasCorridas
     * @return float
     */
    public function calculaDesconto(float $total, int $horasCorridas): float{
        if ($horasCorridas > 2) {
            $desconto = $total * 0.1;
            return $desconto;
        }
        return 0.0;
    }

     /**
      * Serializa em JSON para manuseio da API
      * @return array{dataDeDevolucao: string, id: int|string, locacao: Locacao|null, funcionario: Funcionario | null, valorPago: float}
      */
     public function jsonSerialize(): mixed {
        return [
            'id'                => $this->id,
            'locacao'           => $this->locacao,
            'funcionario'      => $this->funcionario,
            'dataDeDevolucao'   => $this->dataDeDevolucao->format('Y-m-d H:i:s'),
            'valorPago'         => $this->valorPago
        ];
    }
}
