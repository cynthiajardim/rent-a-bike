<?php

class RepositorioLocacaoEmBDR extends RepositorioGenericoEmBDR implements RepositorioLocacao{

    public function __construct(PDO $pdo, private RepositorioItemLocacao $repositorioItemLocacao){
        parent::__construct($pdo);
    }

    /**
     * Salva uma locação no banco de dados
     * @param Locacao $locacao
     * @return void
     */
    public function adicionar(Locacao $locacao) : void{
        try{
            $comando = "INSERT INTO locacao(entrada,numero_de_horas,desconto,valor_total,previsao_de_entrega, cliente_id, funcionario_id) VALUES (:entrada,:numero_de_horas,:desconto,:valor_total,:previsao_de_entrega, :cliente_id, :funcionario_id)";
            
            $dados = [
                "entrada"               => $locacao->getEntrada()->format("Y-m-d H:i:s"), 
                "numero_de_horas"       => $locacao->getNumeroDeHoras(), 
                "desconto"              => $locacao->getDesconto(), 
                "valor_total"           => $locacao->getValorTotal(),
                "previsao_de_entrega"   => $locacao->getPrevisaoDeEntrega()->format("Y-m-d H:i:s"), 
                "cliente_id"            => $locacao->getCliente()->getId(),
                "funcionario_id"        => $locacao->getFuncionario()->getId()
            ];
        
            $this->executarComandoSql($comando, $dados);
            $locacao->setId($this->ultimoIdAdicionado());

            $this->adicionarItens($locacao);
        }catch(PDOException $e){
            throw new RepositorioException("Erro ao adicionar nova locação.", $e->getCode());
        }
    }

    /**
     * Salva em uma tabela de relacionamento os itens pertencentes à uma locação
     * @param Locacao $locacao
     * @return void
     */
    public function adicionarItens(Locacao $locacao) : void{
        try{
            foreach($locacao->getItensLocacao() as $itemLocacao){
                $this->repositorioItemLocacao->adicionar($itemLocacao, intval($locacao->getId()));
            }

            $this->repositorioItemLocacao->atualizarDisponibilidadeItensLocacao($locacao->getItensLocacao(), false);
        }catch(Throwable $e){
            throw new RepositorioException("Erro ao salvar itens da locação.", $e->getCode());        }
    }

    /**
     * Coleta locações com algum filtro
     * @param array<string,string> $parametros
     * @return array<Locacao>
     */
    public function coletarComParametros(array $parametros): array{
        try{
            $sql = "SELECT l.id, l.entrada as entrada, l.numero_de_horas, l.desconto, l.valor_total, l.previsao_de_entrega, c.id as id_cliente, c.codigo as codigo_cliente, c.nome as nome_cliente, c.cpf, c.foto, c.telefone, f.id as id_funcionario, f.nome as nome_funcionario
            FROM locacao l 
            JOIN cliente c ON l.cliente_id = c.id 
            JOIN funcionario f ON l.funcionario_id = f.id
            WHERE 1 ";

            if(isset($parametros['verificarAtivo'])){
                $sql .= " AND l.ativo = :verificarAtivo";
            } 
            if(isset($parametros['id'])){
                $sql .= " AND l.id = :id";
            }else{
                $sql .= " AND c.cpf = :cpf";
            }
            
            $ps = $this->executarComandoSql($sql, $parametros);
            $dadosLocacoes = $ps->fetchAll();

            $locacoes = $this->transformarEmLocacoes($dadosLocacoes);
            if(empty($locacoes)){
                throw new DominioException("Locações não encontradas.");
            }
            return $locacoes;
        } catch( PDOException $e){
            throw new RepositorioException("Erro ao obter locações.", $e->getCode());
        }
    }

    /**
     * @return array<Locacao>
     */
    public function coletarTodos() : array{
        try{
            $parametros = [];
            $sql = "SELECT l.id, l.entrada as entrada, l.numero_de_horas, l.desconto, l.valor_total, l.previsao_de_entrega, c.id as id_cliente, c.codigo as codigo_cliente, c.nome as nome_cliente, c.cpf, c.telefone, c.foto, f.id as id_funcionario, f.nome as nome_funcionario
            FROM locacao l 
            JOIN cliente c ON l.cliente_id = c.id 
            JOIN funcionario f ON l.funcionario_id = f.id
            ORDER BY l.entrada DESC";

            $ps = $this->executarComandoSql($sql, $parametros);
            $dadosLocacoes = $ps->fetchAll();
    
            $locacoes = $this->transformarEmLocacoes($dadosLocacoes);

            return $locacoes;
        } catch( PDOException $e){
            throw new RepositorioException("Erro interno do servidor.", $e->getCode());
        }
    }

    /**
     * Transforma dados de locação em objetos de locação
     * @param array<array<string,string>> $dadosLocacoes
     * @return array<Locacao>
     */
    private function transformarEmLocacoes(array $dadosLocacoes): array{
        $locacoes = [];

        foreach($dadosLocacoes as $dados){
            $cliente = new Cliente($dados['id_cliente'], $dados['codigo_cliente'], $dados['cpf'], $dados['nome_cliente'], $dados['foto'], $dados['telefone']);
            $funcionario = new Funcionario((int) $dados['id_funcionario'], $dados['nome_funcionario']);
            $itensLocacao = $this->repositorioItemLocacao->coletarComIdLocacao((int) $dados['id']);

            $locacao = new Locacao((int) $dados['id'], $itensLocacao, $cliente, $funcionario, new DateTime($dados['entrada']), (int) $dados['numero_de_horas']);

            $locacoes[] = $locacao;
        }
        return $locacoes;
    }

    /**
     * Marca uma locação como devolvida
     * @param Locacao $locacao
     */
    public function marcarComoDevolvida(Locacao $locacao) : void{
        $comando = "UPDATE locacao SET ativo = 0 WHERE id=:id";
        $ps = $this->executarComandoSql($comando, ["id" => $locacao->getId()]);

        $this->repositorioItemLocacao->atualizarDisponibilidadeItensLocacao($locacao->getItensLocacao(), true);
    }
}