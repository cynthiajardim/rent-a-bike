import { VisaoRelatorioDevolucao } from "./visao-relatorio-devolucao";
import { GestorDevolucao } from '../gestor-devolucao';
import { ErrorDominio } from "../../../infra/ErrorDominio";

export class ControladoraRelatorioDevolucao{
    private visao : VisaoRelatorioDevolucao;
    private gestor : GestorDevolucao

    constructor(visao : VisaoRelatorioDevolucao){
        this.visao = visao;
        this.gestor = new GestorDevolucao();
    }

    async gerarRelatorio(){
        try{
            const dataInicial = this.visao.coletarDataInicial();
            const dataFinal = this.visao.coletarDataFinal();
            const devolucoes = await this.gestor.coletarDevolucoesGrafico(dataInicial, dataFinal);
            this.visao.gerarGrafico(devolucoes);
        }catch( error ){
            if(error instanceof ErrorDominio)
                this.visao.exibirMensagens(error.getProblemas(), true);
            else
                this.visao.exibirMensagens([ error.message ], true);
            
            return
        }
    }
}