<?php

interface RepositorioItemLocacao {
    /**
     * Salva um item da locação no banco de dados 
     * @param ItemLocacao $itemLocacao
     * @param int $idLocacao
     * @return void
     */
    public function adicionar(ItemLocacao $itemLocacao, int $idLocacao) : void;

    /**
     * Coleta itens da locação com o id da locação
     * @param int $idLocacao
     * @return array<ItemLocacao>
     */
    public function coletarComIdLocacao(int $idLocacao): array;

    /**
     * Atualiza a disponibilidade dos itens da locação
     * @param array<ItemLocacao> $itensLocacao
     * @param bool $disponibilidade
     * @return void
     */
    public function atualizarDisponibilidadeItensLocacao(array $itensLocacao, bool $disponibilidade) : void;
}