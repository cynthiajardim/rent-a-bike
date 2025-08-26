<?php

function criarGestorDeLocacao(PDO $pdo, Autenticador $autenticador): GestorLocacao{
    $repositorioCliente = new RepositorioClienteEmBDR($pdo);
    $repositorioItemLocacao = new RepositorioItemLocacaoEmBDR($pdo);
    $repositorioLocacao = new RepositorioLocacaoEmBDR($pdo, $repositorioItemLocacao);
    $transacao = new TransacaoComPDO($pdo);
    
    return new GestorLocacao($repositorioLocacao, $repositorioCliente, $transacao, $autenticador);
}

function criarGestorDeDevolucao(PDO $pdo, Autenticador $autenticador): GestorDevolucao{
    $transacao = new TransacaoComPDO($pdo);

    $repositorioItemLocacao = new RepositorioItemLocacaoEmBDR($pdo);
    $repositorioLocacao = new RepositorioLocacaoEmBDR($pdo, $repositorioItemLocacao);
    $repositorioFuncionario = new RepositorioFuncionarioEmBDR($pdo);
    $repositorioDevolucao = new RepositorioDevolucaoEmBDR($pdo, $repositorioLocacao, $repositorioFuncionario);
    $gestorAvaria = criarGestorDeAvaria($pdo, $autenticador);

    return new GestorDevolucao($repositorioDevolucao, $repositorioLocacao, $gestorAvaria, $transacao, $autenticador);
}


function criarGestorDeAvaria(PDO $pdo, Autenticador $autenticador): GestorAvaria{
    $repositorioItem = new RepositorioItemEmBDR($pdo);
    $repositorioFuncionario = new RepositorioFuncionarioEmBDR($pdo);
    $repositorioAvaria = new RepositorioAvariaEmBDR($pdo, $repositorioItem, $repositorioFuncionario);
    
    return new GestorAvaria($repositorioAvaria, $repositorioItem, $repositorioFuncionario, $autenticador);
}

function criarGestorDeFuncionario(PDO $pdo, Autenticador $autenticador): GestorFuncionario{
    $repositorioFuncionario = new RepositorioFuncionarioEmBDR($pdo);
    
    return new GestorFuncionario($repositorioFuncionario, $autenticador);
}

function criarGestorDeCliente(PDO $pdo, Autenticador $autenticador): GestorCliente{
    $repositorioCliente = new RepositorioClienteEmBDR($pdo);
    
    return new GestorCliente($repositorioCliente, $autenticador);
}

function criarGestorDeItem(PDO $pdo, Autenticador $autenticador): GestorItem{
    $repositorioItem = new RepositorioItemEmBDR($pdo);
    
    return new GestorItem($repositorioItem, $autenticador);
}