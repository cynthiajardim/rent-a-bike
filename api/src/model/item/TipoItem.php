<?php

enum TipoItem: string {
    case BICICLETA = 'bicicleta';
    case EQUIPAMENTO = 'equipamento';

    /**
     * Enum para array
     * @return string[]
     */
    private static function toArray() : array {
        return [
            self::BICICLETA->value,
            self::EQUIPAMENTO->value
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
}