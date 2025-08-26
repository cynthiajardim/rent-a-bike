<?php

class GestorLocacao {
    public function __construct(private RepositorioLocacao $repositorioLocacao, private RepositorioCliente $repositorioCliente, private Transacao $transacao, private Autenticador $autenticador){
        $this->autenticador->abrirSessao();
    }

    /**
     * Salva uma locação
     *
     * @param array{
     *   cliente: string|int,
     *   funcionario: string|int|null,
     *   numeroDeHoras: string|int,
     *   itens: array<int, array{
     *     item: array{
     *       id: int,
     *       codigo: string,
     *       descricao: string,
     *       modelo: string,
     *       fabricante: string,
     *       valorPorHora: float,
     *       disponibilidade: bool,
     *       tipo: string
     *     },
     *     precoLocacao: float,
     *     subtotal: float
     *   }>
     * } $dadosLocacao
     *
     * @return void
     * @throws DominioException
     * @throws Exception
     */
    public function salvarLocacao(array $dadosLocacao) : void {
       try{
            $this->autenticador->verificarSeUsuarioEstaLogado();
            $this->autenticador->verificarPermissao(AutorizadorAcoes::CADASTRAR);
            
            $this->transacao->iniciar();

            $cliente = $this->repositorioCliente->coletarComId(intval($dadosLocacao['cliente']));
            $funcionario = $this->autenticador->obterFuncionarioLogado();
            
            $itensLocacao = [];
            foreach($dadosLocacao['itens'] as $itemLocacao){
                $item = $this->transformarEmItem($itemLocacao['item']);
                $itemLocacao = $this->transformarEmItemLocacao($itemLocacao, $item, intval($dadosLocacao['numeroDeHoras']));
                $itensLocacao[] = $itemLocacao;
            }   
            
            $locacao = new Locacao(0, $itensLocacao, $cliente, $funcionario, new DateTime(), intval($dadosLocacao['numeroDeHoras']));

            $problemas = $locacao->validar();
            if(count($problemas) > 0){
                throw new DominioException(implode('\n', $problemas));
            }

            $this->repositorioLocacao->adicionar($locacao);

            $this->transacao->finalizar();
        }catch(DominioException $e){
            $this->transacao->desfazer();
            throw $e;
        } catch(Exception $e){
            $this->transacao->desfazer();
            throw $e;
        }
    }

    /**
     * Transforma um array com dados do Item em um objeto de Item
     * @param  array{
     *          id:string|int,
     *          codigo:string,
     *          descricao:string,
     *          modelo:string,
     *          fabricante:string,
     *          valorPorHora:float|int,
     *          disponibilidade:int|bool,
     *          tipo:string
     * } $dadosItem
     * @return Item
     * @throws DominioException
     */
    private function transformarEmItem(array $dadosItem) : Item {
        $item = new Item(intval($dadosItem['id']), $dadosItem['codigo'], $dadosItem['descricao'], $dadosItem['modelo'], $dadosItem['fabricante'], floatval($dadosItem['valorPorHora']), boolval($dadosItem['disponibilidade']), $dadosItem['tipo']);

        $problemas = $item->validar();
        if(count($problemas) > 0){
            throw new DominioException(implode('\n', $problemas));
        }

        return $item;
    }

    /**
     * Transforma um array com dados da locação e do Item em um objeto de ItemLocacao
     * @param array{
     *          precoLocacao:float
     * } $dadosItemLocacao
     * @param Item $item
     * @param int $horas
     * @return ItemLocacao
     * @throws DominioException
     */
    private function transformarEmItemLocacao(array $dadosItemLocacao, Item $item, int $horas) : ItemLocacao{
        $itemLocacao = new ItemLocacao(0, $item, $dadosItemLocacao['precoLocacao']);
        $itemLocacao->calculaSubtotal($horas);

        $problemas = $itemLocacao->validar();
        if(count($problemas)){
            throw new DominioException(implode('\n', $problemas));
        }

        return $itemLocacao;
    }

    /**
     * Coleta todas as locações
     * @return array<Locacao>
     * @throws DominioException
     * @throws Exception
     */
    public function coletarTodos() : array {
        try{
            $this->autenticador->verificarSeUsuarioEstaLogado();
            $this->autenticador->verificarPermissao(AutorizadorAcoes::LISTAR);

            $locacoes = [];
            $locacoes = $this->repositorioLocacao->coletarTodos();

            return $locacoes;
        } catch(Exception $e){
            throw $e;
        }
    }

    /**
     * Coleta uma locação ou array de locações com array de parâmetros
     * @param array<string,string> $parametros
     * @throws Exception
     * @throws DominioException
     * @return array<Locacao> | Locacao
     */
    public function coletarCom(array $parametros): array | Locacao{
        try{
            $this->autenticador->verificarSeUsuarioEstaLogado();
            foreach($parametros as &$p){
                $p = htmlspecialchars($p);
            }
            return $this->repositorioLocacao->coletarComParametros($parametros);
        }catch( DominioException $e){
            throw $e;
        }catch(Exception $e){
            throw $e;
        }
    }
}