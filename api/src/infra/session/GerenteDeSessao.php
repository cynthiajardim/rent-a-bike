<?php

interface GerenteDeSessao{
    public function setFuncionario(Funcionario $funcionario): void;
    public function abrirSessao(): void;
    public function fecharSessao(): void;
    public function retornarFuncionario() : Funcionario;
    /**
     * @throws DominioException
     * @return void
     */
    public function verificarSeUsuarioEstaLogado(): void;
}