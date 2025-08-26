<?php

class RepositorioItemEmBDR extends RepositorioGenericoEmBDR implements RepositorioItem{
    public function __construct(PDO $pdo){
        parent::__construct($pdo);
    }
    
    /**
     * Salva um item no banco de dados
     * @param Item $item
     * @return void
     * @throws RepositorioException
     */
    public function adicionar(Item $item) : void{
        try{
            $comando = "INSERT INTO item (codigo, descricao, modelo, fabricante, valorPorHora, disponibilidade, tipo) VALUES (:codigo, :descricao, :modelo, :fabricante, :valorPorHora, :disponibilidade, :tipo)";

            $parametros = [
                "codigo"            => $item->getCodigo(),
                "descricao"         => $item->getDescricao(),
                "modelo"            => $item->getModelo(),
                "fabricante"        => $item->getFabricante(),
                "valorPorHora"      => $item->getValorPorHora(),
                "disponibilidade"   => $item->getDisponibilidade(),
                "tipo"              => $item->getTipo()
            ];

            $this->executarComandoSql($comando, $parametros);
            $item->setId($this->ultimoIdAdicionado());
        }catch(Exception $e){
            throw new RepositorioException("Erro ao adicionar item.", $e->getCode());
        }
    }

    /**
     * Coleta um item com o id informado
     * @param int $id
     * @return Item
     * @throws DominioException
     * @throws RepositorioException
     */
    public function coletarComId(int $id) : Item {
        try{
            $comando = "SELECT * FROM item WHERE id = :id LIMIT 1";
            $ps = $this->executarComandoSql($comando, ["id" => $id]);

            if($ps->rowCount() == 0)
                throw new DominioException('Item não encontrado.');

            $dadosItem = $ps->fetch();
            return $this->transformarEmItem($dadosItem);
        }catch(DominioException $e){
            throw $e;
        }catch(Exception $e){
            throw new RepositorioException("Erro ao obter item com id.", $e->getCode());
        }
    } 

    /**
     * Coleta um item com o código informado
     * @param string $codigo
     * @return array<string,Item|string>
     * @throws DominioException
     * @throws RepositorioException
     */
    public function coletarComCodigoEAvaria(string $codigo) : array {
        try{
            $comando = "SELECT item.*, (SELECT avaria.descricao FROM avaria WHERE avaria.item_id = item.id LIMIT 1) as avaria FROM item WHERE codigo = :codigo LIMIT 1";
            $ps = $this->executarComandoSql($comando, ["codigo" => $codigo]);

            if($ps->rowCount() == 0)
                throw new DominioException('Item não encontrado.');

            $dadosItem = $ps->fetch();
            $dados['item'] = $this->transformarEmItem($dadosItem);
            $dados['avaria'] = $dadosItem['avaria'];
            return $dados;
        }catch(DominioException $e){
            throw $e;
        }catch(Exception $e){
            throw new RepositorioException("Erro ao obter item com código.", $e->getCode());
        }
    }

    /**
     * Coleta dados dos itens para o relatório
     * @param string $dataInicial
     * @param string $dataFinal
     * @return array{itens:list<array{codigo:string,descricao:string,qtdVezesAlugado:string}>,totalLocacoes:int}     
     * @throws DominioException
     * @throws RepositorioException
     */
    public function coletarDadosParaRelatorio(string $dataInicial, string $dataFinal) : array {
        try{
            $dadosItensRelatorio = [];

            $comando = "SELECT i.codigo as codigo, i.descricao as descricao, COUNT(il.id) as qtdVezesAlugado
                        FROM item_locacao il 
                        JOIN item i ON il.item_id = i.id
                        JOIN locacao l ON il.locacao_id = l.id
                        WHERE l.entrada >= :dataInicial AND l.entrada <= :dataFinal
                        GROUP BY i.id 
                        ORDER BY qtdVezesAlugado DESC, i.descricao ASC
                    ";
            $ps = $this->executarComandoSql($comando, ["dataInicial" => $dataInicial, "dataFinal" => $dataFinal]);

            $totalDados = $ps->rowCount();
            if($totalDados == 0)
                throw new DominioException('Dados não encontrados.');

            /** @var list<array{codigo:string,descricao:string,qtdVezesAlugado:string}> $dadosItens */
            $dadosItens = $ps->fetchAll();

            $dadosItensRelatorio = [
                "itens"         => $dadosItens,
                "totalLocacoes" => $totalDados
            ];

            return $dadosItensRelatorio;
        }catch(DominioException $e){
            throw $e;
        }catch(Exception $e){
            throw new RepositorioException("Erro ao obter itens para o relatório.", $e->getCode());
        }
    }

    /**
     * Altera a disponibilidade do item salvo 
     * @param Item $item
     * @return void
     * @throws RepositorioException
     */
    public function atualizarDisponibilidade(Item $item) : void {
        try{
            $comando = "UPDATE item SET disponibilidade = :disponibilidade WHERE codigo = :codigo";
            $dados = [
                "disponibilidade" => intval($item->getDisponibilidade()),
                "codigo"          => $item->getCodigo()
            ];

            $this->executarComandoSql($comando, $dados);
        }catch(Exception $e){
            throw new RepositorioException("Erro ao alterar a disponibilidade do item.");
        }
    }
    
    /**
     * Transforma array de dados em objeto de Item
     * @param array{
     *      id:string|int,
     *      codigo:string,
     *      descricao:string,
     *      modelo:string,
     *      fabricante:string,
     *      valorPorHora:float,
     *      disponibilidade:int|bool,
     *      tipo:string
     * }$dadosItem
     * @return Item
     */
    private function transformarEmItem(array $dadosItem) : Item {
        return new Item((int) $dadosItem['id'], $dadosItem['codigo'], $dadosItem['descricao'], $dadosItem['modelo'], $dadosItem['fabricante'], (float) $dadosItem['valorPorHora'], boolval($dadosItem['disponibilidade']), $dadosItem['tipo']);
    }   
}