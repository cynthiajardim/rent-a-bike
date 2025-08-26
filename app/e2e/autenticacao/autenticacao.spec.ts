import {test, expect } from "@playwright/test";
import { TelaAutenticacao } from "./tela-autenticacao";
import { APP, PAGE_CADASTRO_DEVOLUCAO, PAGE_LISTAGEM_LOCACOES } from "../../infra/app";
import { logar } from "../realiza-login";
import { sel } from "../../src/login/seletores-login";

test.describe('Testes de autenticação', () => {
    let tela: TelaAutenticacao;

    test.beforeAll(async () => {
        const { execa } = await import('execa');
        await execa('pnpm', ['db'], { stdio: 'inherit' });
    });
    
    test.beforeEach(async ({page}) => {
        tela = new TelaAutenticacao(page);
        await tela.abrir();
    });

    test("Ir para qualquer página sem estar logado deve retornar à página de login", async () => {
        await tela.mudarPagina(APP + PAGE_CADASTRO_DEVOLUCAO);
        expect(await tela.retornarPaginaAtual()).toBe(APP);
    });

    test("Realiza login com sucesso", async({page}) => {
        await logar(page);
        expect(await tela.retornarPaginaAtual()).toBe(APP + PAGE_LISTAGEM_LOCACOES);
    });

    test.describe("Erros no login", () => {
        test("CPF ou senha inválidos", async ()=>{
            await tela.preencherDadosDeLogin({cpf : "12345678901", senha : "senha12"});
            await tela.clicarEm(sel.botaoLogar);
            await tela.deveExibirMensagem("CPF ou senha incorretos", sel.output);
        });

        test("O CPF deve conter 11 caracteres", async () => {
            await tela.preencherDadosDeLogin({cpf : "123456789011", senha : "senha123"});
            await tela.clicarEm(sel.botaoLogar);
            await tela.deveExibirMensagem("11 caracteres", sel.output);
        });

        test("Nenhum funcionário encontrado com CPF", async () => {
            await tela.preencherDadosDeLogin({cpf : "12345678902", senha : "aaaaa"});
            await tela.clicarEm(sel.botaoLogar);
            await tela.deveExibirMensagem("Nenhum funcionário", sel.output);
        })
    });

    test("Botão sair deve retornar para tela de login", async ({page}) => {
        await logar(page);
        await tela.clicarEm(sel.botaoSair);
        await tela.esperarResposta("/logout");
        const urlAtual = await tela.retornarPaginaAtual();
        expect(urlAtual).toBe(APP);
    })


})