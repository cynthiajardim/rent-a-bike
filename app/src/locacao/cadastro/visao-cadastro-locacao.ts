export interface VisaoCadastroLocacao{
    coletarDados() : {cliente, horas};
    coletarHoras();
    coletarCliente();
    coletarCodigoItem();

    exibirCliente({id, nome, foto});
    exibirItem({codigo, descricao, disponibilidade, valorPorHora, avaria});
    construirTabela({itens, valores});
    exibirDataHoraEntrega(entrega:Date);
    exibirMensagens(mensagens : string[], erro:boolean);

    limparTelaCadastro();
}