import { Currencies, Money } from "ts-money";
import { ItemLocacao } from "../item/item-locacao";
import { Avaria } from "../item/avaria";

export class ServicoDevolucao{
    static calcularValores(subtotais : number [], horasCorridas : number, itensLocacao : ItemLocacao[]) : {valorTotal, desconto, valorFinal, valorTaxaLimpeza}{
        const valorTotal = this.calcularValorTotal(subtotais);
        const desconto = this.calcularDesconto(valorTotal, horasCorridas);
        const valorTaxaLimpeza = this.calcularTaxaDeLimpeza(itensLocacao);
        const valorFinal = this.calcularValorFinal(valorTotal, desconto, valorTaxaLimpeza);

        return {valorTotal, desconto, valorFinal, valorTaxaLimpeza};
    }

    private static calcularValorTotal(subtotais : number []) : Money{
        console.log(subtotais);
        let valorTotal = new Money(0, Currencies.BRL)
        for(const subtotal of subtotais){
            valorTotal = valorTotal.add(new Money(subtotal * 100, Currencies.BRL));
        }
        return valorTotal;
    }

    private static calcularDesconto(valorTotal : Money, horasCorridas : number) : Money{
        if(horasCorridas > 2){
            const desconto = Math.round(valorTotal.amount * 0.1);
            return new Money(desconto, Currencies.BRL);
        }
        return new Money(0, Currencies.BRL);
    }

    private static calcularValorFinal(valorTotal : Money , desconto : Money, taxaLimpeza : Money) :Money{
        return valorTotal.subtract(desconto).add(taxaLimpeza);
    }

    private static calcularTaxaDeLimpeza(itensLocacao : ItemLocacao[]) : Money{
        let taxa = new Money(0, Currencies.BRL);
        for(const il of itensLocacao){
            const precoLocacao = Money.fromDecimal(il.precoLocacao, Currencies.BRL);
            const precoLocacaoPorcentagem = precoLocacao.multiply(0.10);

            taxa = taxa.add(precoLocacaoPorcentagem);
        }

        return taxa;
    }

    public static calcularMulta(itensLocacao : ItemLocacao[], avariasDevolucao : Avaria[]) : Money{
        let multa = new Money(0, Currencies.BRL)
        for(const il of itensLocacao){
            for(const a of avariasDevolucao){
                if(a.item.id == il.item.id){      
                    const valorAvaria = Money.fromDecimal(a.valor, Currencies.BRL);

                    multa = multa.add(valorAvaria);
                }
            }
        }

        return multa;
    }

    public static gerarIdParaAvaria(avarias : Avaria[]){
        if(avarias.length == 0)
            return 0;

        let ultimaAvariaRegistrada = avarias[avarias.length - 1];
        return (ultimaAvariaRegistrada!.id + 1);
    }
}