import { ControladoraCadastroDevolucao } from "./controladora-cadastro-devolucao.js";
import { VisaoCadastroDevolucao } from "./visao-cadastro-devolucao.js";
import { sel } from './seletores-cadastro-devolucao.js';
import { exibirMensagens } from "../../../infra/util/ExibirMensagens.js";
import DOMPurify from "dompurify";

export class VisaoCadastroDevolucaoHTML implements VisaoCadastroDevolucao{
    private controladora : ControladoraCadastroDevolucao;
    
    public constructor(){
        this.controladora = new ControladoraCadastroDevolucao(this);
    }
    
    iniciar(){
        document.addEventListener('DOMContentLoaded', this.controladora.coletarFuncionarios.bind(this.controladora));
        
        document.querySelector(sel.pesquisarLocacao)?.addEventListener('click', this.controladora.pesquisarLocacao.bind(this.controladora));
        document.querySelector(sel.devolverBtn)?.addEventListener('click', this.controladora.enviarDados.bind(this.controladora));
        document.querySelector(sel.selectLocacao)?.addEventListener('change', this.controladora.procurarLocacaoDoSelecionada.bind(this.controladora));
        document.querySelector(sel.devolucao)?.addEventListener('input', this.bloquearInputLocacao.bind(this));
        document.querySelector(sel.botaoFecharModal)!.addEventListener('click', this.fecharModal.bind(this));
        document.querySelector<HTMLButtonElement>(sel.botaoCadastrarAvaria)!.addEventListener('click', this.controladora.registrarAvaria.bind(this.controladora));
        document.querySelector<HTMLInputElement>(sel.inputFotoAvaria)!.addEventListener('change', this.alterarInputFoto.bind(this));
        this.bloquearInputLocacao();
    }

    public exibirFuncionarios(funcionarios) {
        const selectAvarias = document.querySelector(sel.selectFuncionariosAvaria);

        const funcionariosSelect = funcionarios.map(f =>
            this.transformarEmOption({value:f.id, option:f.nome})
        ).join('');

        selectAvarias!.innerHTML = funcionariosSelect;  
    }

    private transformarEmOption({value, option}) {
        return `<option value=${value}>${option}</option>`
    }

    bloquearInputLocacao(): void {
        const data = this.coletarDataDevolucao();
        const inputLocacao = document.querySelector<HTMLInputElement>(sel.locacaoInput);
        const botaoPesquisar = document.querySelector<HTMLButtonElement>(sel.pesquisarLocacao);
        if(!data || data == ''){
            inputLocacao!.disabled = true;
            botaoPesquisar!.disabled = true;
        }
        else{
            inputLocacao!.disabled = false;
            botaoPesquisar!.disabled = false;
        }
    }

    exibirMulta(multa) {
        document.querySelector<HTMLOutputElement>(sel.valorMultas)!.innerText = multa.toString()
    }

    exibirMensagens(mensagens: string[], erro:boolean) {
        exibirMensagens(mensagens, erro, sel.output);
    }

    coletarInputLocacao() {
        return DOMPurify.sanitize(document.querySelector<HTMLInputElement>(sel.locacaoInput)!.value)
        ;
    }

    coletarValorFinal() : string | null{
        return DOMPurify.sanitize(document.querySelector(sel.valorFinal)!.textContent || '');
    }

    coletarIdLocacaoDoSelect(): number {
        return Number(document.querySelector<HTMLSelectElement>(sel.selectLocacao)!.value);
    }

    coletarDataDevolucao() {
        return DOMPurify.sanitize(document.querySelector<HTMLInputElement>(sel.devolucao)!.value);
    }

    coletarIdsItensASeremLimpos(){
        const inputs = document.querySelectorAll<HTMLInputElement>("input.aplicar-taxa-limpeza[type='checkbox']:checked");
        const ids = Array.from(inputs).map(e => e.value);

        return ids;
    }

    coletarIdItemAvaria() {
        return DOMPurify.sanitize(document.querySelector(sel.inputItemAvaria)!.textContent || '');
    }

    coletarSubtotais(): number[] {
        const valores : number[] = [];
        const trs = document.querySelectorAll(`${sel.tabelaItensDevolucao} tr`);
        for(const tr of trs){
            const td = tr.querySelectorAll('td')[2];
            valores.push(Number(DOMPurify.sanitize(td.textContent || '')));
        }
        return valores;
    }

