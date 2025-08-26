<?php

class DominioException extends RuntimeException{
    /**
     * @var array<string> $problemas
     */
    private array $problemas = [];

    /**
     * @return string[]
     */
    public function getProblemas() : array{
        return $this->problemas;
    }

    /**
     * @param array<string> $problemas
     * @return DominioException
     */
    public static function com(array $problemas) : DominioException{
        $e = new DominioException();
        $e->problemas = $problemas;
        return $e;
    }
}