import { exibirMensagens } from "../../../infra/util/ExibirMensagens";
import { ControladoraListagemLocacao } from "./controladora-listagem-locacao";
import { VisaoLocacao } from "./visao-listagem-locacao";

export class VisaoListagemLocacaoHTML implements VisaoLocacao{
    private controladora:ControladoraListagemLocacao;

    constructor(){
        this.controladora = new ControladoraListagemLocacao(this);
    }

    iniciar(){
        document.addEventListener('DOMContentLoaded', this.listarLocacoes.bind(this));
    }

    async listarLocacoes(){
        const locacoes = await this.controladora.obterLocacoes();
        document.querySelector('tbody')!.innerHTML = locacoes.map(
            e => this.desenharLinhaLocacao(e)
        ).join('')
    }

    desenharLinhaLocacao(e){
        const entrada = new Date(e.entrada);
        const previsaoEntrega = new Date(e.previsaoDeEntrega);
        return `
            <tr>
                <td>${e.id}</td>
                <td>${entrada.toLocaleString()}</td>
                <td>${e.horas}</td>
                <td>${previsaoEntrega.toLocaleString()}</td>
                <td>${e.cliente.nome}</td>
                <td>${e.cliente.telefone}</td>
            </tr>
        `
    }

    exibirMensagens(mensagens: string[], erro:boolean) {
        exibirMensagens(mensagens, erro, "output");
    }
}

const visaoListagem = new VisaoListagemLocacaoHTML();
visaoListagem.iniciar();