<?php

interface RepositorioFuncionario {
    /**
     * @param int $id
     * @return Funcionario
     */
    public function coletarComId(int $id) : Funcionario;

    /**
     * @return array<Funcionario>
     */
    public function coletarTodos() : array;
    /**
     * Coleta funcionário pelo Cpf.
     * @param string $cpf
     * @throws DominioException
     * @throws RepositorioException
     * @return Funcionario
     */
    public function coletarComCpf(string $cpf) : Funcionario;
}