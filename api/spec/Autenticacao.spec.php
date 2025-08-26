<?php

describe("Autenticacao", function(){
    beforeAll(function(){
        `cd ../g4 && pnpm run db`;
    });

    beforeEach(function (){
        $this->json = json_encode([
            'cpf' => "12345678901",
            'senha' => "senha123"
        ]);

        $this->gerenteSessaoFake = new class implements GerenteDeSessao {
            public function abrirSessao(): void {}

            public function setFuncionario($funcionario): void {
                $_SESSION['funcionario'] = $funcionario;
            }

            public function fecharSessao(): void {
                unset($_SESSION['funcionario']);
            }
            
            public function verificarSeUsuarioEstaLogado(): void{
                if(!isset($_SESSION['funcionario']) || $_SESSION['funcionario'] == null){
                    throw new DominioException("Usuário não autenticado.");
                }
            }

            public function retornarFuncionario() : Funcionario{
                return $_SESSION['funcionario'];
            }
        };

        $this->autenticador = new Autenticador($this->gerenteSessaoFake);

        $this->pdo = new PDO(
        'mysql:dbname=g4;host=localhost;charset=utf8',
        'root', '',
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
        ]
        );
    });

    describe("Realizar login", function (){
        it("Realiza login com sucesso", function(){
            $this->autenticador->autenticarFuncionario($this->pdo, $this->json);
            $this->autenticador->verificarSeUsuarioEstaLogado();
            expect(1)->toBe(1);
        });

        it("Login inválido deve retornar erro", function(){
            $jsonInvalido = json_encode([
                'cpf' => "12345678901",
                'senha' => "senha12"
            ]);
            expect(function() use($jsonInvalido){
                $this->autenticador->autenticarFuncionario($this->pdo, $jsonInvalido);
            })->toThrow(new DominioException) ;
        });
    });

    it("Realizar logout", function(){
        $this->autenticador->autenticarFuncionario($this->pdo, $this->json);
        $this->autenticador->fecharSessao();
        expect(function(){
            $this->autenticador->verificarSeUsuarioEstaLogado();
        })->toThrow(new DominioException) ;
    });
});