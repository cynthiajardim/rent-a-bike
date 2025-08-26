import { APP } from "../../infra/app";
import { ControladoraAutenticador } from "./controladora-autenticador";
import { sel } from "./seletores-autenticador";
import { VisaoAutenticador } from "./visao-autenticador";

export class VisaoAutenticadorHTML implements VisaoAutenticador{
    private controladora : ControladoraAutenticador;

    constructor(){
        this.controladora = new ControladoraAutenticador(this);
    }

    iniciar(){
        window.addEventListener("DOMContentLoaded", this.controladora.gerenciarAutenticacao.bind(this.controladora));
    }


    criarOHeader(): void {
        const header = document.querySelector("header");
        header?.appendChild(this.criarDiv());
    }

    criarDiv() : HTMLElement{
        const div = document.createElement('div');
        div.classList.add('nome-usuario')
        
        div.append(
            this.criarOutputDeUsuario(),
            this.criarBotaoDeSair()
        )

        return div;
    }

    criarBotaoDeSair(): HTMLElement{
        const botao = document.createElement('button')
        const botaoSair = document.createElement('img')
        botao.classList.add('botao-sair')

        botaoSair.src = "../styles/images/logout_exit_icon.png";
        botaoSair.title = "Sair";
        
        botao.appendChild(botaoSair);
        botao.setAttribute('hidden', '');
        botao.setAttribute('id', sel.botaoSair.replace('#', ''));
        botao.addEventListener("click", this.controladora.sair.bind(this.controladora));

        
        return botao;
    }

    criarOutputDeUsuario(): HTMLElement{
        const output = document.createElement("div");
        output.setAttribute("id", sel.nome.replace("#", ""));
        return output;
    }

    mostrarNome(nome: string): void {
        if(nome !== ''){
            document.querySelector<HTMLOutputElement>(sel.nome)!.innerHTML = `Olá, ${nome}`;
            document.querySelector<HTMLButtonElement>(sel.botaoSair)?.removeAttribute('hidden');
        }
    }

    redirecionarPara(url: string = APP) {
        location.href = url;
    }

}

const visao = new VisaoAutenticadorHTML();
visao.iniciar()