    coletarDadosAvaria() {
        return {
            idItem      : DOMPurify.sanitize(document.querySelector(sel.inputItemAvaria)!.textContent || ''),
            imagem      : document.querySelector<HTMLInputElement>(sel.inputFotoAvaria)!.files,
            descricao   : DOMPurify.sanitize(document.querySelector<HTMLInputElement>(sel.inputDescAvaria)!.value),
            valor       : DOMPurify.sanitize(document.querySelector<HTMLInputElement>(sel.inputValorAvaria)!.value),
            funcionario : DOMPurify.sanitize(document.querySelector<HTMLInputElement>(sel.selectFuncionariosAvaria)!.value)
        }
    }

    coletarIdAvariaParaRemover(){
        const avaria = document.querySelector<HTMLElement>('.para-remover')!;
        const idAvaria = avaria.getAttribute('data-avaria-id');

        return idAvaria;
    }

    exibirLocacoes(locacoes) {
        document.querySelector<HTMLOutputElement>(sel.output)!.innerText = "";
        if(locacoes.length > 1){
            this.exibirLocacoesDoCliente(locacoes);
        }
        else{
            this.exibirLocacaoUnica(locacoes);
        }
    }
    
    exibirLocacoesDoCliente(locacaoes) {
        document.querySelector<HTMLSelectElement>(sel.locacaoOutput)!.hidden = true;
        const select = document.querySelector<HTMLSelectElement>(sel.selectLocacao)!
        select!.innerHTML = ""
        select?.removeAttribute("hidden")
        this.criarOptionPadrao(select);
        
        for(const locacao of locacaoes){
            const option = document.createElement('option');
            option.value = String(locacao.id);
            const apenasData = locacao.previsaoDeEntrega.substring(0, 10);
            option.innerText = `R$${locacao.valorTotal} ${apenasData}`;
            select!.append(option)
        }
    }

    criarOptionPadrao(select : HTMLSelectElement){
        const optionPadrao = document.createElement('option')
        optionPadrao.innerText = '--Selecione--'
        select?.append(optionPadrao);
    }

    exibirLocacaoUnica(locacao) {
        document.querySelector<HTMLOutputElement>(sel.selectLocacao)!.hidden = true;
        const div = document.querySelector<HTMLOutputElement>(sel.locacaoOutput)
        div?.removeAttribute('hidden')
        const data = (new Date(locacao.previsaoDeEntrega)).toLocaleString();
        const apenasData = data.substring(0, 10);
        div!.innerText = `Locação de valor R$${locacao.valorTotal} para entregar ${apenasData}`
        div!.dataset.id = String(locacao.id)
        this.desenharTabela(locacao);
    }

    desenharTabela(locacao){
        const tbody = document.querySelector('tbody')
        tbody!.innerHTML = ""
        for(const itemLoc of locacao.itensLocacao){
            const subtotal = this.controladora.calcularSubtotal(itemLoc);
            tbody!.innerHTML += `
                <tr>
                    <td>${itemLoc.item.codigo}</td>
                    <td>${itemLoc.item.descricao}</td>
                    <td>${subtotal}</td>
                    <td class="taxa-coluna"><input type="checkbox" name="limpeza" class="aplicar-taxa-limpeza" value="${itemLoc.item.id}"></td>
                    <td><button  class="registrar-avaria"><img src="../styles/images/avaria.png" title="Lançar avaria" data-item-id="${itemLoc.item.id}"></button></td>
                </tr>
            ` 
        }
        this.controladora.verificarSePodeCadastrarAvaria();
        document.querySelectorAll<HTMLElement>(sel.botaoRegistrarAvaria)!.forEach((e) => e.onclick = this.registrarAvaria.bind(this));
        document.querySelectorAll<HTMLElement>(sel.checkboxTaxaLimpeza)!.forEach((e) => e.onclick = this.aplicarTaxaDeLimpeza.bind(this));
        this.controladora.calcularValores()
    }

    podeCadastrarAvaria(pode : boolean) : void{
        if(pode){
            return;
        }
        const botoes = document.querySelectorAll<HTMLButtonElement>(sel.botaoRegistrarAvaria);
        botoes.forEach(b => {
            b.disabled = true
        })
    }

