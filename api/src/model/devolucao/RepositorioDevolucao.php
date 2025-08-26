<?php

interface RepositorioDevolucao{
    /**
     * Adiciona devolução ao BD.
     * @param Devolucao $devolucao
     * @throws RepositorioException
     * @throws Exception
     * @return void
     */
    public function adicionar(Devolucao $devolucao) : void;

    /**
     * Coleta devolução com o ID.
     * @param int $id
     * @throws RepositorioException
     * @throws DominioException
     * @return Devolucao
     */
    public function coletarComId(int $id): Devolucao;

    /**
     * Retorna todas as devoluções.
     * @return array<Devolucao>
     * @throws RepositorioException
     */
    public function coletarTodos():array;

    /**
     * Coleta dados para o gráfico de valor por data de locação
     * @param string $dataInicial
     * @param string $dataFinal
     * @return array<DevolucaoGraficoDTO>
     */
    public function coletarDevolucoesPorData(string $dataInicial, string $dataFinal) : array;
}