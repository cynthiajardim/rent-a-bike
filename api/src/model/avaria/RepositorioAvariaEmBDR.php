<?php

class RepositorioAvariaEmBDR extends RepositorioGenericoEmBDR implements RepositorioAvaria{

    public function __construct(PDO $pdo, private RepositorioItem $repositorioItem, private RepositorioFuncionario $repositorioFuncionario){
        parent::__construct($pdo);
    }

    /**
     * Coleta todas as avarias.
     * @throws \RepositorioException
     * @return Avaria[]
     */
    public function coletarTodos(): array{
        try{
            $sql = "SELECT a.* FROM avaria a
                    JOIN funcionario f on f.id=a.funcionario_id
                    JOIN item i on i.id=a.item_id";
            
            $ps = $this->executarComandoSql($sql);
            $dadosAvarias = $ps->fetchAll();
            
            $avarias = [];
            foreach($dadosAvarias as $avaria){
                $avarias[] = $this->transformarEmAvaria($avaria, $this->repositorioFuncionario, $this->repositorioItem);
            }
    
            return $avarias;
        }catch( PDOException $e){
            throw new RepositorioException("Erro ao coletar avarias.", $e->getCode());
        }

    }

    /**
     * Adiciona avaria ao banco
     * @param Avaria $avaria
     * @param string|int $idDevolucao
     * @throws \RepositorioException
     * @throws \Exception
     * @return void
     */
    public function adicionar(Avaria $avaria, string|int $idDevolucao) : void{
        try{
            $comando = "INSERT INTO avaria (lancamento, funcionario_id, descricao, foto, valor, item_id, devolucao_id) VALUES (:lancamento, :funcionario_id, :descricao, :foto, :valor, :item_id, :devolucao_id)";
            $this->executarComandoSql($comando, ["lancamento" => $avaria->getLancamento()->format('Y-m-d H:i:s'), "funcionario_id" => $avaria->getAvaliador()->getId(),
                "descricao" => $avaria->getDescricao(), "foto" => '', "valor" => $avaria->getValor(), "item_id" => $avaria->getItem()->getId(), "devolucao_id" => $idDevolucao
            ]);
        
            $avaria->setId($this->ultimoIdAdicionado());
        }catch( PDOException $e){
            throw new RepositorioException($e, $e->getCode());
        } catch(Throwable $e){
            throw new Exception($e->getMessage(), $e->getCode());
        }
    }

    /**
     * Salva o caminho da imagem da avaria
     * @param string $caminhoImagem
     * @param string|int $idAvaria
     * @return void
     * @throws RepositorioException
     */
    public function salvarCaminhoImagem(string $caminhoImagem, string|int $idAvaria) : void {
        try{
            $comando = "UPDATE avaria SET foto = :caminhoFoto WHERE id = :id";
            $this->executarComandoSql($comando, ['caminhoFoto' => $caminhoImagem, 'id' => $idAvaria]);
        }catch(PDOException $e){
            throw new RepositorioException("Erro ao salvar imagem da avaria de id: ".$idAvaria, $e->getCode());
        }
    }

    /**
     * Coleta avaria com o ID.
     * @param int | string $id
     * @throws \DominioException
     * @throws \RepositorioException
     * @return Avaria
     */
    public function coletarComId(int | string $id): Avaria{
        try{
            $comando = "SELECT * FROM avaria WHERE id=:id";
            $ps = $this->executarComandoSql($comando, ["id" => $id ]);
            
            $dadosAvaria = $ps->fetch();
            if(count($dadosAvaria) == 0){
                throw new DominioException("Nenhuma avaria encontrada.");
            }

            return $this->transformarEmAvaria($dadosAvaria, $this->repositorioFuncionario, $this->repositorioItem);
        }catch(DominioException $e){
            throw $e;
        }catch( PDOException $e){
            throw new RepositorioException("Erro ao obter avaria de id: ".$id, $e->getCode());
        }
    }

    /**
     * Transforma um array de dados em um objeto de Devolução
     * @param array<string,string> $dadosAvaria
     * @param  RepositorioFuncionario $repositorioFuncionario
     * @param  RepositorioItem $repositorioItem
     * @throws \DominioException
     * @return Avaria
     */
    private function transformarEmAvaria(array $dadosAvaria, RepositorioFuncionario $repositorioFuncionario, RepositorioItem $repositorioItem): Avaria{
        try{
            $item = $repositorioItem->coletarComId(intval($dadosAvaria["item_id"]));
            $funcionario = $repositorioFuncionario->coletarComId(intval($dadosAvaria['funcionario_id']));
            
            //verificar como retornar o caminho da foto aqui
            $avaria = new Avaria($dadosAvaria['id'], new DateTime($dadosAvaria['lancamento']), $funcionario, $dadosAvaria['descricao'], null, (float) $dadosAvaria['valor'], $item);

            return $avaria;
        }catch(Throwable $e){
            throw new DominioException("Erro ao instanciar nova devolução.", $e->getCode());
        }
    }

}