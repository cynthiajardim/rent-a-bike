export interface VisaoLogin{
    coletarDados(): {login : string, senha : string};
    exibirMensagens(mensagens : string[] , erro : boolean);
}