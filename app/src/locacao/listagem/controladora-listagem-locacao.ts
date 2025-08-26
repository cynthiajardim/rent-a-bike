import { ErrorDominio } from "../../../infra/ErrorDominio";
import { GestorLocacao } from "../gestor-locacao";
import { VisaoLocacao } from "./visao-listagem-locacao";

export class ControladoraListagemLocacao{
    private gestor:GestorLocacao;
    private visao:VisaoLocacao

    constructor(visao){
        this.visao = visao;
        this.gestor = new GestorLocacao();
    }

    async obterLocacoes(){
        try{
            const locacoes = await this.gestor.coletarLocacoes();
            if(locacoes.length == 0){
                this.visao.exibirMensagens(["Nenhuma locação encontrada."], true);
            }
            
            return locacoes;
        }catch(error){
            if(error instanceof ErrorDominio)
                this.visao.exibirMensagens(error.getProblemas(), true);
            else 
                this.visao.exibirMensagens([error.message], true);
        }
    }
}