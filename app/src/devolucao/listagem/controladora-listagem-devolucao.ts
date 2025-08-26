import { VisaoListagemDevolucao } from "./visao-listagem-devolucao.js";
import {GestorDevolucao} from '../gestor-devolucao.js';
import { ErrorDominio } from "../../../infra/ErrorDominio.js";

export class ControladoraListagemDevolucao{

    private visao : VisaoListagemDevolucao;
    private gestor : GestorDevolucao

    public constructor(visao : VisaoListagemDevolucao){
        this.visao = visao;
        this.gestor = new GestorDevolucao()
    }

    async listar(){
        try{
            const devolucoes = await this.gestor.coletarDevolucoes()
            if(devolucoes.length == 0){
                this.visao.exibirMensagens(['Nenhuma devolução encontrada.'], true);
            }
            this.visao.desenharDevolucoes(devolucoes);
        }catch(error){
            if(error instanceof ErrorDominio)
                this.visao.exibirMensagens(error.getProblemas(), true);
            else 
                this.visao.exibirMensagens([error.message], true);
        }
    }

}