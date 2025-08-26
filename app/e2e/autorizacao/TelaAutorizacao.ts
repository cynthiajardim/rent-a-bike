import { Page, expect } from "@playwright/test";
import { sel } from "../../src/autenticador/seletores-autenticador";
import { logar } from '../realiza-login';
import { APP, PAGE_CADASTRO_DEVOLUCAO, PAGE_CADASTRO_LOCACAO, PAGE_DEVOLUCOES, PAGE_LOCACOES, PAGE_RELATORIO_DEVOLUCAO, PAGE_RELATORIO_ITENS } from "../../infra/app";

export class TelaAutorizacao{
    constructor(private page : Page){}
    
    async irPara(url : string){
        await this.page.goto(url);
    }

    async realizarLogin(usuario : string, senha : string){
        await logar(this.page, usuario, senha);
    }

    async realizarLogout(){
        await this.page.click(sel.botaoSair);
    }

    async irParaListagemLocacoes(){
        await this.irPara(APP+PAGE_LOCACOES);
    }

    async irParaListagemDevolucoes(){
        await this.irPara(APP+PAGE_DEVOLUCOES);
    }

    async irParaRelatorioItens(){
        await this.irPara(APP + PAGE_RELATORIO_ITENS);
    }

    async irParaRelatorioDevolucao(){
        await this.irPara(APP + PAGE_RELATORIO_DEVOLUCAO);
    }

    async irParaCadastroLocacao(){
        await this.irPara(APP + PAGE_CADASTRO_LOCACAO);
    }

    async irParaCadastroDevolucao(){
        await this.irPara(APP + PAGE_CADASTRO_DEVOLUCAO);
    }

    async verificarSeBotaoEstaDisable(sel : string){
        const {TelaCadastroDevolucao} = await import('../devolucoes/TelaCadastroDevolucao');
        const telaDevolucao = new TelaCadastroDevolucao(this.page);
        telaDevolucao.preencherDados({locacao:'10',data: new Date()});
        const selRegistrarAvaria = this.page.locator(sel).first();
        await expect(selRegistrarAvaria).toBeDisabled();
    }

    async verificarUrl(url : string){
        await expect(this.page).toHaveURL(url)
    }
}