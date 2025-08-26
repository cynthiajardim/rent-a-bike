import {describe, expect, it, beforeEach} from 'vitest'

import { ItemLocacao } from '../src/item/item-locacao.js'
import { Item } from '../src/item/item';

describe('Item locação', () => {

    it('calcula subtotal corretamente', async () => {
        const itemLocacao = new ItemLocacao(1, new Item(1,'','','','',1,'',true,''), 4, 0);
        itemLocacao.calcularSubtotal(3);
        expect(itemLocacao.subtotal).toBe(12);
    })
})