export interface VisaoAutenticador{
    redirecionarPara(url : string);
    mostrarNome(nome: string): void;
    criarOHeader() : void;
}