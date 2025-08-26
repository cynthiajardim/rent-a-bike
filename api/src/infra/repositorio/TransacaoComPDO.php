<?php

class TransacaoComPDO implements Transacao {

    public function __construct( private PDO $pdo ) {}

    public function iniciar(): void{
        $this->pdo->beginTransaction();
    }

    public function finalizar(): void{
        if($this->pdo->inTransaction()){
            $this->pdo->commit();
        }
    }

    public function desfazer(): void{
        if($this->pdo->inTransaction()){
            $this->pdo->rollBack();
        }
    }
}