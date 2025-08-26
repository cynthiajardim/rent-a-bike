import { ErrorDominio } from "../../../infra/ErrorDominio";
import { GestorLocacao } from "../gestor-locacao";
import { VisaoCadastroLocacao } from "./visao-cadastro-locacao";

export class ControladoraCadastroLocacao{

    private visao:VisaoCadastroLocacao;
    private gestor:GestorLocacao;

    constructor(visao:VisaoCadastroLocacao){
        this.visao = visao;
        this.gestor = new GestorLocacao();
    }

    async cadastrar(){
        const dados = this.visao.coletarDados();
        try{
            await this.gestor.salvarLocacao({cliente:dados.cliente, horas:dados.horas});

            this.visao.exibirMensagens(['Locação salva com sucesso!'], false);
            this.visao.limparTelaCadastro();
        }catch(erro){
            if(erro instanceof ErrorDominio)
                this.visao.exibirMensagens(erro.getProblemas(), true);
            else 
                this.visao.exibirMensagens([erro.message], true);
        }
    }

    async coletarClienteComCodigoOuCpf(){
        try{
            const codigoCpf = this.visao.coletarCliente();
            const cliente = await this.gestor.coletarClienteComCodigoOuCpf(codigoCpf);

            this.visao.exibirCliente({id:cliente.id, nome:cliente.nome, foto:cliente.foto});
        }catch(erro){
            if(erro instanceof ErrorDominio)
                this.visao.exibirMensagens(erro.getProblemas(), true);
            else 
                this.visao.exibirMensagens([erro.message], true);
        }
    }

    async coletarItemComCodigo() {
        try{
            const codigo = this.visao.coletarCodigoItem();
            const item = await this.gestor.coletarItemComCodigo(codigo);
            this.visao.exibirItem({codigo:item.item.codigo, descricao:item.item.descricao, disponibilidade:item.item.disponibilidade, valorPorHora:item.item.valorPorHora, avaria:item.avaria});
        }catch(erro){
            if(erro instanceof ErrorDominio)
                this.visao.exibirMensagens(erro.getProblemas(), true);
            else 
                this.visao.exibirMensagens([erro.message], true);
        }
    }

    removerItemComCodigo(codigo:string){
        try{
            this.gestor.removerItemComCodigo(codigo);
            this.visao.exibirMensagens(["Item de código "+codigo+" removido com sucesso."], false);
        }catch(erro){
            this.visao.exibirMensagens([erro.message], true);
        }
    }

    atualizarDados(){
        try{
            const horas = this.visao.coletarHoras();
            const dados = this.gestor.calcularLocacao(horas);

            this.visao.construirTabela({itens:dados.dadosItens, valores:dados.valores});
            this.visao.exibirDataHoraEntrega(dados.entrega);
        }catch(erro){
            if(erro instanceof ErrorDominio)
                this.visao.exibirMensagens(erro.getProblemas(), true);
            else 
                this.visao.exibirMensagens([erro.message], true);
        }
    }
}