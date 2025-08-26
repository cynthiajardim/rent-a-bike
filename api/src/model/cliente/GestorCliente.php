<?php

class GestorCliente {
    public function __construct(private RepositorioCliente $repositorioCliente, private Autenticador $autenticador){
        $this->autenticador->abrirSessao();
    }

    /**
     * Coleta cliente pelo código ou CPF
     * @param string $parametro
     * @return Cliente
     */
    public function coletarComCodigoOuCpf(string $parametro){
        try{
            $this->autenticador->verificarSeUsuarioEstaLogado();
            $cliente = $this->repositorioCliente->coletarComCodigoOuCpf($parametro);

            return $cliente;
        } catch(Exception $e){
            throw $e;
        }
    }
}