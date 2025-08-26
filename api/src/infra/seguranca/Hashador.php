<?php
Dotenv\Dotenv::createMutable(__DIR__ . '/../../../../')->load();
class Hashador{
    function gerarSal(): string {
        return bin2hex( random_bytes( 15 ) );
    }
    private function adicionarPimenta( string $texto ): string {
        $senha = $_ENV['PREFIXO_PIMENTA'] . $texto . $_ENV['SUFIXO_PIMENTA'];
        return $senha;
    }

    private function adicionarSal( string $texto, string $sal ): string {
        return $sal . $texto;
    }

    private function meuHash( string $texto ): string {
        return hash( 'sha512', $texto );
    }

    function criarSenha(string $senha, string $sal): string{
        return $this->meuHash( $this->adicionarSal( $this->adicionarPimenta( $senha ), $sal ) );
    }

}
