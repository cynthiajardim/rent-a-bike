import { API } from '../../infra/api'
import { ServicoAutenticador } from "./servico-autenticador";
import { ErrorNaoAutorizado } from "../../infra/ErrorNaoAutorizado";
import { ErrorForbidden } from "../../infra/ErrorForbidden";
import { LeitorDeCredencial } from "./leitor-de-credencial";
import { cargos } from './cargos-enum';

export class GestorAutenticador{

    constructor(private leitorDeCredencial : LeitorDeCredencial){
    }

    coletarUsuario(): string | null{
        const nome : string | null = this.leitorDeCredencial.obter('user_name');
        if(nome == '' || nome == null){
            throw new ErrorNaoAutorizado();
        }

        return nome;
    }

    coletarCargo() : string{
        const cargoFuncionario = this.leitorDeCredencial.obter('cargo');
        if(cargoFuncionario == null){
            throw new ErrorNaoAutorizado();
        }
        return cargoFuncionario;
    }

    verificarSePodeCadastrarAvaria() : boolean{
        try{
            const cargo = this.coletarCargo();
            if(cargo !== cargos.GERENTE){
                return false;
            }
            return true;
        }catch(error){
            throw error;
        }
    }

    verificarPermissaoDeAcesso() {
        try{
            const cargoFuncionario = this.coletarCargo();
    
            if(!ServicoAutenticador.verificarPermissao(cargoFuncionario!)){
                throw new ErrorForbidden();
            }
        }catch(error){
            throw error;
        }
    }

    async deslogar(): Promise<void>{
        const response = await fetch(API + 'logout', { method: 'POST' , credentials : 'include'});
    }
}