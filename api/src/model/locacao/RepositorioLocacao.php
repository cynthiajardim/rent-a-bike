<?php

interface RepositorioLocacao {
    /**
     * Salva uma locação no banco de dados
     * @param Locacao $locacao
     * @return void
     */
    public function adicionar(Locacao $locacao) : void;

    /**
     * Salva em uma tabela de relacionamento os itens pertencentes à uma locação
     * @param Locacao $locacao
     * @return void
     */
    public function adicionarItens(Locacao $locacao) : void;

    /**
     * Coleta locações com algum filtro
     * @param array<string,string> $parametros
     * @return array<Locacao>
     */
    public function coletarComParametros(array $parametros): array;

    /**
     * Coleta todas as locações
     * @return array<Locacao>
     */
    public function coletarTodos() : array;

    /**
     * Marca uma locação como devolvida
     * @param Locacao $locacao
     */
    public function marcarComoDevolvida(Locacao $locacao) : void;
}