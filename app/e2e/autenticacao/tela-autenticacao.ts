import { expect, Page } from "@playwright/test";
import { APP } from "../../infra/app";
import { sel } from "../../src/login/seletores-login";

export class TelaAutenticacao{
    constructor(private page : Page){}

    async abrir(){
        await this.page.goto(APP);
    }

    async mudarPagina(url : string){
        await this.page.goto(url);
    }

    async retornarPaginaAtual(){
        await this.page.waitForTimeout(1000);
        return this.page.url();
    }

    async deveExibirMensagem( mensagem : string , seletor : string){
        const localizador = await this.page.locator(seletor);
        await this.page.waitForTimeout(1000);
        let conteudo = await localizador.textContent();
        await expect(conteudo).toContain( mensagem );
    }

    async preencherDadosDeLogin(dados : {cpf: string, senha : string}){
        await this.page.fill(sel.campoUsuario, dados.cpf);
        await this.page.fill(sel.campoSenha, dados.senha);
    }

    async clicarEm(sel : string){
        await this.page.click(sel);
    }

    async esperarResposta(endpoint : string){
        await this.page.waitForResponse(response => response.url().includes(endpoint));
    }
}