import { APP, FORBIDDEN } from "../../infra/app";
import { ErrorForbidden } from "../../infra/ErrorForbidden";
import { ErrorNaoAutorizado } from "../../infra/ErrorNaoAutorizado";
import { Cookie } from "./cookie";
import { GestorAutenticador } from "./gestor-autenticador";
import { VisaoAutenticador } from "./visao-autenticador";

export class ControladoraAutenticador{
    private visao : VisaoAutenticador;
    private gestor : GestorAutenticador;

    constructor(visao : VisaoAutenticador){
        this.visao = visao;
        this.gestor = new GestorAutenticador(new Cookie());
    }

    gerenciarAutenticacao(){
        try{
            this.gestor.verificarPermissaoDeAcesso();

            this.visao.criarOHeader();
            const nome = this.gestor.coletarUsuario() || '';
            this.visao.mostrarNome(nome);
        } catch(error){
            if(error instanceof ErrorNaoAutorizado){
                this.visao.redirecionarPara(APP);
            } else if(error instanceof ErrorForbidden){
                this.visao.redirecionarPara(APP + FORBIDDEN);
            }
        }
    }

    async sair(){
        await this.gestor.deslogar();
        this.visao.redirecionarPara(APP);
    }
}