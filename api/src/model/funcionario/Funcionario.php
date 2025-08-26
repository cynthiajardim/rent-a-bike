<?php

class Funcionario implements \JsonSerializable{
    const TAM_MAX_NOME = 100;
    const TAM_MIN_NOME = 2;
    const TAM_CPF = 11;
	const MSG_CPF = "O cpf deve ter ".self::TAM_CPF . " caracteres sem caracteres especiais.";

    private int $id;
    private string $nome;
    private string $senha;
    private string $cpf;
    private string $sal;
    private string $cargo;

    public function __construct(int|null $id, string $nome, string $senha ='', string $cpf = '', string $sal = '', string $cargo = ''){
        $this->id = $id;
        $this->nome = $nome;
        $this->senha = $senha;
        $this->cpf = $cpf;
        $this->sal = $sal;
        $this->cargo = $cargo;
    }

    public function setId(int $id): void{
        $this->id = $id;
    }

    public function getId(): int{
        return $this->id;
    }

    public function setCargo(string $cargo): void{
        $this->cargo = $cargo;
    }

    public function getCargo(): string{
        return $this->cargo;
    }

    public function setSal(string $sal): void{
        $this->sal = $sal;
    }

    public function getSal(): string{
        return $this->sal;
    }

    public function setSenha(string $senha): void{
        $this->senha = $senha;
    }

    public function getSenha(): string{
        return $this->senha;
    }

    public function setCpf(string $cpf): void{
        $this->cpf = $cpf;
    }

    public function getCpf(): string{
        return $this->cpf;
    }

    public function setNome(string $nome): void{
        $this->nome = $nome;
    }

    public function getNome(): string{
        return $this->nome;
    }

    /**
     * Valida dados de funcionário
     * @return string[]
     */
    public function validar() : array{
        $problemas = [];
		$tamCpf = mb_strlen($this->cpf);
        if(mb_strlen($this->nome) > self::TAM_MAX_NOME || mb_strlen($this->nome) < self::TAM_MIN_NOME){
            $problemas[] = "O tamanho do nome deve estar entre ". self::TAM_MAX_NOME ." e ".self::TAM_MIN_NOME;
        }

        if($tamCpf != self::TAM_CPF){
			array_push($problemas, self::MSG_CPF);
		}

        if(!EnumCargo::isValid($this->cargo)){
            $problemas[] = "Cargo inválido.";
        }

        return $problemas;
    }

    /**
     * Serializa objeto para JSON para manuseio da API
     * @return array{id: int, nome: string}
     */
    public function jsonSerialize(): mixed {
        return [
            'id' => $this->id,
            'nome' => $this->nome,
            'senha' => $this->senha,
            'cpf' => $this->cpf,
            'sal' => $this->sal,
            'cargo' => $this->cargo
        ];
    }
}