import { PAGE_CADASTRO_DEVOLUCAO, PAGE_CADASTRO_LOCACAO, PAGE_DEVOLUCOES, PAGE_LOCACOES, PAGE_RELATORIO_DEVOLUCAO, PAGE_RELATORIO_ITENS } from "../../infra/app";
import { cargos } from "./cargos-enum";

export class ServicoAutenticador{
    static verificarPermissao(cargo : string) : boolean{
        const url: URL = new URL(window.location.href);
        const pagina = url.pathname.replace("/app", "app");

        switch(pagina) {
            case PAGE_LOCACOES :
            case PAGE_DEVOLUCOES :
                return true;
            case PAGE_CADASTRO_DEVOLUCAO : 
            case PAGE_CADASTRO_LOCACAO :
                if(cargo != cargos.MECANICO)
                    return true;
                return false;
            case PAGE_RELATORIO_ITENS :
                if(cargo == cargos.ATENDENTE || cargo == cargos.GERENTE)
                    return true;
                return false;
            case PAGE_RELATORIO_DEVOLUCAO :
                if(cargo == cargos.GERENTE)
                    return true;
                return false;
            default : return false;
        }
    }
}