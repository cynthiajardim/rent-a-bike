<?php
require_once __DIR__.'/../../infra/util/validarId.php';

class Cliente implements \JsonSerializable{
    private int|string $id;
    private string $codigo;
    private string $cpf;
    private string $nome;
	private string $telefone;
	private string $email;
	private string $endereco;
	private DateTime $dataNascimento;

    private string $foto;
	private const MIN_NOME = 2;
    private const MAX_NOME = 100;
    private const MSG_NOME = "O nome deve ter entre ".self::MIN_NOME." e ".self::MAX_NOME." caracteres.";

	private const TAM_CPF = 11;
	private const MSG_CPF = "O cpf deve ter ".self::TAM_CPF . " caracteres sem caracteres especiais.";
	private const TAM_CODIGO = 8;
	private const MSG_CODIGO = "O código deve ter ".self::TAM_CODIGO." caracteres.";

    public function __construct(int|string $id, string $codigo, string $cpf, string $nome, string $foto, string $telefone){
		$this->id = $id;
		$this->codigo = $codigo;
		$this->cpf = $cpf;
		$this->nome = $nome;
		$this->telefone = $telefone;
		$this->foto = $foto;
	}

	public function getId(): int|string {
		return $this->id;
	}

	public function setId(int|string $id): void {
		$this->id = $id;
	}

	public function getCodigo(): string {
		return $this->codigo;
	}

	public function setCodigo(string $codigo): void {
		$this->codigo = $codigo;
	}

	public function getCpf(): string {
		return $this->cpf;
	}

	public function setCpf(string $cpf): void {
		$this->cpf = $cpf;
	}

	public function getNome(): string {
		return $this->nome;
	}

	public function setNome(string $nome): void {
		$this->nome = $nome;
	}

	public function getFoto(): string {
		return $this->foto;
	}

	public function setFoto(string $foto): void {
		$this->foto = $foto;
	}

	public function setEmail(string $email): void {
		$this->email = $email;
	}

	public function getEmail(): string {
		return $this->email;
	}

	public function setTelefone(string $telefone): void {
		$this->telefone = $telefone;
	}

	public function getTelefone(bool $formatado = false): string {
		if($formatado){
			$telFormatado = '';
			if(mb_strlen($this->telefone) == 9){
				$telFormatado = substr($this->telefone, 0, 5) . "-" . substr($this->telefone, 5, 4);
			} else if(mb_strlen($this->telefone) == 11){
				$ddd = "(" . substr($this->telefone, 0, 2) . ")";
				$telefone = substr($this->telefone, 2, 5) . "-" . substr($this->telefone, 7, 4);
				$telFormatado = $ddd.$telefone;
			}

			return $telFormatado;
		}

		return $this->telefone;
	}

	public function setDataNascimento(DateTime $dataNascimento): void {
		$this->dataNascimento = $dataNascimento;
	}

	public function getDataNascimento(): DateTime {
		return $this->dataNascimento;
	}

	public function setEndereco(string $endereco): void {
		$this->endereco = $endereco;
	}

	public function getEndereco(): string {
		return $this->endereco;
	}

	/**
	 * Valida dados do cliente
	 * @return array<string>
	 */
	public function validar(): array{
		$problemas = [];
		$problemas = validarId($this->id);
		$tamNome = mb_strlen($this->nome);
		$tamCpf = mb_strlen($this->cpf);
		$tamCodigo = mb_strlen($this->codigo);

		if($tamNome < self::MIN_NOME || $tamNome > self::MAX_NOME){
			array_push($problemas, self::MSG_NOME);
		}
		if($tamCpf != self::TAM_CPF){
			array_push($problemas, self::MSG_CPF);
		}
		if($tamCodigo != self::TAM_CODIGO){
			array_push($problemas, self::MSG_CODIGO);
		}
		return $problemas;
	}

	/**
	 * Serializa em JSON para manuseio da API
	 * @return array{codigo: string, cpf: string, foto: mixed, id: int|string, nome: string}
	 */
	public function jsonSerialize(): mixed {
        return [
            'id' 		=> $this->id,
            'codigo' 	=> $this->codigo,
            'cpf' 		=> $this->cpf,
            'nome' 		=> $this->nome,
            'foto' 		=> $this->foto,
			'telefone' 	=> $this->getTelefone(true)
        ];
    }
}