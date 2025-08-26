<?php

class GestorItem{
    public function __construct(private RepositorioItem $repositorioItem, private Autenticador $autenticador){
        $this->autenticador->abrirSessao();
    }

    /**
     * Coleta um item com o código informado
     * @param string $codigo
     * @return array<string,Item|string>
     * @throws Exception
     */
    public function coletarComCodigoEAvaria(string $codigo) : array{
        try{
            $this->autenticador->verificarSeUsuarioEstaLogado();
            $dadosItem = $this->repositorioItem->coletarComCodigoEAvaria($codigo);

            return $dadosItem;
        }catch(Exception $e){
            throw $e;
        }
    }

    /**
     * Coleta dados dos itens para o relatório de Itens Alugados
     * @param array<string,string> $parametros
     * @return array<ItemRelatorioDTO>
     * @throws Exception
     */
    public function coletarItensParaRelatorio(array $parametros) : array {
        try{
            $this->autenticador->verificarSeUsuarioEstaLogado();
            $this->autenticador->verificarPermissao(AutorizadorAcoes::EXIBIR_RELATORIO_ITENS);
            
            $dataInicial = !empty($parametros['dataInicial']) ? (new DateTime($parametros['dataInicial'])) : new DateTime('first day of this month');
            $dataFinal = !empty($parametros['dataFinal']) ? (new DateTime($parametros['dataFinal'])) : new DateTime('last day of this month');

            if($dataInicial > new DateTime())
                throw new DominioException("Data inicial não deve ser maior do que a data atual");
            if($dataFinal < $dataInicial)
                throw new DominioException("Data final não deve ser menor do que a data inicial");


            $dataInicialString = $dataInicial->format("Y-m-d H:i:s");
            $dataFinalString = $dataFinal->format("Y-m-d H:i:s");

            $dadosRelatorio = $this->repositorioItem->coletarDadosParaRelatorio($dataInicialString, $dataFinalString);
            $itens = $dadosRelatorio['itens'];
            $totalLocacoes = $dadosRelatorio['totalLocacoes'];

            $dadosItensRelatorio = [];
            if(count($itens) > 10){
                $somatorioDoTop10 = 0;
                for($i = 0; $i < 10; $i++){
                    $qtd = intval($itens[$i]['qtdVezesAlugado']);
                    $somatorioDoTop10 += $qtd;
                    $dadosItensRelatorio[] = $this->gerarItemRelatorioDTO($itens[$i]['codigo'], $qtd, $totalLocacoes, $itens[$i]['descricao']);
                }

                $somatorioOutros = intval($totalLocacoes) - $somatorioDoTop10;
                $dadosItensRelatorio[] = $this->gerarItemRelatorioDTO('', (int)$somatorioOutros, $totalLocacoes, "Outros");
            } else {                
                foreach($itens as $item){
                    $dadosItensRelatorio[] = $this->gerarItemRelatorioDTO($item['codigo'], $item['qtdVezesAlugado'], $totalLocacoes, $item['descricao']);
                }
            }

            return $dadosItensRelatorio;
        }catch(Exception $e){
            throw $e;
        }
    }

    /**
     * Retorna um objeto de ItemRelatorioDTO
     * @param string $codigo
     * @param string|int $qtdVezesAlugado
     * @param string|int $qtdTotalLocacoes
     * @param string $descricao
     * @return ItemRelatorioDTO
     */
    private function gerarItemRelatorioDTO(string $codigo, string|int $qtdVezesAlugado, string|int $qtdTotalLocacoes, string $descricao) : ItemRelatorioDTO{
        $porcentagem = intval($qtdVezesAlugado)/intval($qtdTotalLocacoes);
        return new ItemRelatorioDTO($codigo, intval($qtdVezesAlugado), $descricao, floatval($porcentagem));
    }
}