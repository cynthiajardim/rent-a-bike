import { ErrorDominio } from "../../infra/ErrorDominio";
import { GestorLogin } from "./gestor-login";
import { VisaoLogin } from "./visao-login";

export class ControladoraLogin{
    visao : VisaoLogin
    gestor : GestorLogin

    constructor(visao : VisaoLogin){
        this.visao = visao;
        this.gestor = new GestorLogin();
    }

    async logar(){
        try{
            const { login, senha } = this.visao.coletarDados();
            await this.gestor.logar(login, senha);
        }catch(erro){
            if(erro instanceof ErrorDominio)
                this.visao.exibirMensagens(erro.getProblemas(), true);
            else 
                this.visao.exibirMensagens([erro.message], true);
        }
        
    }
}