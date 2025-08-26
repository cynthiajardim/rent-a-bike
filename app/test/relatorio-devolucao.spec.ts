import {describe, expect, it, beforeEach} from 'vitest'
import {GestorDevolucao} from '../src/devolucao/gestor-devolucao.js'


describe('Relatório de Devolução', async () => {
    let gestor : GestorDevolucao;

    beforeEach(async () =>{
        gestor = new GestorDevolucao();
    })

    it("Dados não existentes deve causar erro", async () => {
        const dataInicial = new Date();
        const dataFinal = new Date();
        dataFinal.setMonth(dataFinal.getMonth() + 1);
        const dataInicialString = formatarParaDatetimeLocal(dataInicial);
        const dataFinalString = formatarParaDatetimeLocal(dataFinal);
        await expect(() =>
            gestor.coletarDevolucoesGrafico(dataInicialString, dataFinalString)
        ).rejects.toThrow();
    })

    it("Data inválida deve causar erro", async () => {
        const dataInicial = new Date();
        const dataFinal = new Date();
        dataInicial.setMonth(dataFinal.getMonth() + 3);
        const dataInicialString = formatarParaDatetimeLocal(dataInicial);
        const dataFinalString = formatarParaDatetimeLocal(dataFinal);
        await expect(() =>
            gestor.coletarDevolucoesGrafico(dataInicialString, dataFinalString)
        ).rejects.toThrow();
    })
})


function formatarParaDatetimeLocal(data: Date): string {
    const pad = (n: number) => n.toString().padStart(2, '0');
    const ano = data.getFullYear();
    const mes = pad(data.getMonth() + 1);
    const dia = pad(data.getDate());
    const hora = pad(data.getHours());
    const minuto = pad(data.getMinutes());

    return `${ano}-${mes}-${dia}T${hora}:${minuto}`;
}