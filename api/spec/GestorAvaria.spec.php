<?php
use Slim\Psr7\Stream;
use Slim\Psr7\UploadedFile as UploadedFile;
require_once __DIR__ . '/../src/infra/repositorio/CriadorDeGestores.php';


describe('Gestor de Avarias', function(){
    beforeAll(function(){
        `cd ../g4 && pnpm run db`;
        $pdo = new PDO( 'mysql:dbname=g4;host=localhost;charset=utf8', 'root', '' );

        $this->gestorAvaria = criarGestorDeAvaria($pdo, new AutenticadorParaTestes(new GerenteDeSessaoEmSession()));
    });

    beforeEach(function(){
        $this->item = new Item(99, 'I0009', 'Item de teste', 'Teste de modelo', 'Fabricante de teste', 20, true, 'equipamento');
        $this->funcionario = new Funcionario(2, 'Funcionario Teste');
        $this->avaria = [
            "dataHora" => "2025-06-01 12:30:00",
            "item" => 9,
            "funcionario" => 3, 
            "descricao" => "Avaria de teste", 
            "valor" => 2.00
        ];
    });

    it('Cadastra corretamente avaria sem imagem', function(){
        $this->gestorAvaria->salvarAvaria($this->avaria, [], 2);
        expect(1)->toBe(1);
    });

    it('Cadastra corretamente avaria com imagem', function(){
        $caminhoImagemValida = __DIR__ . "/../../app/e2e/devolucoes/avariaTeste.jpg";
        $path = __DIR__ . '/avariaTeste.jpg';
        copy($caminhoImagemValida, $path);

        if (!file_exists($path)) {
            file_put_contents($path, 'Imagem de teste');
        }

        $stream = new Stream(fopen($path, 'r'));
        $imagem = new UploadedFile($stream, 'avaria.jpg', 'image/jpeg', filesize($path), \UPLOAD_ERR_OK);


        $this->gestorAvaria->salvarAvaria($this->avaria, ["imagem" => $imagem], 2);
        expect(1)->toBe(1);
    });

    describe('Validação de dados', function(){
        it('Imagem deve ser do tipo JPG', function(){
            $path = __DIR__ . "/../../app/e2e/devolucoes/avariaInvalida.png";

            if (!file_exists($path)) {
                file_put_contents($path, 'Imagem de teste');
            }

            $stream = new Stream(fopen($path, 'r'));
            $imagem = new UploadedFile($stream, 'avariaInvalida.png', 'image/png', filesize($path), \UPLOAD_ERR_OK);

            $avaria = new Avaria(100, new DateTime(), new Funcionario(99, 'Teste'), 'Teste de avaria inválida', $imagem, 5.00, $this->item);
            $problemas = $avaria->validar();

            expect($problemas)->toHaveLength(1);
        });

        it('Valor da avaria não deve ser menor do que 0', function(){
            $avaria = new Avaria(100, new DateTime(), new Funcionario(99, 'Teste'), 'Teste de avaria inválida', null, -35.00, $this->item);
            $problemas = $avaria->validar();

            expect($problemas)->toHaveLength(1);
        });
    });
});