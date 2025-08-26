import { ControladoraRelatorioDevolucao } from "./controladora-relatorio-devolucao";
import { VisaoRelatorioDevolucao } from "./visao-relatorio-devolucao";
import { sel } from './sel-relatorio-devolucao';
import { exibirMensagens } from "../../../infra/util/ExibirMensagens";
import DOMPurify from "dompurify";
import {Chart,BarController,BarElement,CategoryScale,LinearScale,Tooltip,Legend} from 'chart.js';
Chart.register(BarController, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

class VisaoRelatorioDevolucaoHTML implements VisaoRelatorioDevolucao{
    private controladora : ControladoraRelatorioDevolucao;
    private grafico: Chart | null = null;

    constructor(){
        this.controladora = new ControladoraRelatorioDevolucao(this);
    }

    iniciar(){
        document.addEventListener('DOMContentLoaded', this.preencherInputsData.bind(this));
        document.querySelector(sel.enviarBtn)?.addEventListener("click", this.controladora.gerarRelatorio.bind(this.controladora));
    }

    private preencherInputsData(){
        const inputInicial = document.querySelector<HTMLInputElement>(sel.dataInicial);
        const inputFinal = document.querySelector<HTMLInputElement>(sel.dataFinal);

        const hoje = new Date();
        const ano = hoje.getFullYear();
        const mes = hoje.getMonth(); 

        const primeiroDia = new Date(ano, mes, 1);
        inputInicial!.value = primeiroDia.toISOString().slice(0, 10);;

        const ultimoDia = new Date(ano, mes + 1, 0);
        inputFinal!.value = ultimoDia.toISOString().slice(0, 10);;
    }

    coletarDataInicial(): string {
        return DOMPurify.sanitize(document.querySelector<HTMLInputElement>(sel.dataInicial)!.value)
    }

    coletarDataFinal(): string {
        return DOMPurify.sanitize(document.querySelector<HTMLInputElement>(sel.dataFinal)!.value)
    }

    gerarGrafico(devolucoes) {
        const eixoX = [];
        const eixoY = [];
        const cores = ["green","blue","orange","brown"];
        for(const devolucao of devolucoes){
            const partes = devolucao.dataLocacao.split("-");
            const dataNoFormatoBrasileiro = `${partes[2]}/${partes[1]}/${partes[0]}`;

            eixoX.push(dataNoFormatoBrasileiro);
            eixoY.push(devolucao.totalPagoDevolucao);
        }

        if(this.grafico) {
            this.grafico.destroy();
        }   

        const div = document.querySelector<HTMLCanvasElement>(sel.graficoOutput)!;
        this.grafico = new Chart(div, {
        type: 'bar',
        data: {
            labels: eixoX,
            datasets: [{
            label : "Valor da Devolução",
            backgroundColor: cores,
            data: eixoY,
            barPercentage: 0.4,
            categoryPercentage: 0.4 
            }]
        },
        options: {
            responsive: false,
            scales: {
            x: {
                title: {
                display: true,
                text: 'Data da Locação'
                }
            },
            y: {
                title: {
                display: true,
                text: 'Total Pago na Devolução (R$)'
                },
                beginAtZero: true
            }
            }
        }
        });
    }

    exibirMensagens(mensagens: string[], erro:boolean) {
        exibirMensagens(mensagens, erro, sel.erroOutput);   
    }
}

const visao = new VisaoRelatorioDevolucaoHTML();
visao.iniciar();