<?php

class GerenteDeSessaoEmSession implements GerenteDeSessao{
    public function abrirSessao(): void{
        if (session_status() !== PHP_SESSION_ACTIVE){
            session_set_cookie_params(['httponly' => true , 'lifetime' => 60 * 60 * 24] );
            session_name( 'sid' );
            session_start();
        }
    }

    public function setFuncionario(Funcionario $funcionario): void{
        $_SESSION['funcionario'] = $funcionario;

        setcookie(
            'user_name',                   
            $funcionario->getNome(),
            [
                'expires' => time() + 60 * 60 * 24,
                'path' => '/',
                'httponly' => false
            ]
        );

        setcookie(
            'cargo',
            $funcionario->getCargo(),
             [
                'expires' => time() + 60 * 60 * 24,
                'path' => '/',
                'httponly' => false
            ]
        );
    }

    public function fecharSessao(): void{
        $_SESSION['funcionario'] = null;

        setcookie(
            'user_name',
            '',
            [
                'expires' => time() - 60 * 60 * 24,
                'path' => '/',
                'httponly' => false
            ]
        );

        session_destroy();
    }

    public function verificarSeUsuarioEstaLogado(): void{
        if(!isset($_SESSION['funcionario']) || $_SESSION['funcionario'] == null){
            throw new DominioException("Usuário não autenticado.");
        }
    }

    public function retornarFuncionario() : Funcionario{
        return $_SESSION['funcionario'];
    }
}