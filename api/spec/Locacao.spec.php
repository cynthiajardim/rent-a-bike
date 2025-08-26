<?php

describe('Locações', function(){
    beforeAll(function(){
        `cd ../g4 && pnpm run db`;
    });
    
    describe('validação de dados', function(){
        beforeEach(function(){
            $this->item = new Item(2, 'I0000009', 'Item de teste', 'Modelo de teste', 'Fabricante', 20.00, '', true, 'Equipamento');
            $this->itemLocacao = new ItemLocacao(6, $this->item, 20.00);
            $this->cliente = new Cliente(2, 'C00000010', '98765432100', 'Maria da Silva', '', '22999887766');
            $this->funcionario = new Funcionario(2, 'Fulano de Tal');
        });

        it('data de entrada não deve ser maior do que a data atual', function(){
            $dataEntrada = new DateTime('2025-09-24 14:23:06'); //data maior do que a data atual
            $locacao = new Locacao(1, [$this->itemLocacao], $this->cliente, $this->funcionario, $dataEntrada, 1);

            $problemas = $locacao->validar();
            expect($problemas)->toHaveLength(1);
        });

        it('valores não devem ser negativos', function(){
            $locacao = new Locacao(1, [$this->itemLocacao], $this->cliente, $this->funcionario, new DateTime(), 1);
            $locacao->setDesconto(-1.00);
            $locacao->setValorTotal(-10.00);

            $problemas = $locacao->validar();
            expect($problemas)->toHaveLength(2);
        }); 

        it('numero de horas não deve ser zero ou negativo', function(){
            $locacao = new Locacao(1, [$this->itemLocacao], $this->cliente, $this->funcionario, new DateTime(), 0);

            $problemas = $locacao->validar();
            expect($problemas)->toHaveLength(1);
        });

        it('previsão de entrega não deve ser menor do que a data atual', function(){
            $locacao = new Locacao(1, [$this->itemLocacao], $this->cliente, $this->funcionario, new DateTime(), 1);
            $locacao->setPrevisaoDeEntrega(new DateTime("2025-01-13 13:15:00"));

            $problemas = $locacao->validar();
            expect($problemas)->toHaveLength(1);
        });
    });

    describe('calculo de valores', function(){
        beforeAll(function(){
            $numeroDeHoras = 3;

            $this->item = new Item(2, 'I0000009', 'Item de teste', 'Modelo de teste', 'Fabricante', 20.00, '', true, 'Equipamento');
            $this->itemLocacao = new ItemLocacao(6, $this->item, 20.00);
            $this->itemLocacao->calculaSubtotal($numeroDeHoras);
            $this->cliente = new Cliente(2, 'C00000010', '98765432100', 'Maria da Silva', '', '11988776655');
            $this->funcionario = new Funcionario(2, 'Fulano de Tal');
            
            $this->locacao = new Locacao(1, [$this->itemLocacao], $this->cliente, $this->funcionario, new DateTime(), $numeroDeHoras);
        });

        it('calcula valor total corretamente', function(){
            $valorTotalEsperado = 60.00;
            $valorCalculado = $this->locacao->calculaValorTotal();

            expect($valorCalculado)->toBeCloseTo($valorTotalEsperado);
        });

        it('calcula desconto corretamente', function(){
            $descontoEsperado = 6.0;
            $descontoCalculado = $this->locacao->calculaDesconto();

            expect($descontoCalculado)->toBeCloseTo($descontoEsperado);
        });

        it('calcula a previsao de entrega corretamente', function(){
            $dataEntrada = new DateTime('2025-05-25 10:30:00');
            $dataEntregaEsperada = new DateTime('2025-05-25 13:30:00');

            $this->locacao->setEntrada($dataEntrada);
            $dataEntregaCalculada = $this->locacao->calculaEntrega();

            expect($dataEntregaCalculada->format('Y-m-d H:i:s'))->toBe($dataEntregaEsperada->format('Y-m-d H:i:s'));
        });
    });
});