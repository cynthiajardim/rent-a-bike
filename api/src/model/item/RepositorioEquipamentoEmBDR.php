<?php 

class RepositorioEquipamentoEmBDR extends RepositorioGenericoEmBDR {
    public function __construct(PDO $pdo){
        parent::__construct($pdo);
    }
    
     /** 
     * Salva um equipamento no banco de dados
     * @param Equipamento $equip
     * @return void
     */
    public function adicionar(Equipamento $equip) : void {
        $comando = "INSERT INTO equipamento (idItem) VALUES (:idItem)";
        $this->executarComandoSql($comando, ["idItem" => $equip->getIdItem()]);

        $equip->setId($this->ultimoIdAdicionado());
    }

    /**
     * Coleta um equipamento com o id informado
     * @param int $id
     * @return null|Equipamento
     */
    public function coletarComId(int $id) : null | Equipamento {
        $comando = "SELECT e.*, i.* FROM equipamento e JOIN item  i ON item.id = e.idItem WHERE id = :id LIMIT 1";
        $ps = $this->executarComandoSql($comando, ["id" => $id]);

        $item = $ps->fetchObject(Equipamento::class); 
        return $item ?: null;
    }
}