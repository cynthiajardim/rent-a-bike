import {API} from '../../infra/api.js'
import {Locacao} from '../locacao/locacao.js';
import {Devolucao} from '../devolucao/devolucao.js'
import {Money, Currencies} from 'ts-money'
import { ErrorDominio } from '../../infra/ErrorDominio.js';
import { ServicoDevolucao } from './servico-devolucao.js';
import { ItemLocacao } from '../item/item-locacao.js';
import {toZonedTime } from 'date-fns-tz';
import { DevolucaoGrafico } from './relatorio/DevolucaoGrafico.js'
import { Avaria } from '../item/avaria.ts';

export class GestorDevolucao{

    private locacaoesDoCliente : [];
    private locacaoEscolhida : Locacao | undefined;
    private horasCorridas : number = 0;
    private avarias : Avaria[] = [];
    private valorFinalInicial : Money = new Money(0, Currencies.BRL)

    async coletarDevolucoes(){
        const response = await fetch( API + 'devolucoes', {credentials: 'include'});
        const retorno = await response.json();
        if(!retorno.success || !response.ok){
            throw ErrorDominio.comProblemas([retorno.message]);
        }

        return retorno.data;
    }

    async podeCadastrarAvaria() : Promise<boolean>{
        const { GestorAutenticador } = await import('../autenticador/gestor-autenticador.ts');
        const { Cookie } = await import('../autenticador/cookie.ts');

        const gestor = new GestorAutenticador(new Cookie());
        try{
            return gestor.verificarSePodeCadastrarAvaria();
        }catch(error){
            throw error;
        }
    }

    async coletarDevolucoesGrafico(dataInicial: string, dataFinal: string) : Promise<DevolucaoGrafico[]>{
        const reponse = await fetch(API + `devolucoes?dataInicial=${dataInicial}&dataFinal=${dataFinal}`, {credentials: 'include'});
        const retorno = await reponse.json();

        if(!retorno.success || !reponse.ok){
            throw ErrorDominio.comProblemas([retorno.message]);
        }
        if(retorno.data.length == 0){
            throw ErrorDominio.comProblemas(['Não há dados para essas datas.']);
        }
        return retorno.data;
    }

    async coletarFuncionariosCadastrados(){
        const response = await fetch(API + "funcionarios", {credentials: 'include'});
        const retorno = await response.json();

        if(!retorno.success || !response.ok)
            throw ErrorDominio.comProblemas(["Erro ao obter funcionários. Erro:"+response.status]);

        return retorno.data;
    }

    async pesquisarLocacao(pesquisa : string) : Promise<any>{
        if(! /^\d+$/.test(pesquisa)){
            throw ErrorDominio.comProblemas([ "O campo de locação deve estar preenchido com apenas números." ] )
        }

        let parametro : string;
        parametro = `verificarAtivo=1`;
        if(pesquisa.length == 11){
            parametro += `&cpf=${pesquisa}`;
        }else{
            parametro += `&id=${pesquisa}`;
        }

        const response = await fetch( API + `locacoes?${parametro}`, {credentials: 'include'})
        const locacoes = await response.json();
        if(!locacoes.success || !response.ok){
            throw ErrorDominio.comProblemas([locacoes.message]);
        }
        this.horasCorridas = 0;
        this.locacaoesDoCliente = locacoes.data;
        if(locacoes.data.length == 1){
            const locacao = locacoes.data[0];
            this.locacaoEscolhida = new Locacao(locacao.id, locacao.cliente.id, locacao.funcionario.id, locacao.itensLocacao, locacao.entrada, locacao.horas, 0, locacao.valorTotal, locacao.previsaoDeEntrega);
            return locacao
        }
        return locacoes.data;
    }

    private criarDevolucao(dataDeDevolucao, itensParaLimpeza, valorPago) : Devolucao{
        const dataDevolucaoReal = dataDeDevolucao ? new Date(dataDeDevolucao) : undefined
        const devolucao = new Devolucao(10, dataDevolucaoReal, valorPago, this.locacaoEscolhida?.id, null, this.avarias, itensParaLimpeza);
        const problemas : string [] = devolucao.validar();
        if(problemas.length > 0){
            throw ErrorDominio.comProblemas(problemas);
        }
        const dataBrasileira = toZonedTime(dataDevolucaoReal!, 'America/Sao_Paulo');
        devolucao.setDataDeDevolucao(dataBrasileira);
        return devolucao
    }

