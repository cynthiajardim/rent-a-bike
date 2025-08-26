import {describe, expect, it, beforeAll} from 'vitest'
import {ServicoAutenticador} from '../src/autenticador/servico-autenticador';
import {PAGE_CADASTRO_DEVOLUCAO, PAGE_CADASTRO_LOCACAO, PAGE_DEVOLUCOES, PAGE_LOCACOES, PAGE_RELATORIO_DEVOLUCAO, PAGE_RELATORIO_ITENS } from '../infra/app';
import { cargos } from '../src/autenticador/cargos-enum';

describe('Autorização e permissão', () => {
    describe('Permissões Gerente', () =>{
        it('Tem permissão para acessar relatório de devoluções', () => {
            window.history.pushState({}, '', "/"+PAGE_RELATORIO_DEVOLUCAO);
            
            const permissao = ServicoAutenticador.verificarPermissao(cargos.GERENTE);
            expect(permissao).toBeTruthy();
        })

        it('Tem permissão para acessar cadastro de devoluções', () => {
            window.history.pushState({}, '', "/"+PAGE_CADASTRO_DEVOLUCAO);
            
            const permissao = ServicoAutenticador.verificarPermissao(cargos.GERENTE);
            expect(permissao).toBeTruthy();
        })

        it('Tem permissão para acessar listagem de devoluções', () => {
            window.history.pushState({}, '', "/"+PAGE_DEVOLUCOES);
            const permissao = ServicoAutenticador.verificarPermissao(cargos.GERENTE);
            expect(permissao).toBeTruthy();
        })

        it('Tem permissão para acessar relatório de itens', () => {
            window.history.pushState({}, '', "/"+PAGE_RELATORIO_ITENS);
            const permissao = ServicoAutenticador.verificarPermissao(cargos.GERENTE);
            expect(permissao).toBeTruthy();
        })

        it('Tem permissão para acessar listagem de locações', () => {
            window.history.pushState({}, '', "/"+PAGE_LOCACOES);
            const permissao = ServicoAutenticador.verificarPermissao(cargos.GERENTE);
            expect(permissao).toBeTruthy();
        })

        it('Tem permissão para acessar cadastro de locações', () => {
            window.history.pushState({}, '', "/"+PAGE_CADASTRO_LOCACAO);
            const permissao = ServicoAutenticador.verificarPermissao(cargos.GERENTE);
            expect(permissao).toBeTruthy();
        })
    })

    describe('Permissões Atendente', () => {
        it('Não tem permissão para acessar relatório de devoluções', () => {
            window.history.pushState({}, '', "/"+PAGE_RELATORIO_DEVOLUCAO);
            const permissao = ServicoAutenticador.verificarPermissao(cargos.ATENDENTE);
            expect(permissao).toBeFalsy();
        })

        it('Tem permissão para acessar cadastro de devoluções', () => {
            window.history.pushState({}, '', "/"+PAGE_CADASTRO_DEVOLUCAO);
            const permissao = ServicoAutenticador.verificarPermissao(cargos.ATENDENTE);
            expect(permissao).toBeTruthy();
        })

        it('Tem permissão para acessar listagem de devoluções', () => {
            window.history.pushState({}, '', "/"+PAGE_DEVOLUCOES);
            const permissao = ServicoAutenticador.verificarPermissao(cargos.ATENDENTE);
            expect(permissao).toBeTruthy();
        })

        it('Tem permissão para acessar relatório de itens', () => {
            window.history.pushState({}, '', "/"+PAGE_RELATORIO_ITENS);
            const permissao = ServicoAutenticador.verificarPermissao(cargos.ATENDENTE);
            expect(permissao).toBeTruthy();
        })

        it('Tem permissão para acessar listagem de locações', () => {
            window.history.pushState({}, '', "/"+PAGE_LOCACOES);
            const permissao = ServicoAutenticador.verificarPermissao(cargos.ATENDENTE);
            expect(permissao).toBeTruthy();
        })

        it('Tem permissão para acessar cadastro de locações', () => {
            window.history.pushState({}, '', "/"+PAGE_CADASTRO_LOCACAO);
            const permissao = ServicoAutenticador.verificarPermissao(cargos.ATENDENTE);
            expect(permissao).toBeTruthy();
        })
    })

    describe('Permissões Mecânico', () => {
        it('Não tem permissão para acessar relatório de devoluções', () => {
            window.history.pushState({}, '', "/"+PAGE_RELATORIO_DEVOLUCAO);
            const permissao = ServicoAutenticador.verificarPermissao(cargos.MECANICO);
            expect(permissao).toBeFalsy();
        })

        it('Não tem permissão para acessar cadastro de devoluções', () => {
            window.history.pushState({}, '', "/"+PAGE_CADASTRO_DEVOLUCAO);
            const permissao = ServicoAutenticador.verificarPermissao(cargos.MECANICO);
            expect(permissao).toBeFalsy();
        })

        it('Tem permissão para acessar listagem de devoluções', () => {
            window.history.pushState({}, '', "/"+PAGE_DEVOLUCOES);
            const permissao = ServicoAutenticador.verificarPermissao(cargos.MECANICO);
            expect(permissao).toBeTruthy();
        })

        it('Não tem permissão para acessar relatório de itens', () => {
            window.history.pushState({}, '', "/"+PAGE_RELATORIO_ITENS);
            const permissao = ServicoAutenticador.verificarPermissao(cargos.MECANICO);
            expect(permissao).toBeFalsy();
        })

        it('Tem permissão para acessar listagem de locações', () => {
            window.history.pushState({}, '', "/"+PAGE_LOCACOES);
            const permissao = ServicoAutenticador.verificarPermissao(cargos.MECANICO);
            expect(permissao).toBeTruthy();
        })

        it('Não tem permissão para acessar cadastro de locações', () => {
            window.history.pushState({}, '', "/"+PAGE_CADASTRO_LOCACAO);
            const permissao = ServicoAutenticador.verificarPermissao(cargos.MECANICO);
            expect(permissao).toBeFalsy();
        })
    })
}); 