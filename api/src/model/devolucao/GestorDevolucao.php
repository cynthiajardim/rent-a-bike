<?php
use Slim\Psr7\UploadedFile as UploadedFile;

class GestorDevolucao{
    public function __construct(private RepositorioDevolucao $repositorioDevolucao, private RepositorioLocacao $repositorioLocacao, private GestorAvaria $gestorAvaria, private Transacao $transacao, private Autenticador $autenticador){
        $this->autenticador->abrirSessao();
    }

    /**
     * Salva uma devolução
     * @param array{
     *          dataDeDevolucao:string,
     *          locacao:string,
     *          avariasItens:array<int,array{
        *          dataHora:string,
        *          item:string,
        *          funcionario:string,
        *          descricao:string,
        *          valor:string
     *          }>,
     *          itensParaLimpeza:array<int,string|int>
     * }$dados
     * @param array<string|int,array<string,UploadedFile>> $imagens
     * @return void
     */
    public function salvarDevolucao(array $dados, array $imagens): void{
        $dataDeDevolucaoString = htmlspecialchars($dados["dataDeDevolucao"]);
        $locacaoId = htmlspecialchars($dados["locacao"]);
        if(!$dataDeDevolucaoString || !$locacaoId){
            throw new DominioException("Locação ou data de devolução não foram enviados.");
        }
        try{
            $this->autenticador->verificarSeUsuarioEstaLogado();
            $this->autenticador->verificarPermissao(AutorizadorAcoes::CADASTRAR);

            $this->transacao->iniciar();
            $locacao = $this->repositorioLocacao->coletarComParametros(['id' => $locacaoId, 'verificarAtivo' => '1']);
            if($locacao == null){
                throw new DominioException("Locação não encontrada com id " . $locacaoId);
            }
            $funcionario = $this->autenticador->obterFuncionarioLogado();
    
            $avariasItens = !empty($dados['avariasItens']) ? $dados['avariasItens'] : [];
            $itensParaLimpeza = !empty($dados['itensParaLimpeza']) ? $dados['itensParaLimpeza'] : [];

            $devolucao = $this->instanciarDevolucao($locacao[0], $dataDeDevolucaoString, $funcionario, $avariasItens, $itensParaLimpeza);
        
            $this->repositorioDevolucao->adicionar($devolucao);
            if(!empty($dados['avariasItens'])){
                $this->gestorAvaria->salvarAvarias($dados['avariasItens'], $imagens, $devolucao->getId());
            }

            $this->transacao->finalizar();
        } catch(Exception $e){
            $this->transacao->desfazer();
            throw $e;
        }
    }

    /**
     * Coleta todas as devoluções
     * @return array<Devolucao>
     */
    public function coletarDevolucoes():array{
        try{            
            $this->autenticador->verificarSeUsuarioEstaLogado();
            $this->autenticador->verificarPermissao(AutorizadorAcoes::LISTAR);

            return $this->repositorioDevolucao->coletarTodos();
        } catch(Exception $e){
            throw $e;
        }
    }

    /**
     * Coleta devoluções para preencher gráfico
     * @param array<string, string> $dados
     * @throws \DominioException
     * @return DevolucaoGraficoDTO[]
     */
    public function coletarDevolucoesParaGrafico(array $dados): array{
        try{
            $this->autenticador->verificarSeUsuarioEstaLogado();
            $this->autenticador->verificarPermissao(AutorizadorAcoes::EXIBIR_RELATORIO_DEVOLUCOES);
            
            $dataInicial = htmlspecialchars($dados["dataInicial"] ?? "");
            $dataFinal = htmlspecialchars($dados["dataFinal"] ?? "");
            if($dataInicial === ''){
                $dataInicial = date('Y-m-01');
            }
            if($dataFinal === ''){
                $dataFinal = date('Y-m-t');
            }

            $dataInicial = new DateTime($dataInicial);
            $dataFinal = new DateTime($dataFinal);
            
            if($dataInicial > new DateTime()){
                throw new DominioException("A data inicial não pode ser maior que a data atual.");
            }
            if($dataFinal < $dataInicial){
                throw new DominioException("A data final não pode ser menor que a data inicial.");
            }
        
            return $this->repositorioDevolucao->coletarDevolucoesPorData($dataInicial->format('Y-m-d H:i:s'), $dataFinal->format('Y-m-d H:i:s'));
        }catch(Exception $e){
            $this->transacao->desfazer();
            throw $e;
        }
    }

    /**
     * Instaciar devolução.
     * @throws DominioException
     * @param Locacao $locacao
     * @param Funcionario $funcionario
     * @param string $dataDeDevolucaoString
     * @param array<int,array{
     *          dataHora:string,
     *          item:string,
     *          funcionario:string,
     *          descricao:string,
     *          valor:string
     * }> $dadosAvarias
     * @param array<int,string|int> $itensParaLimpeza
     * @return Devolucao
     */
    private function instanciarDevolucao(Locacao $locacao, string $dataDeDevolucaoString, Funcionario $funcionario, array $dadosAvarias, array $itensParaLimpeza = []): Devolucao{
        $dataDeDevolucao = $this->transformarData($dataDeDevolucaoString);
        $devolucao = new Devolucao('1', $locacao, $dataDeDevolucao, $funcionario);

        $valorASerPago = $devolucao->calcularValorASerPago($dadosAvarias, $itensParaLimpeza);
    
        $devolucao->setValorPago($valorASerPago);
        $problemas = $devolucao->validar();
        if(!empty($problemas)){
            throw new DominioException(implode('\n', $problemas));
        }
        return $devolucao;
    }

    /**
     * Transforma data em string para DateTime
     * @param string $data
     * @return DateTime
     */
    private function transformarData(string $data): DateTime{
        $dataDevolucao = new DateTime($data);
        $dataDevolucao->setTimezone(new DateTimeZone('America/Sao_Paulo'));
        $dataFormatada = $dataDevolucao->format('Y-m-d H:i:s');
        return new DateTime($dataFormatada);
    }
}