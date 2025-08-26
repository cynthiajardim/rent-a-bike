export interface VisaoRelatorioDevolucao{
    exibirMensagens(mensagem : string[], erro:boolean);
    coletarDataInicial() : string
    coletarDataFinal() : string
    gerarGrafico(devolucoes);
}