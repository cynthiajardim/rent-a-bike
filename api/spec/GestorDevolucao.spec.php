<?php
require_once __DIR__ . '/../src/infra/repositorio/CriadorDeGestores.php';


describe('Gestor Devolução', function(){

    beforeAll(function(){
        `cd ../g4 && pnpm run db`;
        $pdo = new PDO( 'mysql:dbname=g4;host=localhost;charset=utf8', 'root', '' );

        $this->gestor = criarGestorDeDevolucao($pdo, new AutenticadorParaTestes(new GerenteDeSessaoEmSession())); 
    });

    it("Cadastra uma devolução válida", function(){
        $this->gestor->salvarDevolucao(["dataDeDevolucao"=> '2025-05-23 11:14:00', "locacao" => '3', "funcionario" => 1], []);
        expect(1)->toBe(1);
    });

    it("Cadastrar devolução de uma locação já devolvida deve retornar erro", function(){
        expect(function (){
            $this->gestor->salvarDevolucao(["dataDeDevolucao"=> '2025-05-23 11:14:00', "locacao" => '3', "funcionario" => 1], []);
        })->toThrow(new DominioException());
    });

    it("Cadastrar devolução com uma locação inexistente deve retornar erro", function(){
        expect(function(){
            $this->gestor->salvarDevolucao(["dataDeDevolucao"=> '2025-05-23 11:14:00', "locacao" => '100'], []);
        })->toThrow(new DominioException());
    });

    it("Retorna todas as devoluções corretamente", function(){
        $devolucoes = $this->gestor->coletarDevolucoes();
        expect($devolucoes)->toHaveLength(11);
    });

    describe("Devoluções para gráfico", function(){

        it("Deve retornar a quantidade correta de devoluções", function () {
            $parametros = [];
            $parametros["dataInicial"] = "";
            $parametros["dataFinal"] = "";

            $devolucoes = $this->gestor->coletarDevolucoesParaGrafico($parametros);
            expect(count($devolucoes))->toBe(0);
        });

        it("Não enviar as datas deve retornar os dados com aas datas entre o inicio e fim do mes", function (){
            $parametros = [];
            $parametros["dataInicial"] = "2025-05-01T11:54";
            $parametros["dataFinal"] = "2025-05-30T11:54";

            $devolucoes = $this->gestor->coletarDevolucoesParaGrafico($parametros);
            expect(count($devolucoes))->toBe(2);
        });

        it("Data final menor que a inicial deve retornar erro", function(){
            $parametros = [];
            $parametros["dataInicial"] = "2025-06-08T11:54";
            $parametros["dataFinal"] = "2025-04-08T11:54";
            expect(function() use($parametros){
                $devolucoes = $this->gestor->coletarDevolucoesParaGrafico($parametros);
            })->toThrow(new DominioException());
        });

        it("Data inicial maior que a atual deve retornar erro", function(){
            $dataFutura = (new DateTime('+1 day'))->format('Y-m-d\TH:i');
            $parametros = [];
            $parametros["dataInicial"] = $dataFutura;
            $parametros["dataFinal"] = "";
            expect(function() use($parametros){
                $devolucoes = $this->gestor->coletarDevolucoesParaGrafico($parametros);
            })->toThrow(new DominioException());
        });
    });
});