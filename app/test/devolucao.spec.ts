import {describe, expect, it, beforeEach} from 'vitest'

import { Devolucao } from '../src/devolucao/devolucao.js'
import { ServicoDevolucao } from '../src/devolucao/servico-devolucao.js';
import {GestorDevolucao} from '../src/devolucao/gestor-devolucao.js'
import { Locacao } from '../src/locacao/locacao.js';
import { Item } from '../src/item/item.js';
import { ItemLocacao } from '../src/item/item-locacao.js';
import { Avaria } from '../src/item/avaria.js';
import { Currencies, Money } from 'ts-money';

describe("Devolução", () => {
    it('Valida dado corretamente', async () => {
        const devolucao: Devolucao = new Devolucao(1,new Date(), 0, 1, 1, []);
        const problemas = devolucao.validar();
        expect(problemas.length).toBe(1);
    })

})

describe("Serviço Devolução", ()=>{
    it("Calcula valores corretamente", async () => {
        const item = new Item(1, 'I00001', 'Item de teste', 'Modelo teste', 'Fabricante teste', 20, true, 'equipamento');
        const itemLocacao = new ItemLocacao(10, item, 20, 40);

        const subtotais = [1,4,5];
        const horasCorridas = 3;
        
        const {valorTotal, desconto, valorFinal} = ServicoDevolucao.calcularValores(subtotais, horasCorridas, [itemLocacao]);
        expect(valorTotal).toBeCloseTo(10);
        expect(desconto).toBeCloseTo(1);
        expect(valorFinal).toBeCloseTo(11);
    })

    it("Calcula multa corretamente", async() => {
        const item = new Item(1, 'I00001', 'Item de teste', 'Modelo teste', 'Fabricante teste', 20, true, 'equipamento');
        const itemLocacao = new ItemLocacao(10, item, 20, 40);
        const avaria = new Avaria(2, "Avaria de teste", item, new Date(), 2, 20, null);

        const valorEsperado = new Money(2000, Currencies.BRL); //20.00
        const valorRecebido = ServicoDevolucao.calcularMulta([itemLocacao], [avaria]);
        expect(valorRecebido).toEqual(valorEsperado);
    });
})

describe("Gestor de Devolução", () => {
    let gestor : GestorDevolucao;

    beforeEach(() => {
        gestor = new GestorDevolucao();

        const entrada = new Date(Date.now() - 2 * 60 * 60 * 1000); // menos duas horas em relacao a agora
        const locacao = new Locacao(1, 1, 1, [], entrada, 4, 0, 0, new Date(Date.now() + 2 * 60 * 60 * 1000)); // mais duas horas em relacao a agora

        // @ts-ignore
        gestor.locacaoEscolhida = locacao;
    });

    it('deve retornar a quantidade de horas correta', async () => {
        const horas = gestor.calcularHorasCorridas(new Date().toISOString());
        expect(horas).toBeCloseTo(2)
    })

    it('deve usar as horas previstas dentro da tolerância', async () => {
        const devolucao = new Date(Date.now() + 2 * 60 * 60 * 1000);
        devolucao.setMinutes(devolucao.getMinutes() + 14);
        const horas = gestor.calcularHorasCorridas(devolucao.toISOString());
        expect(horas).toBe(4)
    })

    it('deve arredondar pra cima se passar da tolerância', async () => {
        const devolucao = new Date(Date.now() + 2 * 60 * 60 * 1000);
        devolucao.setMinutes(devolucao.getMinutes() + 16);
        const horas = gestor.calcularHorasCorridas(devolucao.toISOString());
        expect(horas).toBe(5)
    })

})