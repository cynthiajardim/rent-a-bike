<?php

class RepositorioFuncionarioEmBDR extends RepositorioGenericoEmBDR implements RepositorioFuncionario{
    public function __construct(PDO $pdo){
        parent::__construct($pdo);
    }

    /**
     * Adiciona funcionário ao banco
     * @param Funcionario $funcionario
     * @return void
     */
    public function adicionar(Funcionario $funcionario) : void{
        $comando = "INSERT INTO funcionario (nome) VALUES (:nome)";
        $this->executarComandoSql($comando, ["nome" => $funcionario->getNome()]);

        $funcionario->setId($this->ultimoIdAdicionado());
    }

    /**
     * Coleta funcionário com o ID
     * @param int $id
     * @return Funcionario
     * @throws DominioException
     */
    public function coletarComId(int $id) : Funcionario {
        $comando = "SELECT id, nome FROM funcionario WHERE id = :id";
        $ps = $this->executarComandoSql($comando, ["id" => $id]);

        if($ps->rowCount() == 0)
            throw DominioException::com(['Funcionário não encontrado.']);

        $dadosFuncionario = $ps->fetch(PDO::FETCH_ASSOC);
        return new Funcionario($dadosFuncionario['id'], $dadosFuncionario['nome']);
    }

    /**
     * Coleta todos os funcionários
     * @return Funcionario[]
     */
    public function coletarTodos() : array {
        $comando = "SELECT id, nome FROM funcionario";
        $ps = $this->executarComandoSql($comando, []);
        
        $dadosFuncionarios = $ps->fetchAll(PDO::FETCH_ASSOC);
        $funcionarios = [];
        foreach($dadosFuncionarios as $funcionario){
            $func = new Funcionario($funcionario['id'], $funcionario['nome']);
            $funcionarios[] = $func;
        }

        return $funcionarios;
    }

    public function coletarComCpf(string $cpf): Funcionario{
        try{
            $comando = "SELECT * from funcionario WHERE cpf = :cpf";
            $ps = $this->executarComandoSql($comando, ["cpf" => $cpf]);
            
            $dadosFuncionario = $ps->fetch(PDO::FETCH_ASSOC);
            if($dadosFuncionario == null){
                throw new DominioException("Nenhum funcionário encontrado com esse CPF");
            }
            return new Funcionario($dadosFuncionario['id'], $dadosFuncionario['nome'], $dadosFuncionario['senha'], $dadosFuncionario['cpf'], $dadosFuncionario['sal'], $dadosFuncionario['cargo']);
        }catch(PDOException $pdo){
            throw new RepositorioException("Erro ao consultar funcionário.");
        }
    }
}