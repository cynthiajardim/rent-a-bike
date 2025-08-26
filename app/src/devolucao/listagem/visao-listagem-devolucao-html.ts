import { ControladoraListagemDevolucao } from "./controladora-listagem-devolucao.js";
import { VisaoListagemDevolucao } from "./visao-listagem-devolucao.js";
import { exibirMensagens } from "../../../infra/util/ExibirMensagens.js";
import { Money } from "ts-money";

export class VisaoListagemDevolucaoHTML implements VisaoListagemDevolucao{

    private controladora : ControladoraListagemDevolucao;

    public constructor(){
        this.controladora = new ControladoraListagemDevolucao(this);
    }

    iniciar(){
        document.addEventListener('DOMContentLoaded', this.controladora.listar.bind(this.controladora) )
    }

    async desenharDevolucoes(devolucoes){
        document.querySelector('tbody')!.innerHTML = devolucoes.map(e => this.desenharDevolucao(e)).join('')
    }

    exibirMensagens(mensagens: string[], erro:boolean) {
        exibirMensagens(mensagens, erro, "output");
    }

    desenharDevolucao(d){
        const dataDevolucao = new Date(d.dataDeDevolucao);
        return `
            <tr>
                <td>${d.id}</td>
                <td>${d.locacao.id}</td>
                <td>${dataDevolucao.toLocaleString()}</td>
                <td>${d.locacao.cliente.nome}</td>
                <td>R$${Money.fromDecimal(d.valorPago, 'BRL')}</td>
            </tr>
        `
    }

}

const visao = new VisaoListagemDevolucaoHTML();
visao.iniciar()