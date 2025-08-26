import {TipoItem} from './tipo-item-enum.js';
export class Item {
  static readonly TAM_CODIGO = 8;
  static readonly TAM_MIN_STRING = 2;
  static readonly TAM_MAX_DESCRICAO = 200;
  static readonly TAM_MAX_MODELO = 60;
  static readonly TAM_MAX_FABRICANTE = 60;
  
  constructor(
    public readonly id: number | null,
    public readonly codigo: string,
    public readonly descricao: string,
    public readonly modelo: string,
    public readonly fabricante: string,
    public readonly valorPorHora: number,
    public readonly disponibilidade: boolean,
    public readonly tipo: string
  ) {}
  
  public validar(): string[] {
    const problemas: string[] = [];

    if (this.id === null || this.id <= 0) {
      problemas.push("O id deve ser um número maior que 0.");
    }

    if (this.valorPorHora <= 0) {
      problemas.push("Valor por hora inválido. O valor deve ser maior do que R$0,00.");
    }

    if (this.codigo.length !== Item.TAM_CODIGO) {
      problemas.push("O código deve ter 8 caracteres.");
    }

    if (
      this.modelo.length < Item.TAM_MIN_STRING ||
      this.modelo.length > Item.TAM_MAX_MODELO
    ) {
      problemas.push(`O modelo deve ter entre ${Item.TAM_MIN_STRING} e ${Item.TAM_MAX_MODELO} caracteres.`);
    }

    if (
      this.descricao.length < Item.TAM_MIN_STRING ||
      this.descricao.length > Item.TAM_MAX_DESCRICAO
    ) {
      problemas.push(`A descrição deve ter entre ${Item.TAM_MIN_STRING} e ${Item.TAM_MAX_DESCRICAO} caracteres.`);
    }

    if (
      this.fabricante.length < Item.TAM_MIN_STRING ||
      this.fabricante.length > Item.TAM_MAX_FABRICANTE
    ) {
      problemas.push(`O fabricante deve ter entre ${Item.TAM_MIN_STRING} e ${Item.TAM_MAX_FABRICANTE} caracteres.`);
    }

    if (
      this.tipo !== TipoItem.BICICLETA &&
      this.tipo !== TipoItem.EQUIPAMENTO
    ) {
      problemas.push("Tipo inválido.");
    }

    return problemas;
  }
}
  