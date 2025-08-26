<?php
use Slim\Psr7\UploadedFile as UploadedFile;
class GestorAvaria{

    public function __construct(private RepositorioAvaria $repositorioAvaria, private RepositorioItem $repositorioItem, private RepositorioFuncionario $repositorioFuncionario, private Autenticador $autenticador){
        $this->autenticador->abrirSessao();
    }

    /** Salva mais de uma avaria por vez 
     * @param array<int,array{
     *          dataHora:string,
     *          item:string,
     *          funcionario:string,
     *          descricao:string,
     *          valor:string
     * }> $dadosAvarias
     * @param array<string|int,array<string,UploadedFile>> $imagens
     * @param string|int $idDevolucao
    */
    public function salvarAvarias(array $dadosAvarias, array $imagens, string|int $idDevolucao) : void {
        try{
            $this->autenticador->verificarSeUsuarioEstaLogado();
            $this->autenticador->verificarPermissao(AutorizadorAcoes::CADASTRAR_AVARIA);
            foreach($dadosAvarias as $key => $dadosAvaria){
                $imagem = $imagens[$key];
                $this->salvarAvaria($dadosAvaria, $imagem, $idDevolucao);
            }
        }catch(Exception $e){
            throw $e;
        }
    }

    /**
     * Salva uma avaria
     * @param array{
     *          dataHora:string,
     *          item:string,
     *          funcionario:string,
     *          descricao:string,
     *          valor:string
     * } $dados
     * @param array<string,UploadedFile> $imagem
     * @return void
     */
    public function salvarAvaria($dados, array $imagem, string|int $idDevolucao): void{
        $lancamentoString = htmlspecialchars((string)$dados["dataHora"]);
        $itemId = htmlspecialchars((string)$dados["item"]);
        $funcionarioId = htmlspecialchars((string)$dados['funcionario']);
        $descricao =  htmlspecialchars((string)$dados['descricao']);
        $valor = htmlspecialchars((string)$dados['valor']);
        $foto = !empty($imagem) ? $imagem['imagem'] : null;
        
        try{
            $this->autenticador->verificarSeUsuarioEstaLogado();
            $this->autenticador->verificarPermissao(AutorizadorAcoes::CADASTRAR_AVARIA);
            //$this->transacao->iniciar();
            $funcionario = $this->repositorioFuncionario->coletarComId(intval($funcionarioId));
            if($funcionario == null){
                throw new DominioException("Funcionário não encontrado com id " . $funcionarioId);
            }
            $item = $this->repositorioItem->coletarComId(intval($itemId));
            if($item == null){
                throw new DominioException("Item não encontrado com id " . $itemId);
            }
    
            $avaria = $this->instanciarAvaria($funcionario, $item, $lancamentoString, $descricao, $foto, $valor);

            $this->repositorioAvaria->adicionar($avaria, $idDevolucao);
            $this->salvarImagem($avaria);

            //$this->transacao->finalizar();
        } catch(Exception $e){
            //$this->transacao->desfazer();
            throw $e;
        }
    }

    /**
     * Salva imagem da avaria no servidor
     * @param Avaria $avaria
     * @return void
     */
    private function salvarImagem(Avaria $avaria) : void{
        if($avaria->getFoto() instanceof UploadedFile){
            try{
                $this->autenticador->verificarSeUsuarioEstaLogado();

                $caminhoDestino = __DIR__ . "/fotos/";
                $caminhoDestinoRelativo = str_replace('\\', '/', str_replace($_SERVER['DOCUMENT_ROOT'], '', $caminhoDestino));

                $extensao = pathinfo($avaria->getFoto()->getClientFilename(), PATHINFO_EXTENSION);

                if(!is_dir($caminhoDestino))
                    mkdir($caminhoDestino);

                $nomeImagem = $avaria->getId() . "." . $extensao;
                $avaria->getFoto()->moveTo($caminhoDestino . $nomeImagem);

                $this->repositorioAvaria->salvarCaminhoImagem($caminhoDestinoRelativo . $nomeImagem, $avaria->getId());
            } catch (Exception $e){
                throw new DominioException("Erro ao salvar imagem da avaria.");
            }
        }
    }

    /**
     * Coleta todas as avarias
     * @return array<Avaria>
     */
    public function coletarAvarias():array{
        try{
            $this->autenticador->verificarSeUsuarioEstaLogado();
            return $this->repositorioAvaria->coletarTodos();
        }catch(Exception $e){
            throw $e;
        }
    }

    /**
     * Instaciar avaria.
     * @throws DominioException
     * @param Funcionario $funcionario
     * @param Item $item
     * @param string $lancamentoString
     * @param string $descricao
     * @param UploadedFile|null $foto
     * @param string $valor
     * @return Avaria
     */
    private function instanciarAvaria(Funcionario $funcionario, Item $item, string $lancamentoString, string $descricao, UploadedFile|null $foto, string $valor): Avaria{
        $lancamento = $this->transformarData($lancamentoString);
        $avaria = new Avaria("1", $lancamento, $funcionario, $descricao, $foto, (float) $valor, $item);
        
        $problemas = $avaria->validar();
        if(!empty($problemas)){
            throw new DominioException(implode('\n', $problemas));
        }
        return $avaria;
    }

    /**
     * Transforma data em string para DateTime
     * @param string $data
     * @return DateTime
     */
    private function transformarData(string $data): DateTime{
        $dataDevolucao = new DateTime($data);
        $dataDevolucao->setTimezone(new DateTimeZone('America/Sao_Paulo'));
        //error_log('ALOOO'.$dataDevolucao->format('Y-m-d H:i:s'));
        $dataFormatada = $dataDevolucao->format('Y-m-d H:i:s');
        return new DateTime($dataFormatada);
    }

}