import { exibirMensagens } from "../../infra/util/ExibirMensagens";
import { ControladoraLogin } from "./controladora-login";
import { sel } from "./seletores-login";
import { VisaoLogin } from "./visao-login";
import DOMPurify from "dompurify";

export class VisaoLoginHTML implements VisaoLogin{

    controladora : ControladoraLogin;

    constructor(){
        this.controladora = new ControladoraLogin(this);
    }

    iniciar(){
        document.querySelector(sel.botaoLogar)?.addEventListener('click', (event) => {
            event.preventDefault();
            this.controladora.logar();
        });
    }


    coletarDados(): { login: string; senha: string; } {
        const login = DOMPurify.sanitize(document.querySelector<HTMLInputElement>(sel.campoUsuario)!.value);
        const senha = DOMPurify.sanitize(document.querySelector<HTMLInputElement>(sel.campoSenha)!.value);
        return {login, senha};
    }

    exibirMensagens(mensagens: string[], erro: boolean) {
       exibirMensagens(mensagens, erro, sel.output);
    }

}


const visao = new VisaoLoginHTML();
visao.iniciar();