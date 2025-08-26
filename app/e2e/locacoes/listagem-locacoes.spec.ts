import { expect, test} from "@playwright/test";
import { TelaLocacoes } from "./tela-locacoes";
import { logar } from "../realiza-login";

test.describe('Listagem de locações', () => {
    let tela:TelaLocacoes;

    test.beforeAll(async () => {
        const { execa } = await import('execa');
        await execa('pnpm', ['db'], { stdio: 'inherit' });
    });

    test.beforeEach(async ({page}) => {
        await logar(page);
        tela = new TelaLocacoes(page);
        await tela.abrir()
    })

    test('abrir página correta de locações', async() => {
        await tela.irPara(".locacoes");
        await tela.verificarLink("http://localhost:5173/app/pages/listagem-locacoes.html");
    })

    test('verificar listagem de locações registradas', async() => {
        await tela.irPara(".locacoes");
        await tela.deveExibirUmaLocacao(1);
    })

    test('botão cadastrar altera a url', async() => {
        await tela.irPara(".locacoes");
        await tela.irPara("#cadastrar-locacao");
        await tela.verificarLink("http://localhost:5173/app/pages/cadastrar-locacao.html");
    })

    test('não há itens na tabela', async() =>{
        const { execa } = await import('execa');
        await execa('pnpm', ['db:e'], { stdio: 'inherit' });

        await tela.irPara('.locacoes');
        await tela.deveExibirMensagem("Nenhuma locação encontrada.");
    })
})