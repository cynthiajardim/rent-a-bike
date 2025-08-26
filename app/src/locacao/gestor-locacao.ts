import { API } from "../../infra/api";
import { Item } from "../item/item";
import { Locacao } from "./locacao";
import { ErrorDominio } from "../../infra/ErrorDominio";
import { ItemLocacao } from "../item/item-locacao";
import { ServicoLocacao } from "./servico-locacao";

export class GestorLocacao{
    private itens : ItemLocacao[] = [];

    private setItem(objItem){
        if(this.itens.some(e => e.item.id == objItem.id)){
            throw ErrorDominio.comProblemas(["item já adicionado."]);
        }

        if(!objItem.disponibilidade)
            throw ErrorDominio.comProblemas(["Item indisponível."]);

        const item = new Item(
            objItem.id,
            objItem.codigo,
            objItem.descricao,
            objItem.modelo,
            objItem.fabricante,
            objItem.valorPorHora,
            objItem.disponibilidade,
            objItem.tipo
        );

        const itemLocacao = new ItemLocacao(
            0,
            item, 
            item.valorPorHora,
            0
        );

        this.itens.push(itemLocacao);
    }

    getItens() : ItemLocacao[]{
        return this.itens;
    }

    private atualizarSubtotalItens(horas:number){
        this.itens.map(item => item.calcularSubtotal(horas));
    }

    private getDadosPrincipaisItem(){
        let dados:Object[] = [];
        for(let i of this.itens){
            dados.push({codigo:i.item.codigo, descricao:i.item.descricao, subtotal:i.subtotal});
        }

        return dados;
    }

    calcularLocacao(horas:number) : {valores, entrega, dadosItens}{
        this.atualizarSubtotalItens(horas);
        const valoresAtualizados = ServicoLocacao.calcularValores(this.itens, horas);

        return {
            valores     : valoresAtualizados,
            entrega     : valoresAtualizados.entrega,
            dadosItens  : this.getDadosPrincipaisItem()
        };
    }

    async salvarLocacao({cliente, horas}) : Promise<void> {
        const locacao = new Locacao(
            100, 
            cliente, 
            null, 
            this.itens,
            new Date(),
            horas,
            0,
            0,
            ServicoLocacao.calcularEntrega(horas)
        );

        const problemas = locacao.validar();
        if(problemas.length > 0)
            throw ErrorDominio.comProblemas(problemas);

       
        await this.cadastrarLocacao(locacao);
    }

    private async cadastrarLocacao(locacao:Locacao){
        const response = await fetch(API + "locacoes", 
        {
            method:"POST",
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify(locacao),
            credentials: 'include'
        }
        );

        const retorno = await response.json()
        if(!retorno.success || !response.ok){
            throw ErrorDominio.comProblemas([retorno.message]);
        }
    }

    async coletarLocacoes() : Promise<any>{
        const response = await fetch(API + "locacoes", {credentials: 'include'});
        // if(!response.ok)
        //     throw ErrorDominio.comProblemas(["Erro ao obter as locações."]);

        const locacoes = await response.json();
        if(!response.ok){
            throw ErrorDominio.comProblemas([locacoes.message])
        }
        if(locacoes.length == 0)
            throw ErrorDominio.comProblemas(['Não há locações para serem exibidas.']);

        return locacoes.data;
    }

    async coletarItemComCodigo(codigo:string){
        if(codigo == '')
            throw ErrorDominio.comProblemas(["Digite um código válido."]);
        
        const response = await fetch(API + "itens?codigo=" + codigo, {credentials: 'include'});
        const retorno = await response.json();

        if(!retorno.success || !response.ok)
            throw ErrorDominio.comProblemas([retorno.message]);

        if(retorno.data.length == 0)
            throw ErrorDominio.comProblemas(["Nenhum item encontrado."]);

        this.setItem(retorno.data.item);
        return retorno.data;
    }

    async obterItensParaRelatorio(dataInicial:string, dataFinal:string){
        const url = `itens?dataInicial=${dataInicial}&dataFinal=${dataFinal}`;
        const response = await fetch(API + url, {credentials: 'include'})
        const retorno = await response.json();

        if(!retorno.success || !response.ok){
            throw ErrorDominio.comProblemas([retorno.message]);
        }

        if(retorno.data.length == 0){
            throw ErrorDominio.comProblemas(["Dados não encontrados."]);
        }

        return retorno.data;
    }

    removerItemComCodigo(codigo:string){
        const posicao = this.itens.findIndex(e => e.item.codigo == codigo);
        this.itens.splice(posicao, 1);
    }

    async coletarFuncionariosCadastrados(){
        const response = await fetch(API + "funcionarios", {credentials: 'include'});

        if(!response.ok)
            throw ErrorDominio.comProblemas(["Erro ao obter funcionários."+response.status]);

        const dados = await response.json();
        return dados.data;
    }
    
    async coletarClienteComCodigoOuCpf(codigoCpf:string){
        if(/[^a-zA-Z0-9]/g.test(codigoCpf)){
            throw ErrorDominio.comProblemas(["O campo de cliente não deve conter caracteres especiais."]);
        }

        let campo = "?parametro="+codigoCpf;
        const response = await fetch(API + "clientes"+campo, {credentials: 'include'});
        const retorno = await response.json();
        
        if(!retorno.success || !response.ok){
            throw ErrorDominio.comProblemas([retorno.message]);
        }

        if(retorno.data.length == 0)
            throw ErrorDominio.comProblemas(['Cliente não encontrado.']);

        return retorno.data;
    }
}