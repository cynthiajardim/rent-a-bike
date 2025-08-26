import {test} from "@playwright/test";
import { TelaRelatorioDevolucao } from "./tela-relatorio-devolucao";
import { sel } from "../../src/devolucao/relatorio/sel-relatorio-devolucao";
import { logar } from "../realiza-login";


test.describe('Relatório de devoluções por data de locação', async () => {
    let tela : TelaRelatorioDevolucao;

    test.beforeAll(async () => {
        const { execa } = await import('execa');
        await execa('pnpm', ['db'], { stdio: 'inherit' });
    });

    test.beforeEach( async ({page}) => {
        await logar(page);
        tela = new TelaRelatorioDevolucao(page);
        await tela.abrir();
    });

    test('Pesquisar sem data deve utilizar a data no início do mês e fim do mês', async () =>{
        await tela.clicar(sel.enviarBtn);
        await tela.esperarResposta("/devolucoes")
        await tela.graficoDeveAparecer();
    });

    test('Pesquisar datas válidas deve mostrar gráfico', async () =>{
        await tela.preencherDados({dataInicial : new Date(2025, 4, 1), dataFinal : new Date()});
        await tela.clicar(sel.enviarBtn);
        await tela.esperarResposta("/devolucoes")
        await tela.graficoDeveAparecer();
    });

    test('Pesquisar com data final menor que a inicial deve retornar mensagem de erro.', async () => {
        const dataFinal = new Date();
        dataFinal.setDate(dataFinal.getDate() - 3);
        await tela.preencherDados({dataInicial : new Date(), dataFinal : dataFinal});
        await tela.clicar(sel.enviarBtn);
        await tela.esperarResposta("/devolucoes")
        await tela.deveExibirMensagem("A data final não pode ser menor que a data inicial");
    });

    test('Pesquisar data inicial posterior a atual deve retornar mensagem de erro', async () => {
        const dataInicial = new Date();
        dataInicial.setDate(dataInicial.getDate() + 5);
        await tela.preencherDados({dataInicial : dataInicial, dataFinal : new Date()});
        await tela.clicar(sel.enviarBtn);
        await tela.esperarResposta("/devolucoes")
        await tela.deveExibirMensagem("A data inicial não pode ser maior que a data atual.");
    });
})