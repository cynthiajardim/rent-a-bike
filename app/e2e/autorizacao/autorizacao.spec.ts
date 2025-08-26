import { expect, test } from '@playwright/test';
import { TelaAutorizacao } from './TelaAutorizacao';
import { APP, FORBIDDEN, PAGE_CADASTRO_DEVOLUCAO, PAGE_CADASTRO_LOCACAO, PAGE_DEVOLUCOES, PAGE_LOCACOES, PAGE_RELATORIO_DEVOLUCAO, PAGE_RELATORIO_ITENS } from '../../infra/app';

test.describe('Autorização e permissão', () => {
    let tela : TelaAutorizacao;

    test.beforeAll(async () => {
        const { execa } = await import('execa');
        await execa('pnpm', ['db'], { stdio: 'inherit' });
    });

    test.describe('Usuário gerente', () => {
        test.beforeEach(async ({page}) => {
            tela = new TelaAutorizacao(page);

            const usuario = '12345678901';
            const senha = 'senha123';

            await tela.realizarLogin(usuario, senha);
        });
        
        test('Consegue acessar listagem de locações', async() => {
            await tela.irParaListagemLocacoes();
            await tela.verificarUrl(APP+PAGE_LOCACOES);
        });

        test('Consegue acessar listagem de devoluções', async() => {
            await tela.irParaListagemDevolucoes();
            await tela.verificarUrl(APP+PAGE_DEVOLUCOES);
        });

        test('Consegue acessar relatório de itens', async() => {
            await tela.irParaRelatorioItens();
            await tela.verificarUrl(APP+PAGE_RELATORIO_ITENS);
        });

        test('Consegue acessar relatório de devoluções', async() => {
            await tela.irParaRelatorioDevolucao();
            await tela.verificarUrl(APP+PAGE_RELATORIO_DEVOLUCAO);
        });

        test('Consegue acessar cadastro de locação', async() => {
            await tela.irParaCadastroLocacao();
            await tela.verificarUrl(APP+PAGE_CADASTRO_LOCACAO);
        });

        test('Consegue acessar cadastro de devolução', async() => {
            await tela.irParaCadastroDevolucao();
            await tela.verificarUrl(APP+PAGE_CADASTRO_DEVOLUCAO);
        });

    });

    test.describe('Usuário Atendente', () => {
        test.beforeEach(async ({page}) => {
            tela = new TelaAutorizacao(page);

            const usuario = '34567890123';
            const senha = 'renato!@#';

            await tela.realizarLogin(usuario, senha);
        });
        
        test('Consegue acessar relatório de itens', async() => {
            await tela.irParaRelatorioItens();
            await tela.verificarUrl(APP+PAGE_RELATORIO_ITENS);
        });

        test('Consegue acessar listagem de locações', async() => {
            await tela.irParaListagemLocacoes();
            await tela.verificarUrl(APP+PAGE_LOCACOES);
        });

        test('Consegue acessar listagem de devoluções', async() => {
            await tela.irParaListagemDevolucoes();
            await tela.verificarUrl(APP+PAGE_DEVOLUCOES);
        });

        test('Não consegue acessar relatório de devoluções', async() => {
            await tela.irParaRelatorioDevolucao();
            await tela.verificarUrl(APP+FORBIDDEN);
        });

        test('Consegue acessar cadastro de locação', async() => {
            await tela.irParaCadastroLocacao();
            await tela.verificarUrl(APP+PAGE_CADASTRO_LOCACAO);
        });

        test('Consegue acessar cadastro de devolução', async() => {
            await tela.irParaCadastroDevolucao();
            await tela.verificarUrl(APP+PAGE_CADASTRO_DEVOLUCAO);
        });

        test('Botão de avaria bloqueado', async () => {
            await tela.realizarLogin('34567890123', 'renato!@#');
            await tela.irParaCadastroDevolucao();
            const {sel : selDevolucao} = await import('../../src/devolucao/cadastro/seletores-cadastro-devolucao');
            await tela.verificarSeBotaoEstaDisable(selDevolucao.botaoRegistrarAvaria);

        });
    });

    test.describe('Usuário Mecânico', () => {
        test.beforeEach(async ({page}) => {
            tela = new TelaAutorizacao(page);

            const usuario = '45678901234';
            const senha = 'clara321';

            await tela.realizarLogin(usuario, senha);
        });

        test('Consegue acessar listagem de locações', async() => {
            await tela.irParaListagemLocacoes();
            await tela.verificarUrl(APP+PAGE_LOCACOES);
        });

        test('Consegue acessar listagem de devoluções', async() => {
            await tela.irParaListagemDevolucoes();
            await tela.verificarUrl(APP+PAGE_DEVOLUCOES);
        });

        test('Não consegue acessar relatório de itens', async() => {
            await tela.irParaRelatorioItens();
            await tela.verificarUrl(APP+FORBIDDEN);
        });

        test('Não consegue acessar relatório de devoluções', async() => {
            await tela.irParaRelatorioDevolucao();
            await tela.verificarUrl(APP+FORBIDDEN);
        });

        test('Não consegue acessar cadastro de locação', async() => {
            await tela.irParaCadastroLocacao();
            await tela.verificarUrl(APP+FORBIDDEN);
        });

        test('Não consegue acessar cadastro de devolução', async() => {
            await tela.irParaCadastroDevolucao();
            await tela.verificarUrl(APP+FORBIDDEN);
        });
    });
});