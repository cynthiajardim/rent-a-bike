import {test} from '@playwright/test';
import { TelaCadastroDevolucao } from './TelaCadastroDevolucao';
import { sel } from '../../src/devolucao/cadastro/seletores-cadastro-devolucao';
import { logar }from '../realiza-login';
const path = require('path');


test.describe('Cadastro de Devoluções', () =>{
    let tela : TelaCadastroDevolucao

    test.beforeAll(async () => {
        const { execa } = await import('execa');
        await execa('pnpm', ['db'], { stdio: 'inherit' });
    });


    test.beforeEach( async ({page}) => {
        await logar(page);
        tela = new TelaCadastroDevolucao(page);
        await tela.abrir();
    })

    test('Cadastro sem campo preenchido retorna mensagem de erro', async ()=> {
        await tela.clicar(sel.devolverBtn);
        await tela.deveExibirMensagem('deve ser informada');
    })

    test("Select apenas mostra as locações ativas de um cliente", async()=>{
        await tela.preencherDados({locacao : "98765432100", data : new Date()});
        await tela.exibirLocacoesDoCliente(4);
    })

    test("Locação inexistente deve retornar mensagem de erro", async () => {
        await tela.preencherDados({locacao  : "23123123", data : new Date()});
        await tela.deveExibirMensagem("Locações não encontradas.");
    })
    
    test('Data posterior a atual deve retornar mensagem com erro', async () =>{
        const data = new Date();
        data.setHours(data.getHours() + 3);
        await tela.preencherDados({locacao : '2', data : data});
        await tela.clicar(sel.devolverBtn);
        await tela.deveExibirMensagem('A data de devolução deve ser menor ou igual a atual.');
    })
    
    test('As locações de um cliente devem ser preenchidas dentro do select', async () => {
        await tela.preencherDados({locacao :'98765432100', data : new Date() });
        await tela.exibirLocacoesDoCliente();
    })
    
    test('A locação pesquisada pelo ID deve ser apresentada corretamente', async () => {
        await tela.exibirLocacaoComId(new Date(), '2')
    })
    
    test('Verifica itens da tabela', async () => {
        await tela.preencherDados({locacao : '2', data: new Date()});
        await tela.tabelaDeveConter(["I0000003", "I0000004"])
    })
    
    test('Cadastro é efetuado com sucesso com ID' , async () => {
        await tela.preencherDados({locacao : '2', data : new Date()});
        await tela.clicar(sel.devolverBtn);
        await tela.esperarResposta('/devolucoes')
        await tela.deveExibirMensagem('Devolvido')
    })
    
    test('Cadastro é efetuado com sucesso com CPF', async () => {
        await tela.preencherDados({locacao : '98765432100', data : new Date()})
        await tela.clicar(sel.devolverBtn);
        await tela.esperarResposta('/devolucoes')
        await tela.deveExibirMensagem('Devolvido')
    })

    test('Cadastro de avaria é realizado com sucesso', async() => {
        const caminhoImagem = path.resolve(__dirname, 'avariaTeste.jpg');
        
        await tela.preencherDados({locacao : '10', data: new Date()});
        await tela.clicar(sel.pesquisarLocacao);

        await tela.clicar(sel.botaoRegistrarAvaria);
        await tela.preencherModalAvaria({descricao : "Testando avaria", valor : 2, caminhoImagem : caminhoImagem});
        await tela.deveExibirMensagem("Avaria do item registrada com sucesso");
    })
})