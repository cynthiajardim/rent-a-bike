import { Currencies, Money } from "ts-money";
import { ItemLocacao } from "../item/item-locacao";

const PORCENTAGEM_DESCONTO = 0.1;

export class ServicoLocacao{
    static calcularValores(itens, horas) {
        const total = this.calcularTotal(itens);
        const desconto = this.calcularDesconto(horas, total);
        const valorFinal = this.calcularValorFinal(total, desconto);
        
        const entrega = this.calcularEntrega(horas);

        return {
            valorTotal      : total,
            valorDesconto   : desconto,
            valorFinal      : valorFinal, 
            entrega         : entrega
        };
    }

    private static calcularTotal(itens:ItemLocacao[]) : Money {
        let total = 0;
        for(let item of itens){
            total += item.subtotal*100;
        }

        return new Money(total, Currencies.BRL);
    }

    private static calcularDesconto(horas:number, valorTotal:Money) : Money  {
        if(horas > 2){
            return valorTotal.multiply(PORCENTAGEM_DESCONTO); 
        }

        return new Money(0, Currencies.BRL);
    }

    private static calcularValorFinal(valorTotal:Money, desconto:Money) : Money{
        return valorTotal.subtract(desconto);
    }

    static calcularEntrega(horas:number) : Date {
        const entrega = new Date();
        entrega.setHours(entrega.getHours() + horas);

        return entrega;
    }
}