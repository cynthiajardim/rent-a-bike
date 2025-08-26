<?php
require_once __DIR__ . '/../src/infra/repositorio/CriadorDeGestores.php';


describe("Testes para Relatório de Itens Alugados por Período", function(){
    beforeAll(function(){
        `cd ../g4 && pnpm run db`;
        $pdo = new PDO('mysql:dbname=g4;host=localhost;charset=utf8', 'root', '');

        $this->gestorItem = criarGestorDeItem($pdo, new AutenticadorParaTestes(new GerenteDeSessaoEmSession()));
    });

    describe("Datas válidas", function(){
        it("Data inicial não deve ser maior do que a data atual", function(){
            $dataInicial = new DateTime("+2 days"); //dois dias a frente da atual

            expect(function() use($dataInicial){
                $this->gestorIem->coletarItensParaRelatorio(['dataIncial' => $dataInicial->format("Y-m-d H:i:s")]);
            })->toThrow(new DominioException());
        }); 

        it("Data final não deve ser maior do que a final", function(){
            $dataFinal = new DateTime("-3 days");
            $dataInicial = clone $dataFinal->modify("+2 days");
            $parametros = [
                "dataInicial" => $dataInicial,
                "dataFinal" => $dataFinal
            ];

            expect(function() use($parametros){
                $this->gestorIem->coletarItensParaRelatorio($parametros);
            })->toThrow(new DominioException());
        }); 
    });

    describe("Busca por dados retorna dados corretamente", function(){
        it("Deve retornar um array preenchido", function(){
            $dataFinal = "2025-06-05";
            $dataInicial = "2025-06-01";
            
            $dados = $this->gestorIem->coletarItensParaRelatorio(["dataInicial" => $dataInicial, "dataFinal" => $dataFinal]);
            expect(count($dados))->toBeGreaterThan(0);
        });
    });

});