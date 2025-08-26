<?php

enum AutorizadorAcoes : string{
    case LISTAR = 'listar';
    case CADASTRAR = 'cadastrar';
    case CADASTRAR_AVARIA = "cadastrar avaria";
    case EXIBIR_RELATORIO_ITENS = 'exibir relatório de itens';
    case EXIBIR_RELATORIO_DEVOLUCOES = 'exibir relatório de devoluções';

    /**
     * Enum para array
     * @return string[]
     */
    private static function toArray() : array {
        return [
            self::LISTAR->value,
            self::CADASTRAR->value,
            self::EXIBIR_RELATORIO_ITENS->value,
            self::EXIBIR_RELATORIO_DEVOLUCOES->value,
            selF::CADASTRAR_AVARIA->value
        ];
    }

    /**
     * Verifica se o tipo pertence ao Enum.
     * @param string $tipo
     * @return bool
     */
    public static function isValid(string $tipo) : bool {
        return in_array($tipo, self::toArray());
    }

    /**
     * Retorna o valor do enum como string.
     * @return string
     */
    public function toString(): string {
        return $this->value;
    }

    /**
     * Retorna se o cargo pode realizar determinada ação 
     * @param string $cargo
     * @param string $acao
     * @return bool
     */
    public static function podeRealizarAcao(string $cargo, string $acao) : bool {
        switch($acao){
            case self::LISTAR->toString() : 
                return true;
            case self::CADASTRAR->toString() :
                if($cargo != EnumCargo::MECANICO->toString()) 
                    return true;
                return false;
            case self::EXIBIR_RELATORIO_ITENS->toString() : 
                if($cargo == EnumCargo::ATENDENTE->toString() || $cargo == EnumCargo::GERENTE->toString())
                    return true;
                return false;
            case self::EXIBIR_RELATORIO_DEVOLUCOES->toString() : 
                if($cargo == EnumCargo::GERENTE->toString())
                    return true;
                return false;
            case self::CADASTRAR_AVARIA->toString():
                if($cargo == EnumCargo::GERENTE->toString())
                    return true;
                return false;
            default : 
                return false; 
        }
    }
}