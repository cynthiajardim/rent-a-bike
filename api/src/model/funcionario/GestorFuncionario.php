<?php
CONST USUARIO_NAO_ENCONTRADO = "Funcionário não encontrado.";
CONST SENHA_INCORRETA = "CPF ou senha incorretos.";

class GestorFuncionario {
    private Hashador $hashador;

    public function __construct(private RepositorioFuncionario $repositorioFuncionario, private Autenticador $autenticador){
        $this->hashador = new Hashador();
        $this->autenticador->abrirSessao();
    }

    /**
     * Coleta todos os funcionários
     * @return array<Funcionario>
     * @throws Exception
     */
    public function coletarFuncionarios() : array {
        try{
            $this->autenticador->verificarSeUsuarioEstaLogado();
            $funcionarios = $this->repositorioFuncionario->coletarTodos();

            return $funcionarios;
        }catch(Exception $e){
            throw $e;
        }
    }

    /**
     * Logar um usuário.
     * @param array<string,string> $dados
     * @return Funcionario
     */
    public function logar(array $dados): Funcionario {
        $cpf = htmlspecialchars($dados["cpf"]);
        $senha = htmlspecialchars($dados["senha"]);

        try{
            $funcionario = $this->repositorioFuncionario->coletarComCpf($cpf);
            $senhaHashada = $this->hashador->criarSenha($senha, $funcionario->getSal());
            if($senhaHashada != $funcionario->getSenha()){
                throw new DominioException(SENHA_INCORRETA);
            }
            return $funcionario;
        }catch(Exception $e){
            throw $e;
        }

    }
}