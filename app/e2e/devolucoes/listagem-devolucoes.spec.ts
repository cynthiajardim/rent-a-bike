import { test } from '@playwright/test'
import { TelaListagemDevolucao } from './TelaListagemDevolucao.js'
import { logar } from '../realiza-login.js';

test.describe('Listagem de devoluções', async () => {

    let tela : TelaListagemDevolucao

    test.beforeAll(async () => {
        const { execa } = await import('execa');
        await execa('pnpm', ['db'], { stdio: 'inherit' });
    });

    test.beforeEach( async ({page}) => {
        await logar(page);
        tela = new TelaListagemDevolucao(page);
        tela.abrir();
    })

    test('Consegue ir para a página correta', async () => {
        await tela.irPara('.devolucoes')
        await tela.verificarUrl('http://localhost:5173/app/pages/listagem-devolucoes.html')
    })

    test('Lista ao menos uma devolução', async () => {
        await tela.deveConterDevolucao(1);
    })

    test('Clicar em cadastrar deve ir para a página' , async () => {
        await tela.irPara('.devolucoes')
        await tela.irPara('.register-btn')
        await tela.verificarUrl('http://localhost:5173/app/pages/cadastrar-devolucoes.html')
    })

    test('Listagem vazia exibe mensagem correta', async () => {
        const { execa } = await import('execa');
        await execa('pnpm', ['db:e'], { stdio: 'inherit' });

        await tela.irPara('.devolucoes')
        await tela.deveExibirMensagem("Nenhuma devolução encontrada.");
    })
})