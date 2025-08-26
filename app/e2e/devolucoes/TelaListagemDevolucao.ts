import {Page, expect} from '@playwright/test'
import { APP, PAGE_DEVOLUCOES } from '../../infra/app';

export class TelaListagemDevolucao{
    constructor(private page : Page){}

    async abrir(){
        await this.page.goto(APP + PAGE_DEVOLUCOES)
    }

    async irPara(seletor : string){
        await this.page.click(seletor)
    }

    async verificarUrl(url : string){
        await expect(this.page).toHaveURL(url)
    }

    async esperarResposta(endpoint : string){
        await this.page.waitForResponse(response => response.url().includes(endpoint));
    }

    async deveConterDevolucao( id : number){
        await this.irPara('.devolucoes')
        this.esperarResposta('/devolucoes')
        const tbody = this.page.locator('tbody')

        await expect(tbody).toContainText(id.toString());
    }

    async deveExibirMensagem(mensagem:string){
        const output = this.page.locator('output');
        await expect(output).toContainText(mensagem);
    }
}