import { LeitorDeCredencial } from "./leitor-de-credencial";

export class Cookie implements LeitorDeCredencial{
    obter(nome: string): string | null {
        const value = document.cookie
            .split('; ')
            .find(row => row.startsWith(nome + '='));
        return value ? decodeURIComponent(value.split('=')[1]) : null;
    }


}