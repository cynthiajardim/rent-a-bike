<?php
use Slim\Psr7\UploadedFile as UploadedFile;
require_once __DIR__.'/../../infra/util/validarId.php';
require_once __DIR__.'/../../infra/util/validarImagem.php';

class Avaria implements JsonSerializable{
    private const TIPOS_PERMITIDOS_IMAGEM = ['image/jpeg', 'image/jpg'];

    
    public function __construct(private int|string $id, private DateTime $lancamento, private Funcionario $avaliador, private string $descricao, private UploadedFile|null $foto, private float $valor, private Item $item){}

    public function getId(): int|string {
        return $this->id;
    }

    public function getLancamento(): DateTime {
        return $this->lancamento;
    }

    public function getAvaliador(): Funcionario {
        return $this->avaliador;
    }

    public function getDescricao(): string {
        return $this->descricao;
    }

    public function getFoto(): UploadedFile | null {
        return $this->foto;
    }

    public function getValor(): float {
        return $this->valor;
    }

    public function getItem(): Item{
        return $this->item;
    }

    public function setId(int|string $id): void {
        $this->id = $id;
    }

    public function setLancamento(DateTime $lancamento): void {
        $this->lancamento = $lancamento;
    }

    public function setAvaliador(Funcionario $avaliador): void {
        $this->avaliador = $avaliador;
    }

    public function setDescricao(string $descricao): void {
        $this->descricao = $descricao;
    }

    public function setFoto(UploadedFile | null $foto): void {
        $this->foto = $foto;
    }

    public function setValor(float $valor): void {
        $this->valor = $valor;
    }

    public function setItem(Item $item): void{
        $this->item = $item;
    }


    /**
     * Valida dados da avaria
     * @return array<string>
     */
    public function validar(): array{
        $problemas = [];
        
        $problemasId = validarId($this->id);
        if(count($problemasId) > 0){
            $problemas = $problemasId;
        }

        if($this->valor < 0){
            $problemas[] = "O valor deve ser um número maior do que 0.";
        }

        if($this->valor > $this->item->getValorPorHora()){
            $problemas[] = "Valor da avaria não deve ser maior do que o valor de um item novo.";
        }   
        
        if($this->foto instanceof UploadedFile && !validarTipoImagemPermitido($this->foto, self::TIPOS_PERMITIDOS_IMAGEM)){
            $problemas[] = "Tipo imagem inválida. Imagem deve ser do tipo " . implode(', ', self::TIPOS_PERMITIDOS_IMAGEM);
        }

        return $problemas;
    }

    /**
      * Serializa em JSON para manuseio da API
      * @return array{lancamento: string, id: int|string, avaliador: Funcionario, descricao: string, foto: UploadedFile | null, valor: float, item: Item}
      */
    public function jsonSerialize(): mixed {
        return [
            'id'           => $this->id,
            'lancamento'   => $this->lancamento->format('Y-m-d H:i:s'),
            'avaliador'    => $this->avaliador,
            'descricao'    => $this->descricao,
            'foto'         => $this->foto,
            'valor'        => $this->valor,
            'item'         => $this->item
        ];
    }
}