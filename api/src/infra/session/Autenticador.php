<?php

class Autenticador{
    private GerenteDeSessao $gerenteSessao;
    
    public function __construct(GerenteDeSessao $gerenteSessao){
        $this->gerenteSessao = $gerenteSessao;
    }

    /**
     * Método que autentica um usúario pelo JSON enviado.
     * @param PDO $pdo
     * @param string $json
     * @return void
     */
    public function autenticarFuncionario(PDO $pdo, string $json): void{
        $gestorFuncionario = criarGestorDeFuncionario($pdo, $this);
    
        $funcionario = $gestorFuncionario->logar(json_decode($json, true));
        $this->gerenteSessao->setFuncionario($funcionario);
    }

    public function abrirSessao(): void{
        $this->gerenteSessao->abrirSessao();
    }

    public function fecharSessao(): void{
        try{
            $this->verificarSeUsuarioEstaLogado();
            $this->gerenteSessao->fecharSessao();
        }catch(DominioException $e){
            throw $e;
        }
    }

    /**
     * Verifica se tem um usuário logado.
     * @return void
     */
    public function verificarSeUsuarioEstaLogado(): void{
        try{
            $this->gerenteSessao->verificarSeUsuarioEstaLogado();
        }catch(DominioException $e){
            throw $e;
        }
    }

    /**
     * Retorna o funcionário logado no sistema no momento 
     * @return Funcionario
     */
    public function obterFuncionarioLogado() : Funcionario {
        return $this->gerenteSessao->retornarFuncionario();
    }

    /**
     * Verificar se usuário tem permissão para acessar o conteúdo pretendido
     * @param AutorizadorAcoes $acao
     * @return void
     */
    public function verificarPermissao(AutorizadorAcoes $acao){
        $cargoFuncionario = ($this->obterFuncionarioLogado())->getCargo();
        
        if(!AutorizadorAcoes::podeRealizarAcao($cargoFuncionario, $acao->toString())){
            throw new DominioException("Você não possui permissão para acessar o conteúdo.");
        }
    }
}