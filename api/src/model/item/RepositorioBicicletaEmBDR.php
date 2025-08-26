<?php

class RepositorioBicicletaEmBDR extends RepositorioGenericoEmBDR {
    public function __construct(PDO $pdo){
        parent::__construct($pdo);
    }

    /** 
     * Salva uma bicicleta no banco de dados
     * @param Bicicleta $bicicleta
     * @return void
     */
    public function adicionar(Bicicleta $bicicleta) : void {
        $comando = "INSERT INTO bicileta (idItem, numeroSeguro) VALUES (:idItem, :seguro)";
        $this->executarComandoSql($comando, ["idItem" => $bicicleta->getIdItem(), "seguro" => $bicicleta->getNumeroSeguro()]);

        $bicicleta->setId($this->ultimoIdAdicionado());
    }

    /**
     * Coleta uma bicicleta com o id informado
     * @param int $id
     * @return null|Bicicleta
     */
    public function coletarComId(int $id) : null | Bicicleta {
        $comando = "SELECT b.*, i.* FROM bicicleta b JOIN item  i ON item.id = bicicleta.idItem WHERE id = :id LIMIT 1";
        $ps = $this->executarComandoSql($comando, ["id" => $id]);

        $item = $ps->fetchObject(Bicicleta::class); 
        return $item ?: null;
    }
}
