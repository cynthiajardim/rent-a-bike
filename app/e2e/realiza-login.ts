import { Page } from "@playwright/test";
import { APP } from "../infra/app";
import { sel } from "../src/login/seletores-login";

export async function logar(page: Page, cpf : string = '12345678901', senha : string = 'senha123') {
    await page.goto(APP);

    await page.fill(sel.campoUsuario, cpf);
    await page.fill(sel.campoSenha, senha);

    await page.click(sel.botaoLogar);
    await page.waitForURL('**/listagem-locacoes.html');
}
