<?php

describe("Devolução", function (){
    beforeAll(function(){
        `cd ../g4 && pnpm run db`;
    });
    
    beforeEach( function(){
        $this->devolucao = null;
        $this->funcionario = new Funcionario(2, 'Fulano de Tal');
        $item = new Item(1,'','','','', 2,'',true,'');
        $itensLocacao = [new ItemLocacao(1, $item, 20.35), new ItemLocacao(1, $item, 30.50)];
        $this->locacao = new Locacao(1, $itensLocacao , new Cliente(1,'','','', '',4), new Funcionario(1,''), new DateTime(), 4);
    });

    describe('Erros de validação', function (){
        it('Data de devolução superior a atual', function (){
            $this->devolucao = new Devolucao(1, $this->locacao, (new DateTime())->add(new DateInterval('PT3H')), $this->funcionario);
            $this->devolucao->setValorPago(1);
            $problemas = $this->devolucao->validar();
            expect($problemas)->toHaveLength(1);
        });

        it('Data de devolução inferior a data de entrada da locação', function(){
            $this->devolucao = new Devolucao(1, $this->locacao, (new DateTime())->sub(new DateInterval('PT3H')), $this->funcionario);
            $this->devolucao->setValorPago(1);
            $problemas = $this->devolucao->validar();
            expect($problemas)->toHaveLength(1);
        });

        it('Valor pago menor ou igual a 0', function (){
            $this->devolucao = new Devolucao(1, $this->locacao, new DateTime(), $this->funcionario);
            $this->devolucao->setValorPago(0);
            $problemas = $this->devolucao->validar();
            expect($problemas)->toHaveLength(1);
        });
    });


    describe('Cálculos', function(){

        it('Calcula horas corridas corretamente', function(){
            $this->devolucao = new Devolucao(1, $this->locacao, (new DateTime())->add(new DateInterval('PT3H')), $this->funcionario);
            $horas = $this->devolucao->calcularHorasCorridas();
            expect($horas)->toBe(3);
        });

        it("Calcula horas corridas dentro da tolerância", function(){
            $this->devolucao = new Devolucao(1, $this->locacao, (new DateTime())->add(new DateInterval('PT4H14M')), $this->funcionario);
            $horas = $this->devolucao->calcularHorasCorridas();
            expect($horas)->toBe(4);
        });

        it("Ao passar da tolerância aas horas devem ser arredondas pra cima", function(){
            $this->devolucao = new Devolucao(1, $this->locacao, (new DateTime())->add(new DateInterval('PT4H16M')), $this->funcionario);
            $horas = $this->devolucao->calcularHorasCorridas();
            expect($horas)->toBe(5);
        });

        it('Calcula desconto corretamente', function(){
            $this->devolucao = new Devolucao(1, $this->locacao, (new DateTime())->add(new DateInterval('PT3H')), $this->funcionario);
            $desconto = $this->devolucao->calculaDesconto(152.50, 4);
            expect($desconto)->toBeCloseTo(15.25);
        });

        it('Calcula valor a ser pago corretamente', function(){
            $this->devolucao = new Devolucao(1, $this->locacao, (new DateTime())->add(new DateInterval('PT3H')), $this->funcionario);
            $total = $this->devolucao->calcularValorASerPago([], []);
            expect($total)->toBeCloseTo(137.30, 1);
        });
    });


});