import {ValidadorDeLogin} from './ValidadorDeLogin'
import { ErrorDominio } from "../../infra/ErrorDominio";
import { API } from '../../infra/api'


export class GestorLogin{

    async logar(login : string, senha : string){
        try{
            const validador : ValidadorDeLogin = this.instanciarValidador(login, senha);

            const response = await fetch(API + "login", {
                    method:"POST",
                    headers:{"Content-Type":"application/json"},
                    body:JSON.stringify(validador),
                    credentials: 'include'
                })
    
            const respostaJson = await response.json();
    
            if(!response.ok || !respostaJson.success){
                throw ErrorDominio.comProblemas([respostaJson.message]);
            }
    
            location.href = "http://localhost:5173/app/pages/listagem-locacoes.html";
        }catch(error){
            throw error;
        }

    }

    private instanciarValidador(login : string, senha : string) : ValidadorDeLogin{
        const validador = new ValidadorDeLogin(login, senha);
        const problemas = validador.validar();
        if(problemas.length > 0){
            throw ErrorDominio.comProblemas(problemas);
        }

        return validador;
    }
}