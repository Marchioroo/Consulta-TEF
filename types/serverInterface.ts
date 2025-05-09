export interface ServerType {
  id: string;
  ip: string;
  porta: number;
  nome: string;
  identificador: string;
  codigo: number;
}

export interface ServerInfo {
  nomeServidor: string;
  nomeEmpresa: string;
  codigoEmpresa: string;
  nomeLoja: string;
  codigoLoja: string;
  senhaConfiguracao: string;
}
