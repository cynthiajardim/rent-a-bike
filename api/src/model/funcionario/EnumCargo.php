<?php

enum EnumCargo :  string{
    case GERENTE = 'gerente';
    case ATENDENTE = 'atendente';
    case MECANICO = 'mecanico';

    /**
     * Enum para array
     * @return string[]
     */
    private static function toArray() : array {
        return [
            self::GERENTE->value,
            self::ATENDENTE->value,
            self::MECANICO->value,
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
     * Retorna o cargo como string.
     * @return string
     */
    public function toString(): string {
        return $this->value;
    }
}