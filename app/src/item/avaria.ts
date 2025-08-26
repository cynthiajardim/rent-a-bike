import { Item } from "./item.ts";

export class Avaria {
    constructor(
        public readonly id : number | null,
        public readonly descricao : string,
        public readonly item : Item,
        public readonly dataHora : Date,
        public readonly funcionario : number,
        public readonly valor : number,
        public readonly imagem : File | null
    ){}

    validar() : string[]{
        const tiposImgPermitidos = ["image/jpg", "image/jpeg"];
        const problemas : string[] = [];

        if(!(this.imagem instanceof File))
            problemas.push("Imagem da avaria deve ser enviada.");

        if(this.imagem instanceof File && !tiposImgPermitidos.includes(this.imagem.type))
            problemas.push("Imagem deve ser dos tipos: "+tiposImgPermitidos.join(','));

        if(this.valor < 0)
            problemas.push("Valor da avaria deve ser maior do que zero.");

        if(this.valor > this.item.valorPorHora)
            problemas.push("Valor da avaria não deve ser maior do que o valor de um item novo.");

        return problemas;
    }
}