    async salvarDevolucao(dataDevolucao, itensParaLimpeza, valorPago){
        const devolucao = this.criarDevolucao(dataDevolucao, itensParaLimpeza, valorPago);
        const formDataDevolucao = devolucao.converterParaFormData();
        const response = await fetch( API + 'devolucoes', {method : 'POST', body : formDataDevolucao, credentials: 'include'})

        const retorno = await response.json();
        if(!retorno.success || !response.ok){
            throw ErrorDominio.comProblemas([retorno.message]);
        }
    }

    getLocacacaoDoGestorPeloId(id : number) : Locacao | undefined{
        const locacao = this.locacaoesDoCliente.find( l => l.id == id);
        const locacaoObj =  new Locacao(locacao!.id, locacao!.cliente.id, locacao!.funcionario.id, locacao!.itensLocacao, locacao!.entrada, locacao!.horas, 0, locacao!.valorTotal, locacao!.previsaoDeEntrega);
        this.locacaoEscolhida = locacaoObj;
        return locacao;
    }

    getItensDaLocacaoPeloId(idsItens : number []) {
        const itens = [];

        for(let itemLocacao of this.locacaoEscolhida!.itens){
            itemLocacao.precisaLimpeza = idsItens.includes(itemLocacao.item.id.toString());
           
            if(itemLocacao.precisaLimpeza)
                itens.push(itemLocacao);
        }

        return itens;
    }

    getAvariasDoGestorPeloIdItem(idItem:number|string){
        const avariasDoGestor = this.avarias.filter(e => e.item.id == idItem)
        let objsAvarias = [];
        avariasDoGestor.forEach((e) => {
            objsAvarias.push({id: e.id, datahora: e.dataHora, descricao:e.descricao, valor:e.valor, imagem:e.imagem});
        })

        return objsAvarias;
    }

    calcularValores(subtotais : number [], itensASeremLimpos : number[]) : {valorTotal, desconto, valorFinal, valorTaxaLimpeza}{
        const itensLocacaoPraLimpeza = this.getItensDaLocacaoPeloId(itensASeremLimpos);
        const {valorTotal, desconto, valorFinal, valorTaxaLimpeza} = ServicoDevolucao.calcularValores(subtotais, this.horasCorridas, itensLocacaoPraLimpeza);

        this.valorFinalInicial = valorFinal;
        this.valorTaxaLimpeza = valorTaxaLimpeza;

        return {valorTotal, desconto, valorFinal, valorTaxaLimpeza}
    }

    calcularMulta(){
        const itensLocacao = this.locacaoEscolhida!.itens;
        return ServicoDevolucao.calcularMulta(itensLocacao, this.avarias);
    }

    recalcularValorFinal(multa: Money): Money {
        return this.valorFinalInicial.add(multa);
    }

    calcularSubtotal(item : ItemLocacao, devolucao) : Money{
        const horasCorridas = this.calcularHorasCorridas(devolucao);
        const valorPorHora = new Money(item.precoLocacao * 100, Currencies.BRL);
        return valorPorHora.multiply(horasCorridas);
    }

    public calcularHorasCorridas(devolucao){
        if(this.horasCorridas != 0 ){
            return this.horasCorridas;
        }
        const dataLocacao = new Date(this.locacaoEscolhida!.entrada)
        const dataDevolucao = new Date(devolucao)
        const diferencaEmMilissegundos = dataDevolucao.getTime() - dataLocacao.getTime();
        const horas = diferencaEmMilissegundos / (1000 * 60 * 60);

        if (horas >= this.locacaoEscolhida!.numeroDeHoras && horas <= this.locacaoEscolhida!.numeroDeHoras + 0.25) {
            this.horasCorridas = this.locacaoEscolhida!.numeroDeHoras;
        }else if(horas < this.locacaoEscolhida!.numeroDeHoras){
            this.horasCorridas = Math.floor(horas) == 0 ? 1 : Math.floor(horas);
        }
        else {
            this.horasCorridas = Math.ceil(horas);
        }
        return this.horasCorridas;
    }

    public registrarAvaria(dadosAvaria){
        const itemLocacaoDaAvaria = this.getItensDaLocacaoPeloId([dadosAvaria.idItem]);
        const id = ServicoDevolucao.gerarIdParaAvaria(this.avarias);
        const avaria = new Avaria(id, dadosAvaria.descricao, itemLocacaoDaAvaria[0].item, new Date(), dadosAvaria.funcionario, dadosAvaria.valor, dadosAvaria.imagem[0]);
        const problemas = avaria.validar();
        if(problemas.length > 0)
            throw ErrorDominio.comProblemas(problemas);

        this.avarias.push(avaria);
    }

    public removerAvariaComId(idAvaria : string | number){
        const posicao = this.avarias.findIndex(avaria => avaria.id == idAvaria);
        this.avarias.splice(posicao, 1);
    }
}