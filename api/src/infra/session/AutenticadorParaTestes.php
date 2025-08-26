<?php

class AutenticadorParaTestes extends Autenticador {
    public function abrirSessao(): void {}
    public function verificarSeUsuarioEstaLogado(): void {}
    public function obterFuncionarioLogado(): Funcionario
    {
        return new Funcionario(2, 'Ana Paula', '', '', '', EnumCargo::GERENTE->toString());
    }
}