    private registrarAvaria(e){
        e.preventDefault();
        const botao = e.target;
        const idItem = botao.dataset.itemId;

        document.querySelector<HTMLOutputElement>(sel.inputItemAvaria)!.innerText = idItem;
        this.controladora.coletarAvariasDoItem();
        document.querySelector<HTMLDialogElement>(sel.modalAvaria)!.show();
    }

    exibirAvariasDoItem(avarias: Object[] | []) {
        let tabela = document.querySelector(sel.tabelaAvarias)!;
        let tbody =  document.querySelector(`${sel.tabelaAvarias} tbody`)!;
        tabela.setAttribute('hidden', 'hidden');
        tbody.innerHTML = '';

        if(avarias.length == 0)
            return

        let linhasAvarias = avarias.map((e) => {
            return `
                <tr>
                    <td>${e.datahora.toLocaleString()}</td>
                    <td>${e.descricao}</td>
                    <td>R$${Number(e.valor).toFixed(2)}</td>
                    <td>
                        <img src=${URL.createObjectURL(e.imagem)} width=50px heigth=50px alt="Imagem da avaria">
                    </td>
                    <td>
                        <button data-avaria-id="${e.id}" class=" remover-avaria btn-transparent" alt="remover avaria"><img src=".../../../styles/images/remover.png" class='icon'/></button>
                    </td>
                </tr>
            `
        }).join('')

        tbody.innerHTML = linhasAvarias;

        document.querySelectorAll<HTMLElement>('.remover-avaria')!.forEach((e) => e.onclick = this.removerAvaria.bind(this));

        tabela.removeAttribute('hidden')
    }

    private removerAvaria(e){
        const clicado = e.target;
        clicado.classList.add('para-remover');

        this.controladora.removerAvaria();
        this.controladora.coletarAvariasDoItem();
    }

    private aplicarTaxaDeLimpeza(){
        this.controladora.calcularValores();
    }

    private alterarInputFoto(e){
        const input = e.target;

        if (input.files && input.files.length > 0) {
            const nomeArquivo = input.files[0].name;
            document.querySelector(`${sel.labelFotoModal} span`)!.textContent = `📎 ${nomeArquivo}`;
        } else {
            document.querySelector(`${sel.labelFotoModal} span`)!.textContent = '📎Selecionar imagem'; 
        }
    }

    atualizarValorFinal(valorFinal){
        document.querySelector<HTMLOutputElement>(sel.valorFinal)!.innerText = valorFinal.toString();
    }

    preencherValores({valorTotal, desconto, valorFinal, valorTaxaLimpeza}){
        document.querySelector<HTMLOutputElement>(sel.valorTotal)!.innerText = valorTotal.toString()
        document.querySelector<HTMLOutputElement>(sel.desconto)!.innerText = desconto.toString()
        document.querySelector<HTMLOutputElement>(sel.valorFinal)!.innerText = valorFinal.toString()
        document.querySelector<HTMLOutputElement>(sel.valorTaxaLimpeza)!.innerText = valorTaxaLimpeza.toString()
    }

    limparForm(): void {
        document.querySelector<HTMLInputElement>(sel.devolucao)!.value = ''
        document.querySelector<HTMLInputElement>(sel.locacaoInput)!.value = ''
        document.querySelector<HTMLOutputElement>(sel.locacaoOutput)!.hidden = true;
        document.querySelector<HTMLSelectElement>(sel.selectLocacao)!.hidden = true;
        document.querySelector('tbody')!.innerHTML = "";
    }

    limparFormAvaria() : void {
        document.querySelector<HTMLInputElement>(sel.inputDescAvaria)!.value = '';
        document.querySelector<HTMLInputElement>(sel.inputValorAvaria)!.value = '';
        document.querySelector<HTMLInputElement>(sel.inputFotoAvaria)!.value = '';
        document.querySelector<HTMLLabelElement>(`${sel.labelFotoModal} span`)!.textContent = '📎Selecionar imagem';
    }

    fecharModal(){
        document.querySelector<HTMLDialogElement>(sel.modalAvaria)!.close();
    }
}

const visao = new VisaoCadastroDevolucaoHTML();
visao.iniciar()