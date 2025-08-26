import { ErrorDominio } from "../../../infra/ErrorDominio";
import { GestorLocacao } from "../gestor-locacao";
import { VisaoRelatorioItens } from "./visao-relatorio-itens";

export class ControladoraRelatorioItens {
    visao : VisaoRelatorioItens;
    gestor : GestorLocacao;

    constructor(visao){
        this.visao = visao;
        this.gestor = new GestorLocacao();
    }

    async obterItensParaRelatorio(){
        try{
            const dataInicial = this.visao.coletarDataInicial();
            const dataFinal = this.visao.coletarDataFinal();

            const itensParaRelatorio = await this.gestor.obterItensParaRelatorio(dataInicial, dataFinal);
            this.visao.gerarRelatorio(itensParaRelatorio);
        }catch(error){
            if(error instanceof ErrorDominio)
                this.visao.exibirMensagens(error.getProblemas(), true);
            else 
                this.visao.exibirMensagens([error.message], true);
        }
    }
}