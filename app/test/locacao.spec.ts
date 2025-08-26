import { beforeAll, beforeEach, describe, expect, it } from "vitest";
import { ItemLocacao } from "../src/item/item-locacao";
import { Item } from "../src/item/item";
import { Locacao } from "../src/locacao/locacao";
import { ServicoLocacao } from "../src/locacao/servico-locacao";
import { Currencies, Money } from "ts-money";

let itens; 
beforeAll( () => {
    itens = [
        new ItemLocacao(2, new Item(1, 'I0000432', 'Item 432', 'Modelo Novo', 'Caloi', 25, '', true, 'bicicleta'), 25, 25),
        new ItemLocacao(3, new Item(2, 'I0000435', 'Item 435', 'Modelo Novo 2', 'Caloi', 50, '', true, 'bicicleta'), 20, 50)
    ];
});

describe('Locação', () => {
    it('retorna erro quando há dados inválidos', () => {
        let cliente = 1;
        let funcionario = 2;

        const locacao = new Locacao(3, cliente, funcionario, itens, new Date(), 0, -1, 0, new Date());
        const problemas = locacao.validar();

        expect(problemas.length).toBe(2);
    });
});

describe('Serviço de locação', () => {
    let valores;

    beforeAll( () => {
        valores = ServicoLocacao.calcularValores(itens, 1);
    });

    it('calcula total corretamente', () => {
        const totalEsperado = new Money(7500, Currencies.BRL); //o subtotal está retorando multiplicado por 100 
        const totalRecebido = valores['valorTotal'];
        expect(totalRecebido).toEqual(totalEsperado);
    });

    it('calcula desconto', () => {
        const descontoEsperado = new Money(0, Currencies.BRL);
        const descontoRecebido = valores['valorDesconto'];
        expect(descontoRecebido).toEqual(descontoEsperado);
    });

    it('calcula valor final', () => {
        const valorFinalEsperado = new Money(7500, Currencies.BRL);
        const valorFinalRecebido = valores['valorFinal'];
        expect(valorFinalRecebido).toEqual(valorFinalEsperado);
    });

    it('calcula data de entrega', () => {
        const horas = 4;
        const horaEsperada = new Date();
        horaEsperada.setHours(horaEsperada.getHours() + horas);

        const horaRecebida = ServicoLocacao.calcularEntrega(horas);
        expect(horaRecebida).toEqual(horaEsperada);
    });
});