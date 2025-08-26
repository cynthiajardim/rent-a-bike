export class ValidadorDeLogin{
    public readonly cpf : string;
    public readonly senha : string;
    public readonly TAM_CPF = 11;

    constructor(cpf : string, senha : string){
        this.cpf = cpf;
        this.senha = senha;
    }

    validar() : string[]{
        const problemas : string[] = [];

        if(this.cpf.length !== this.TAM_CPF){
            problemas.push("O CPF deve conter " + this.TAM_CPF + " caracteres");
        }

        return problemas;
    }

}