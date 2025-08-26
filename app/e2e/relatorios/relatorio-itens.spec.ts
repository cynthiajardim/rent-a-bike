import { test} from "@playwright/test";
import { TelaRelatorioItens } from "./tela-relatorio-itens";
import { seletores } from "../../src/locacao/relatorio/seletores-relatorio-itens";
import { logar } from "../realiza-login";

test.describe('Relatório de Itens por Período', () => {
    let tela:TelaRelatorioItens;

    test.beforeAll(async () => {
        const { execa } = await import('execa');
        await execa('pnpm', ['db'], { stdio: 'inherit' });
    });

    test.beforeEach(async ({page}) => {
        await logar(page);
        tela = new TelaRelatorioItens(page);
        await tela.abrir()
    })

    test('Relatório gerado sem datas inseridas', async() => {
        await tela.clicar(seletores.botaoGerar);
        //considerando o mês de junho para esse item alugado 
        await tela.deveExibirUmItem("");
    })

    test('Data inicial inválida inserida', async() => {
        const dataInicial = new Date(); 
        dataInicial.setDate(dataInicial.getDate() + 3); 

        await tela.preencherData(dataInicial, seletores.dataInicial);
        
        await tela.clicar(seletores.botaoGerar);
        await tela.deveExibirAMensagem("Data inicial não deve ser maior do que a data atual");
    })

    test('Datas inválidas inseridas', async() => {
        const dataInicial = new Date(2025, 5, 6); 
        const dataFinal = new Date(2025, 5, 3);
        
        await tela.preencherData(dataInicial, seletores.dataInicial);
        await tela.preencherData(dataFinal, seletores.dataFinal);
        await tela.clicar(seletores.botaoGerar);

        await tela.deveExibirAMensagem("Data final não deve ser menor do que a data inicial");
    })

    test('Relatório vazio quando não há dados cadastrados', async() =>{
        const { execa } = await import('execa');
        await execa('pnpm', ['db:e'], { stdio: 'inherit' });

        await tela.clicar(seletores.botaoGerar);
        await tela.deveExibirAMensagem("Dados não encontrados.");
    })
})