import { Page, expect } from "@playwright/test";
import { sel } from "../../src/devolucao/cadastro/seletores-cadastro-devolucao";
import { APP, PAGE_CADASTRO_DEVOLUCAO } from "../../infra/app";

export class TelaCadastroDevolucao{
    constructor(private page : Page){}

    async abrir(){
        await this.page.goto(APP + PAGE_CADASTRO_DEVOLUCAO)
    }

    async clicar(seletor : string){
        await this.page.click(seletor);
    }

    async preencherDados(dados: {locacao : string | number, data : Date}){
        const dataFormatada = this.gerarDataEHoraFormatada(dados.data);
        await this.page.fill(sel.devolucao, dataFormatada);
        await this.page.fill(sel.locacaoInput, dados.locacao.toString());
        await this.page.click(sel.pesquisarLocacao);
        await this.esperarResposta('/locacoes')
        const estaVisivel = await this.page.locator(sel.selectLocacao).isVisible()
        if(estaVisivel)
            await this.page.selectOption(sel.selectLocacao, {index : 1});
    }

    async preencherModalAvaria(dados:{descricao : string, valor : number, caminhoImagem : string}){
        const modalVisivel = await this.page.locator(sel.modalAvaria).isVisible()
        if(modalVisivel){
            await this.page.fill(sel.inputDescAvaria, dados.descricao);
            await this.page.fill(sel.inputValorAvaria, dados.valor.toString());
            await this.page.setInputFiles(sel.inputFotoAvaria, dados.caminhoImagem);
            await this.clicar(sel.botaoCadastrarAvaria);
        }
    }

    async esperarResposta(endpoint : string){
        await this.page.waitForResponse(response => response.url().includes(endpoint));
    }

    async exibirLocacoesDoCliente(qtdDeLocacaoes : number = -1){
        const options = this.page.locator(`${sel.selectLocacao} option`)
        const qtdDeOptions = await options.count();
        if(qtdDeLocacaoes == -1){
            expect(qtdDeOptions).toBeGreaterThan(1); // Porque tem o --Selecione--
        }else{
            expect(qtdDeOptions).toBe(qtdDeLocacaoes + 1);
        }
    }

    async exibirLocacaoComId(data: Date, id : string){
        const dataFormatada = this.gerarDataEHoraFormatada(data);
        await this.page.fill(sel.devolucao, dataFormatada);
        await this.page.fill(sel.locacaoInput, id);
        await this.page.click(sel.pesquisarLocacao);
        await this.esperarResposta('/locacoes')
        const dataId = await this.page.getAttribute(sel.locacaoOutput, 'data-id');
        const div = await this.page.locator(sel.locacaoOutput);
        const texto = await div.textContent();
        await expect(dataId).toBe(id);
        await expect(texto).toContain("Locação de valor");
    }

    private gerarDataEHoraFormatada(data : Date): string{
        data.setHours(data.getHours() - 3);
        return data.toISOString().slice(0, 16);
    }

    async deveExibirMensagem( mensagem : string ){
        const localizador = await this.page.locator(sel.output);
        let conteudo = await localizador.textContent();
        await this.page.waitForTimeout(1000);
        await expect(conteudo).toContain( mensagem );
    }

    async tabelaDeveConter(itens : string[]){
        const linhas = await this.page.locator('tbody tr');

        for (let i = 0; i < await linhas.count(); i++) {
            const primeiraColuna = linhas.nth(i).locator('td').first();
            const texto = await primeiraColuna.textContent();
            expect(texto).toContain(itens[i]);
        }
    }
}