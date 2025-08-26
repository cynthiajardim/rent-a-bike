import { VisaoCadastroDevolucao } from "./visao-cadastro-devolucao.js";
import {GestorDevolucao} from '../gestor-devolucao.js';
import { ErrorDominio } from "../../../infra/ErrorDominio.js";
import { ItemLocacao } from "../../item/item-locacao.js";

export class ControladoraCadastroDevolucao {
    private visao : VisaoCadastroDevolucao
    private gestor : GestorDevolucao

    public constructor(visao : VisaoCadastroDevolucao){
        this.visao = visao;
        this.gestor = new GestorDevolucao()
    }

    async coletarFuncionarios(){
        try{
            const funcionarios = await this.gestor.coletarFuncionariosCadastrados();
            this.visao.exibirFuncionarios(funcionarios);
        }catch(erro){
            if(erro instanceof ErrorDominio)
                this.visao.exibirMensagens(erro.getProblemas(), true);
            else 
                this.visao.exibirMensagens([erro.message], true);
        }
    }

    async pesquisarLocacao(){
        const pesquisa = this.visao.coletarInputLocacao();
        try{
            const locacoes = await this.gestor.pesquisarLocacao(pesquisa);
            this.visao.exibirLocacoes(locacoes);
        }catch( error ){
            if(error instanceof ErrorDominio)
                this.visao.exibirMensagens(error.getProblemas(), true);
            else
                this.visao.exibirMensagens([ error.message ], true);
        }
    }

    async verificarSePodeCadastrarAvaria(){
        try{
            const pode = await this.gestor.podeCadastrarAvaria();
            this.visao.podeCadastrarAvaria(pode);
        }catch( error ){
            if(error instanceof ErrorDominio)
                this.visao.exibirMensagens(error.getProblemas(), true);
            else
                this.visao.exibirMensagens([ error.message ], true);
        }
    }

    calcularValores(){
        const subtotais : number[] = this.visao.coletarSubtotais();
        const itensASeremLimpos : number [] = this.visao.coletarIdsItensASeremLimpos();

        const {valorTotal, desconto, valorFinal, valorTaxaLimpeza} = this.gestor.calcularValores(subtotais, itensASeremLimpos);
        this.visao.preencherValores({valorTotal, desconto, valorFinal, valorTaxaLimpeza})
    }

    calcularSubtotal(item : ItemLocacao){
        const devolucao = this.visao.coletarDataDevolucao();
        return this.gestor.calcularSubtotal(item, devolucao);
    }

    procurarLocacaoDoSelecionada(){
        const id = this.visao.coletarIdLocacaoDoSelect();
        const locacao = this.gestor.getLocacacaoDoGestorPeloId(id);
        this.visao.exibirLocacoes(locacao);
    }

    registrarAvaria(){
        try{
            const dadosAvaria = this.visao.coletarDadosAvaria();
            this.gestor.registrarAvaria(dadosAvaria);
            this.visao.limparFormAvaria();

            const multa = this.gestor.calcularMulta();
            this.visao.exibirMulta(multa);

            const novoValorFinal = this.gestor.recalcularValorFinal(multa);
            this.visao.atualizarValorFinal(novoValorFinal);
            
            this.visao.exibirMensagens(["Avaria do item registrada com sucesso!"], false);
            this.coletarAvariasDoItem();
        }catch(error){
            if(error instanceof ErrorDominio)
                this.visao.exibirMensagens(error.getProblemas(), true);
            else
                this.visao.exibirMensagens([ error.message ], true);
        }
    } 

    removerAvaria(){
        try{
            const idAvariaParaRemover = this.visao.coletarIdAvariaParaRemover();
            this.gestor.removerAvariaComId(idAvariaParaRemover);
            this.visao.exibirMensagens(['Avaria removida com sucesso.'], false);
        }catch(error){
            if(error instanceof ErrorDominio)
                this.visao.exibirMensagens(error.getProblemas(), true);
            else
                this.visao.exibirMensagens([ error.message ], true);
        }
    }

    coletarAvariasDoItem(){
        try{
            const idItem = this.visao.coletarIdItemAvaria();
            const avarias = this.gestor.getAvariasDoGestorPeloIdItem(idItem);
            this.visao.exibirAvariasDoItem(avarias);
        }catch(error){
            if(error instanceof ErrorDominio)
                this.visao.exibirMensagens(error.getProblemas(), true);
            else
                this.visao.exibirMensagens([ error.message ], true);
        }
    }

    async enviarDados(){
        try{
            const valorFinal = this.visao.coletarValorFinal();
            const itensParaLimpeza = this.visao.coletarIdsItensASeremLimpos();

            await this.gestor.salvarDevolucao(this.visao.coletarDataDevolucao(), itensParaLimpeza, valorFinal);
            this.visao.limparForm();
            this.visao.exibirMensagens(['Devolvido com sucesso.'], false);
        }catch( error ){
            if(error instanceof ErrorDominio)
                this.visao.exibirMensagens(error.getProblemas(), true);
            else
                this.visao.exibirMensagens([ error.message ], true);
        }
    }


}