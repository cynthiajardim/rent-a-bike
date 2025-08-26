<?php

class RepositorioItemLocacaoEmBDR extends RepositorioGenericoEmBDR implements RepositorioItemLocacao {
    public function __construct(private PDO $pdo){
        parent::__construct($pdo);
    }

    /**
     * Salva um item da locação no banco de dados 
     * @param ItemLocacao $itemLocacao
     * @param int $idLocacao
     * @throws RepositorioException
     * @return void
     */
    public function adicionar(ItemLocacao $itemLocacao, int $idLocacao) : void{
        try{
            $comando = "INSERT INTO item_locacao(item_id, locacao_id, preco_locacao, subtotal) VALUES (:idItem, :idLocacao, :precoLocacao, :subtotal)";
            $dados = [
                "idItem"        => $itemLocacao->getItem()->getId(),
                "idLocacao"     => $idLocacao,
                "precoLocacao"  => $itemLocacao->getPrecoLocacao(),
                "subtotal"      => $itemLocacao->getSubtotal()
            ];

            $this->executarComandoSql($comando, $dados);            
        }catch(Exception $e){
            throw new RepositorioException("Erro ao cadastrar item de locação. ", $e->getCode());
        }
    }

    /**
     * Coleta itens da locação com o id da locação
     * @param int $idLocacao
     * @throws DominioException
     * @throws RepositorioException
     * @return array<ItemLocacao>
     */
    public function coletarComIdLocacao(int $idLocacao): array{
        try{
            $sql = "SELECT * FROM item_locacao WHERE locacao_id = :idLocacao";
            $ps = $this->executarComandoSql($sql, ["idLocacao" => $idLocacao]);

            $dadosItensLocacao = $ps->fetchAll();
            $itensLocacao = [];

            $repItem = (new RepositorioItemEmBDR($this->pdo));
            foreach($dadosItensLocacao as $il){
                $item = $repItem->coletarComId($il['item_id']);
                $itemLocacao = new ItemLocacao($il['id'], $item, $il['preco_locacao']);
                $itemLocacao->setSubtotal($il['subtotal']);

                $itensLocacao[] = $itemLocacao;
            }
        
            return $itensLocacao;
        }catch(DominioException $e){
            throw $e;
        }catch(Exception $e){
            throw new RepositorioException("Erro ao coletar item com id de locação.", $e->getCode());
        }
    }

    /**
     * Atualiza a disponibilidade dos itens da locação
     * @param array<ItemLocacao> $itensLocacao
     * @param bool $disponibilidade
     * @throws RepositorioException
     * @return void
     */
    public function atualizarDisponibilidadeItensLocacao(array $itensLocacao, bool $disponibilidade) : void{
        try{
            $repositorioItem = new RepositorioItemEmBDR($this->pdo);
            foreach($itensLocacao as $itemLocacao){
                $item = $itemLocacao->getItem();
                $item->setDisponibilidade($disponibilidade);

                $repositorioItem->atualizarDisponibilidade($item);
            }
        }catch(Exception $e){
            throw new RepositorioException("Erro ao alterar disponibilidade de itens.");
        }
    }
}