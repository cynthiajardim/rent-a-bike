<?php


abstract class RepositorioGenericoEmBDR { 
    private PDO $pdo;

    public function __construct(PDO $pdo){
        $this->pdo = $pdo;
    }

    public function removerComId(int $id, string $nomeDaTabela) : bool{
        try{
            $ps = $this->pdo->prepare("DELETE FROM $nomeDaTabela WHERE id= :id");
            $ps->execute(["id" => $id]);
            return $ps->rowCount() > 0;
        } catch(PDOException $e){
            throw new RepositorioException($e->getMessage(), $e->getCode());
        }
    }
    
    public function ultimoIdAdicionado() : int{
        return (int) $this->pdo->lastInsertId();   
    }

    /**
     * Executa um comando
     * @param string $sql
     * @param array<string,string | int | float | bool> $parametros
     * @throws \PDOException
     * @return PDOStatement
     */
    public function executarComandoSql( string $sql, array $parametros = [] ): PDOStatement {
        try {
            $ps = $this->pdo->prepare($sql);
            $ps->execute($parametros);
            return $ps;
        } catch ( PDOException $e ) {
            throw $e;
        }
    }

    

}



?>