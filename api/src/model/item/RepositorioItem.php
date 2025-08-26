<?php

interface RepositorioItem{
    /**
     * Salva um item no banco de dados
     * @param Item $item
     * @return void
     */
    public function adicionar(Item $item) : void;

    /**
     * Coleta um item com o id informado
     * @param int $id
     * @return Item
     * @throws DominioException
     */
    public function coletarComId(int $id) : Item;

    /**
     * Coleta um item com o código informado
     * @param string $codigo
     * @return array<string,Item|string>
     * @throws DominioException
     */
    public function coletarComCodigoEAvaria(string $codigo) : array;

    /**
     * Coleta dados dos itens para o relatório
     * @param string $dataInicial
     * @param string $dataFinal
     * @return array{itens:list<array{codigo:string,descricao:string,qtdVezesAlugado:string}>,totalLocacoes:int}     
     * @throws DominioException
     * @throws RepositorioException
     */
    public function coletarDadosParaRelatorio(string $dataInicial, string $dataFinal) : array;

    /**
     * Altera a disponibilidade do item salvo 
     * @param Item $item
     * @return void
     */
    public function atualizarDisponibilidade(Item $item) : void;
}