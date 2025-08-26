import { Page, expect } from "@playwright/test";
import { sel } from "../../src/devolucao/relatorio/sel-relatorio-devolucao";
import { APP } from "../../infra/app";

export class TelaRelatorioDevolucao{
    
    constructor(private page : Page){}

    async abrir(){
        await this.page.goto(APP + "app/pages/grafico-devolucoes.html");
    }

    async clicar(seletor : string){
        await this.page.click(seletor);
    }

    async esperarResposta(endpoint : string){
        await this.page.waitForResponse(response => response.url().includes(endpoint));
    }

    async deveExibirMensagem(mensagem : string){
        const localizador = await this.page.locator(sel.erroOutput);
        let conteudo = await localizador.textContent();
        await this.page.waitForTimeout(1000);
        await expect(conteudo).toContain( mensagem );
    }

    async preencherDados(dados : {dataInicial : Date, dataFinal : Date}){
        const dataInicialString = this.gerarDataFormatada(dados.dataInicial);
        const dataFinalString = this.gerarDataFormatada(dados.dataFinal);

        await this.page.fill(sel.dataInicial, dataInicialString);
        await this.page.fill(sel.dataFinal, dataFinalString);
    }

    async graficoDeveAparecer(){
        await this.page.waitForSelector(sel.graficoOutput, {
            state: 'attached',
        });

        const existeGraficoDesenhado = await this.page.$eval(sel.graficoOutput, (canvasElement) => {
            const canvas = canvasElement as HTMLCanvasElement;
            const contexto = canvas.getContext('2d');
            return contexto !== null;
        });

        expect(existeGraficoDesenhado).toBe(true);
    }

    private gerarDataFormatada(data : Date): string{
        data.setHours(data.getHours() - 3);
        return data.toISOString().slice(0, 10);
    }

}