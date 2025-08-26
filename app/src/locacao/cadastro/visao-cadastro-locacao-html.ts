import { ControladoraCadastroLocacao } from "./controladora-cadastro-locacao";
import { VisaoCadastroLocacao } from "./visao-cadastro-locacao";
import { Money } from "ts-money";
import { sel } from "./seletores-cadastro-locacao";
import DOMPurify from "dompurify";
import { exibirMensagens } from "../../../infra/util/ExibirMensagens";

export class VisaoCadastroLocacaoHTML implements VisaoCadastroLocacao{
    private controladora:ControladoraCadastroLocacao;

    constructor(){
        this.controladora = new ControladoraCadastroLocacao(this);
    }

    iniciar(){
        document.querySelector(sel.botaoBuscarCliente)?.addEventListener("click", this.pesquisarCliente.bind(this))
        document.querySelector(sel.botaoBuscarItem)?.addEventListener("click", this.pesquisarItem.bind(this))
        document.querySelector(sel.inputHoras)?.addEventListener("blur", this.aoDigitarHora.bind(this));

        document.querySelector(sel.botaoCadastrar)!.addEventListener("click", this.cadastrar.bind(this));
    }

    coletarDados() : {cliente, horas}{
        return {
            cliente     : DOMPurify.sanitize(document.querySelector<HTMLInputElement>(sel.inputCliente)!.dataset.id || ''),
            horas       : this.coletarHoras()
        }
    }

    coletarHoras(){
        const input = document.querySelector<HTMLInputElement>(sel.inputHoras)!;
        return Number(DOMPurify.sanitize(input.value));
    }

    coletarCliente(){
        return DOMPurify.sanitize(document.querySelector<HTMLInputElement>(sel.inputCliente)!.value);
    }

    coletarCodigoItem(){
        return DOMPurify.sanitize(document.querySelector<HTMLInputElement>(sel.inputCodigoItem)!.value);
    }

    private cadastrar(){
        const botao = document.querySelector<HTMLButtonElement>(sel.botaoCadastrar)!;
        botao.disabled = true;
        this.controladora.cadastrar();
    }

    private aoDigitarHora(){
        if(this.coletarHoras() > 0){
            document.querySelector<HTMLInputElement>(sel.inputCodigoItem)!.disabled = false;
            document.querySelector<HTMLButtonElement>(sel.botaoBuscarItem)!.disabled = false;

            this.atualizarDados();
        } else {
            document.querySelector<HTMLInputElement>(sel.inputCodigoItem)!.disabled = true;
            document.querySelector<HTMLButtonElement>(sel.botaoBuscarItem)!.disabled = true;
            // document.querySelector(sel.campoEntrega )?.setAttribute("hidden", "hidden");
        }
    }

    /** PESQUISA DE CLIENTES */
    private async pesquisarCliente(){
        await this.controladora.coletarClienteComCodigoOuCpf();
    }

    public exibirCliente({id, nome, foto}){
        const inputCliente = document.querySelector<HTMLInputElement>(sel.inputCliente)!;
        inputCliente.dataset.id = id;

        const ul = document.querySelector(sel.listaCliente);
        ul!.innerHTML = '';

        const li = document.createElement('li');
        const protocol: string = window.location.protocol;
        const host: string = window.location.host;
        li.innerHTML = `<img src="${protocol+"//"+host+foto}" alt="${nome}" width='40px' /> ${nome}`;

        ul!.appendChild(li);
        ul!.removeAttribute("hidden");
    }

    /** PESQUISA DE ITEM */
    private async pesquisarItem(){
        await this.controladora.coletarItemComCodigo()
    }

    private removerItem(e){
        e.preventDefault();
        const botao = e.target.parentNode;
        const codigoItem = botao.dataset.itemId;
    
        this.controladora.removerItemComCodigo(codigoItem);

        const linha = botao.parentNode.parentNode;
        linha.remove();
    }

    exibirItem({descricao, disponibilidade, valorPorHora, avaria}){
        const ul = document.querySelector(sel.listaItem);
        ul!.innerHTML = '';

        let avariaItem = avaria != null ? `${avaria} -` : ''; 
        let disponivel = disponibilidade ? 'disponível' : 'indisponível';
        let valorItem = Money.fromDecimal(valorPorHora, 'BRL');

        const li = document.createElement('li');
        li.innerHTML = `${descricao} - ${avariaItem}  R$${valorItem}/h - <strong>${disponivel}</strong>`

        ul!.appendChild(li);
        ul!.removeAttribute("hidden");
        this.atualizarDados();
    }

    /** TABELA DE ITENS */
    atualizarDados(){
        this.controladora.atualizarDados();
    }

    construirTabela({itens, valores}){
        const tbody = document.querySelector(sel.tabelaItens)!;
        const tresumo = document.querySelector(sel.tabelaResumo)!;

        tbody.innerHTML = itens.map(i => 
            this.criarLinha(i)
        ).join('');

        document.querySelectorAll<HTMLElement>(sel.botaoRemoverItem)!.forEach((e) => e.onclick = this.removerItem.bind(this));

        tresumo.querySelector(sel.campoValorTotal)!.innerHTML = valores.valorTotal.toString();
        tresumo.querySelector(sel.campoDesconto)!.innerHTML = valores.valorDesconto.toString();
        tresumo.querySelector(sel.campoValorFinal)!.innerHTML = valores.valorFinal.toString();
    }

    private criarLinha(item){
        let subtotal = Money.fromDecimal(item.subtotal, 'BRL');

        return `
            <tr>
                <td>${item.codigo}</td>
                <td>${item.descricao}</td>
                <td>R$${subtotal}</td>
                <td><button data-item-id="${item.codigo}" class="remover-item btn-transparent" alt="Remover item da locação"><img src=".../../../styles/images/remover.png" class='icon'/></button></td>
            </tr>
        `
    }   

    exibirDataHoraEntrega(entrega:Date){
        document.querySelector(sel.campoEntregaSpan)!.innerHTML = entrega.toLocaleString();
        // document.querySelector(sel.campoEntrega)?.removeAttribute("hidden");
    }

    exibirMensagens(mensagens: string[], erro:boolean) {
        exibirMensagens(mensagens, erro, sel.output);
    }

    limparTelaCadastro(){
        document.querySelectorAll('input').forEach(e => e.value = '');
        document.querySelectorAll('span').forEach(e => e.innerText = '');
        document.querySelector(sel.tabelaItens)!.innerHTML = '';
        document.querySelector(sel.listaCliente)!.setAttribute('hidden', '');
        document.querySelector(sel.listaItem)!.setAttribute('hidden', '');
    }
}

let visao = new VisaoCadastroLocacaoHTML();
visao.iniciar();