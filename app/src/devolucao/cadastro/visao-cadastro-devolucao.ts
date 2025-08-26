export interface VisaoCadastroDevolucao{
    exibirFuncionarios(funcionarios);
    exibirMulta(multa);
    exibirMensagens(mensagem : string[], erro:boolean);
    coletarInputLocacao();
    exibirLocacoes(locacoes);
    coletarDataDevolucao();
    coletarIdLocacaoDoSelect() : number;
    coletarSubtotais() : number[];
    coletarValorFinal() : string | null;
    limparForm() : void;
    limparFormAvaria() : void;
    preencherValores({valorTotal, desconto, valorFinal, valorTaxaLimpeza});
    coletarDadosAvaria();
    coletarIdsItensASeremLimpos();
    coletarIdItemAvaria();
    coletarIdAvariaParaRemover();
    exibirAvariasDoItem(avarias : Object[]|[])
    atualizarValorFinal(valorFinal);
    podeCadastrarAvaria(pode : boolean) : void
}