export interface VisaoRelatorioItens {
    gerarRelatorio(itensRelatorio : []);

    coletarDataInicial() : string;
    coletarDataFinal() : string;

    exibirMensagens(mensagens : string[], erro:boolean);
}