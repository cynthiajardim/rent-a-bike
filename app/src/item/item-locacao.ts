import { ErrorDominio } from "../../infra/ErrorDominio.js";
import { Item } from "./item.js";

export class ItemLocacao{

    public constructor(
        public readonly id : number,
        public readonly item : Item,
        public readonly precoLocacao : number,
        public subtotal : number,
        public precisaLimpeza : boolean = false
    ){}

    validar() : string[] {
        const problemas: string[] = [];

        if(this.id == null || this.id <= 0){
            problemas.push("O item de locação deve ter um ID maior que 0.");
        }
        if(this.precoLocacao <= 0.0){
            problemas.push("O preço da locação deve ser maior que 0.0 .");
        }
        if(this.subtotal <= 0.0){
            problemas.push("O subtotal deve ser maior que 0.0 .");
        }
        return problemas;
    }

    calcularSubtotal(horas:number){
        if(horas < 0)
            throw ErrorDominio.comProblemas(["Horas devem ser maior do que 0."]);

        this.subtotal = this.precoLocacao * horas;
    }
}