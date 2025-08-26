import{expect, Page} from '@playwright/test';
import {APP, PAGE_LOCACOES} from '../../infra/app';

export class TelaLocacoes {
    constructor(private page:Page){}

    async abrir(){
        await this.page.goto(APP + PAGE_LOCACOES);
    }

    async irPara(seletor){
        await this.page.click(seletor)
    }

    async esperarResposta(endpoint : string){
        await this.page.waitForResponse(response => response.url().includes(endpoint));
    }

    async verificarLink(url:string){
        await expect(this.page).toHaveURL(url);
    }

    async deveExibirUmaLocacao(id:number){
        await this.esperarResposta('/locacoes')
        let seletor = this.page.locator("tbody");

        await expect(seletor).toContainText(id.toString())
    }

    async deveExibirMensagem(mensagem:string){
        const output = this.page.locator('output');
        await expect(output).toContainText(mensagem);
    }
}