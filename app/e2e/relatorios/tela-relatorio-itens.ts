import{expect, Page} from '@playwright/test';
import{seletores} from '../../src/locacao/relatorio/seletores-relatorio-itens'
import { APP } from '../../infra/app';
export class TelaRelatorioItens{
    constructor(private page:Page){}

    async abrir(){
        await this.page.goto(APP + "app/pages/relatorio-itens-locacoes.html");
    }

    async clicar(elemento:string){
        await this.page.click(elemento);
    }

    async esperarResposta(endpoint : string){
        await this.page.waitForResponse(response => response.url().includes(endpoint));
    }

    async preencherData(data:Date, seletor:string){
        const dataFormatada = data.toISOString().slice(0,16);
        await this.page.fill(seletor, dataFormatada);
    }

    async deveExibirUmItem(descricao:string){
        let seletor = this.page.locator(seletores.tabelaRanking);

        await expect(seletor).toContainText(descricao)
    }

    async deveExibirAMensagem(mensagemEsperada:string){
        let seletor = this.page.locator(seletores.erroOutput);
        seletor.waitFor();

        await expect(seletor).toContainText(mensagemEsperada);
    }
}