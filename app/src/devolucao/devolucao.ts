import { Avaria } from "../item/avaria";

export class Devolucao {

    public constructor(
        public readonly id : number,
        private dataDeDevolucao : Date | undefined,
        public readonly valorPago : number,
        public readonly locacao : string | undefined | number,
        public readonly funcionario : number | null,
        public readonly avariasItens : Avaria[] | [],
        public readonly itensParaLimpeza : number []
    ){       
    }

    setDataDeDevolucao(date : Date){
        this.dataDeDevolucao = date;
    }
    validar() : string[]{
        const problemas: string[] = [];
        if(this.id == null || this.id <= 0){
            problemas.push("O id deve ser um número maior que 0");
        }
        if(this.locacao == undefined){
            problemas.push("Uma locação deve ser informada.");
        }
        if(this.dataDeDevolucao == undefined){
            problemas.push("Uma data de devolução deve ser informada.");
        }else if (this.dataDeDevolucao > new Date()) {
            problemas.push("A data de devolução deve ser menor ou igual a atual.");
        }
        if(this.valorPago <= 0.0){
            problemas.push("O valor pago deve ser maior que 0.0");
        }

        return problemas
    }

    converterParaFormData() : FormData{
        const dado = new FormData();

        dado.append("id", this.id.toString());
        dado.append("locacao", this.locacao ? this.locacao.toString() : '');
        dado.append("valorPago", Number(this.valorPago).toFixed(2));
        dado.append("dataDeDevolucao", this.dataDeDevolucao ? this.dataDeDevolucao.toISOString() : '');

        this.itensParaLimpeza.forEach((idItem, index) => {
            dado.append(`itensParaLimpeza[${index}]`, idItem.toString());
        });

        this.avariasItens.forEach((avaria, index) => {
            dado.append(`avariasItens[${index}][descricao]`, avaria.descricao);
            dado.append(`avariasItens[${index}][funcionario]`, avaria.funcionario.toString());
            dado.append(`avariasItens[${index}][id]`, avaria.id ? avaria.id.toString() : '');
            dado.append(`avariasItens[${index}][item]`, avaria.item.id!.toString());
            dado.append(`avariasItens[${index}][valor]`, Number(avaria.valor).toFixed(2));
            dado.append(`avariasItens[${index}][dataHora]`, avaria.dataHora.toISOString());

            if (avaria.imagem instanceof File)
                dado.append(`avariasItens[${index}][imagem]`, avaria.imagem);
        });

        return dado;
    }
}