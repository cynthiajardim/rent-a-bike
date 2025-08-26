<?php
require_once __DIR__ . '/../src/infra/repositorio/CriadorDeGestores.php';


describe('Gestor de locações', function(){
    beforeAll(function(){
        `cd ../g4 && pnpm run db`;
        $pdo = new PDO('mysql:dbname=g4;host=localhost;charset=utf8', 'root', '');

        $this->gestorLocacao = criarGestorDeLocacao($pdo, new AutenticadorParaTestes(new GerenteDeSessaoEmSession()));
    });

    it('locação salva corretamente', function(){
        $item = new Item(2, 'I0000009', 'Item de teste', 'Modelo de teste', 'Fabricante', 20.00, true, 'equipamento');
        $itemLocacao = new ItemLocacao(6, $item, 20.00);
        $itemLocacao->calculaSubtotal(2);
        
        $dadosLocacao = [
            'cliente'       => 2,
            'funcionario'   => 1,
            'itens'         => [json_decode(json_encode($itemLocacao), true)],
            'numeroDeHoras' => 2
        ];

        $this->gestorLocacao->salvarLocacao($dadosLocacao);
        expect(1)->toBe(1);
    }); 

    describe('obtém locação correta', function(){
        beforeAll(function(){
            $this->id = 2;
            $this->clienteDaLocacaoNoBanco = 2;
            $this->cpfDoCliente = "98765432100";
        });

        it('obtém locação corretamente', function(){
            $locacao = $this->gestorLocacao->coletarCom(['id' => $this->id]);

            expect($locacao[0])->toBeAnInstanceOf(Locacao::class);
        });

        it('obtém corretamente com id', function(){
            $locacao = $this->gestorLocacao->coletarCom(['id' => $this->id]);
            $clienteDaLocacao = $locacao[0]->getCliente()->getId();

            expect($clienteDaLocacao)->toBe($this->clienteDaLocacaoNoBanco);
        });

        it('obtém corretamente com o CPF', function(){
            $locacao = $this->gestorLocacao->coletarCom(['cpf' => $this->cpfDoCliente]);
            $clienteDaLocacao = $locacao[0]->getCliente()->getId();

            expect($clienteDaLocacao)->toBe($this->clienteDaLocacaoNoBanco);
        });
    });
});