<?php


describe('Autorização e permissão', function(){
    describe('Permissões Gerente', function(){
        it('Tem permissão para acessar listagens', function(){
            $permissao = AutorizadorAcoes::podeRealizarAcao(EnumCargo::GERENTE->toString(), AutorizadorAcoes::LISTAR->toString());
            expect($permissao)->toBe(true);
        });

        it('Tem permissão para acessar cadastros', function(){
            $permissao = AutorizadorAcoes::podeRealizarAcao(EnumCargo::GERENTE->toString(), AutorizadorAcoes::CADASTRAR->toString());
            expect($permissao)->toBe(true);
        });

        it('Tem permissão para acessar reltório de itens', function(){
            $permissao = AutorizadorAcoes::podeRealizarAcao(EnumCargo::GERENTE->toString(), AutorizadorAcoes::EXIBIR_RELATORIO_ITENS->toString());
            expect($permissao)->toBe(true);
        });

        it('Tem permissão para acessar reltório de devoluções', function(){
            $permissao = AutorizadorAcoes::podeRealizarAcao(EnumCargo::GERENTE->toString(), AutorizadorAcoes::EXIBIR_RELATORIO_DEVOLUCOES->toString());
            expect($permissao)->toBe(true);
        });
    });

    describe('Permissões Atendente', function(){
        it('Tem permissão para acessar listagens', function(){
            $permissao = AutorizadorAcoes::podeRealizarAcao(EnumCargo::ATENDENTE->toString(), AutorizadorAcoes::LISTAR->toString());
            expect($permissao)->toBe(true);
        });

        it('Tem permissão para acessar cadastros', function(){
            $permissao = AutorizadorAcoes::podeRealizarAcao(EnumCargo::ATENDENTE->toString(), AutorizadorAcoes::CADASTRAR->toString());
            expect($permissao)->toBe(true);
        });

        it('Tem permissão para acessar reltório de itens', function(){
            $permissao = AutorizadorAcoes::podeRealizarAcao(EnumCargo::ATENDENTE->toString(), AutorizadorAcoes::EXIBIR_RELATORIO_ITENS->toString());
            expect($permissao)->toBe(true);
        });

        it('Não tem permissão para acessar reltório de devoluções', function(){
            $permissao = AutorizadorAcoes::podeRealizarAcao(EnumCargo::ATENDENTE->toString(), AutorizadorAcoes::EXIBIR_RELATORIO_DEVOLUCOES->toString());
            expect($permissao)->toBe(false);
        });
    });

    describe('Permissões Mecânico', function(){
        it('Tem permissão para acessar listagens', function(){
            $permissao = AutorizadorAcoes::podeRealizarAcao(EnumCargo::MECANICO->toString(), AutorizadorAcoes::LISTAR->toString());
            expect($permissao)->toBe(true);
        });

        it('Não tem permissão para acessar cadastros', function(){
            $permissao = AutorizadorAcoes::podeRealizarAcao(EnumCargo::MECANICO->toString(), AutorizadorAcoes::CADASTRAR->toString());
            expect($permissao)->toBe(false);
        });

        it('Não tem permissão para acessar reltório de itens', function(){
            $permissao = AutorizadorAcoes::podeRealizarAcao(EnumCargo::MECANICO->toString(), AutorizadorAcoes::EXIBIR_RELATORIO_ITENS->toString());
            expect($permissao)->toBe(false);
        });

        it('Não tem permissão para acessar reltório de devoluções', function(){
            $permissao = AutorizadorAcoes::podeRealizarAcao(EnumCargo::MECANICO->toString(), AutorizadorAcoes::EXIBIR_RELATORIO_DEVOLUCOES->toString());
            expect($permissao)->toBe(false);
        });
    });
});