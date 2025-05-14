import { defineStore } from "pinia";
import type { ServerType, ServerInfo } from "~/types/serverInterface";
import { useFetch } from "#app";

// Definindo a store com o nome 'counter'
export const useServersStore = defineStore("useServersStore", {
  state: () => ({
    servers: [] as ServerType[],
    dataCnpj: [] as ServerInfo[],
    serverFind: {} as ServerType,
  }),
  actions: {
    async FetchCnpjTef(cnpj: string) {
      const url = `/instalador-tef/instalador-tef/consulta.aspx?q=${cnpj}`;

      try {
        const { data, error } = await useFetch(url);

        // Verifique se houve erro na requisição
        if (error.value) {
          console.error("Erro na requisição:", error.value);
          return;
        }
        console.log(data.value);
        // Verifique se os dados foram recebidos corretamente
        if (data.value) {
          const parsedData = this.parseTableData(String(data.value));
          this.dataCnpj = parsedData;
        }
      } catch (err) {
        console.error("Erro ao fazer requisição:", err);
      }
    },
    parseTableData(htmlString: string) {
      const parser = new DOMParser();
      const doc = parser.parseFromString(htmlString, "text/html");

      const table = doc.querySelector("#tabela");

      if (!table) {
        console.error("Tabela não encontrada na resposta.");
        return [];
      }

      const rows = table.querySelectorAll("tr");
      const result = [] as any[];

      for (let i = 1; i < rows.length; i++) {
        const cells = rows[i].querySelectorAll("td");

        const nomeServidorLink = cells[0]?.querySelector("a")?.href || ""; // Pega o link da tag <a>

        const rowData = {
          nomeServidor: cells[0]?.textContent?.trim() || "",
          nomeServidorLink: nomeServidorLink,
          nomeEmpresa: cells[1]?.textContent?.trim() || "",
          codigoEmpresa: cells[2]?.textContent?.trim() || "",
          nomeLoja: cells[3]?.textContent?.trim() || "",
          codigoLoja: cells[4]?.textContent?.trim() || "",
          senhaConfiguracao: cells[5]?.textContent?.trim() || "",
        } as ServerInfo;
        result.push(rowData);
      }

      const ListServer = this.FetchListServers();
      if (!ListServer || ListServer.length === 0) {
        console.error("Lista de servidores não encontrada.");
        return result;
      }

      // Buscando o servidor baseado no nome da empresa
      const server = ListServer.find(
        (server) => server.nome === result[0]?.nomeServidor?.trim()
      );
      this.serverFind = server ? server : ({} as ServerType);

      if (server) {
        console.log("Servidor encontrado:", server);
      } else {
        console.log(
          "Servidor não encontrado para a empresa ou a loja nao usa DTEF:",
          result[0]?.nomeEmpresa
        );
      }

      // Retornando o resultado
      return result;
    },

    FetchListServers() {
      this.servers = [
        {
          id: "DTEF-DOCKER-003",
          ip: "172.30.249.223",
          porta: 328,
          nome: "MICROVIX-11",
          identificador: "dtef_microvix_11",
          codigo: 7028,
        },
        {
          id: "DTEF-DOCKER-003",
          ip: "172.30.249.223",
          porta: 433,
          nome: "IPIRANGA-11",
          identificador: "dtef_ipiranga_11",
          codigo: 7046,
        },
        {
          id: "DTEF-DOCKER-003",
          ip: "172.30.249.223",
          porta: 329,
          nome: "MICROVIX-12",
          identificador: "dtef_microvix_12",
          codigo: 7050,
        },
        {
          id: "DTEF-DOCKER-003",
          ip: "172.30.249.223",
          porta: 324,
          nome: "LINXPOS-07",
          identificador: "dtef_linxpos_07",
          codigo: 7056,
        },
        {
          id: "DTEF-DOCKER-003",
          ip: "172.30.249.223",
          porta: 393,
          nome: "MULTIPLUSCARD-03",
          identificador: "dtef_multipluscard_03",
          codigo: 7118,
        },
        {
          id: "DTEF-DOCKER-003",
          ip: "172.30.249.223",
          porta: 443,
          nome: "MULTIPLUSCARD_08",
          identificador: "dtef_multipluscard_08",
          codigo: 7201,
        },
        {
          id: "DTEF-DOCKER-003",
          ip: "172.30.249.223",
          porta: 315,
          nome: "TEFNET-03",
          identificador: "dtef_tefnet_03",
          codigo: 7231,
        },
        {
          id: "DTEF-DOCKER-003",
          ip: "172.30.249.223",
          porta: 437,
          nome: "LOJAS_23",
          identificador: "dtef_lojas_23",
          codigo: 7352,
        },
        {
          id: "DTEF-DOCKER-003",
          ip: "172.30.249.223",
          porta: 288,
          nome: "LOJAS_21",
          identificador: "dtef_lojas_21",
          codigo: 7701,
        },
        {
          id: "DTEF-DOCKER-004",
          ip: "172.30.249.224",
          porta: 366,
          nome: "TEFWAY-01",
          identificador: "dtef_tefway_01",
          codigo: 7017,
        },
        {
          id: "DTEF-DOCKER-004",
          ip: "172.30.249.224",
          porta: 416,
          nome: "IPIRANGA-10",
          identificador: "dtef_ipiranga_10",
          codigo: 7041,
        },
        {
          id: "DTEF-DOCKER-004",
          ip: "172.30.249.224",
          porta: 376,
          nome: "INTERCAMP",
          identificador: "dtef_intercamp",
          codigo: 7049,
        },
        {
          id: "DTEF-DOCKER-004",
          ip: "172.30.249.224",
          porta: 326,
          nome: "MICROVIX-09",
          identificador: "dtef_microvix_09",
          codigo: 7082,
        },
        {
          id: "DTEF-DOCKER-004",
          ip: "172.30.249.224",
          porta: 391,
          nome: "MULTIPLUSCARD",
          identificador: "dtef_multipluscard_01",
          codigo: 7103,
        },
        {
          id: "DTEF-DOCKER-004",
          ip: "172.30.249.224",
          porta: 403,
          nome: "REZENDE-04",
          identificador: "dtef_rezende_04",
          codigo: 7119,
        },
        {
          id: "DTEF-DOCKER-004",
          ip: "172.30.249.224",
          porta: 277,
          nome: "MICROVIX-15",
          identificador: "dtef_microvix_15",
          codigo: 7125,
        },
        {
          id: "DTEF-DOCKER-004",
          ip: "172.30.249.224",
          porta: 440,
          nome: "MULTIPLUSCARD_07",
          identificador: "dtef_multipluscard_07",
          codigo: 7140,
        },
        {
          id: "DTEF-DOCKER-004",
          ip: "172.30.249.224",
          porta: 316,
          nome: "SETA-01",
          identificador: "dtef_seta_01",
          codigo: 7320,
        },
        {
          id: "DTEF-DOCKER-004",
          ip: "172.30.249.224",
          porta: 434,
          nome: "BENOIT_01",
          identificador: "dtef_benoit_01",
          codigo: 7350,
        },
        {
          id: "DTEF-DOCKER-005",
          ip: "172.30.249.226",
          porta: 415,
          nome: "IPIRANGA-09",
          identificador: "dtef_ipiranga_09",
          codigo: 7031,
        },
        {
          id: "DTEF-DOCKER-005",
          ip: "172.30.249.226",
          porta: 310,
          nome: "LINXPOS-05",
          identificador: "dtef_linxpos_05",
          codigo: 7038,
        },
        {
          id: "DTEF-DOCKER-005",
          ip: "172.30.249.226",
          porta: 302,
          nome: "LOJAS-22",
          identificador: "dtef_lojas_22",
          codigo: 7095,
        },
        {
          id: "DTEF-DOCKER-005",
          ip: "172.30.249.226",
          porta: 377,
          nome: "INTERCAMP-02",
          identificador: "dtef_intercamp_02",
          codigo: 7113,
        },
        {
          id: "DTEF-DOCKER-005",
          ip: "172.30.249.226",
          porta: 320,
          nome: "TEFNET-04",
          identificador: "dtef_tefnet_04",
          codigo: 7115,
        },
        {
          id: "DTEF-DOCKER-005",
          ip: "172.30.249.226",
          porta: 392,
          nome: "MULTIPLUSCARD-02",
          identificador: "dtef_multipluscard_02",
          codigo: 7117,
        },
        {
          id: "DTEF-DOCKER-005",
          ip: "172.30.249.226",
          porta: 338,
          nome: "LOJAS-09",
          identificador: "dtef_lojas_09",
          codigo: 7211,
        },
        {
          id: "DTEF-DOCKER-005",
          ip: "172.30.249.226",
          porta: 390,
          nome: "LZT-10",
          identificador: "dtef_lzt_10",
          codigo: 7314,
        },
        {
          id: "DTEF-DOCKER-005",
          ip: "172.30.249.226",
          porta: 271,
          nome: "MICROVIX-14",
          identificador: "dtef_microvix_14",
          codigo: 7825,
        },
        {
          id: "DTEF-DOCKER-005",
          ip: "172.30.249.226",
          porta: 460,
          nome: "GABRIELA_04",
          identificador: "dtef_gabriela_04",
          codigo: 7830,
        },
        {
          id: "DTEF-DOCKER-014",
          ip: "172.30.249.242",
          porta: 355,
          nome: "LOJAS-10",
          identificador: "dtef_lojas_10",
          codigo: 7260,
        },
        {
          id: "DTEF-DOCKER-006",
          ip: "172.30.249.237",
          porta: 356,
          nome: "LOJAS-11",
          identificador: "dtef_lojas_11",
          codigo: 7261,
        },
        {
          id: "DTEF-DOCKER-012",
          ip: "172.30.249.236",
          porta: 357,
          nome: "LOJAS-12",
          identificador: "dtef_lojas_12",
          codigo: 7262,
        },
        {
          id: "DTEF-DOCKER-012",
          ip: "172.30.249.236",
          porta: 365,
          nome: "LOJAS-18",
          identificador: "dtef_lojas_18",
          codigo: 7265,
        },
        {
          id: "DTEF-DOCKER-003",
          ip: "172.30.249.223",
          porta: 437,
          nome: "LOJAS_23",
          identificador: "dtef_lojas_23",
          codigo: 7352,
        },
        {
          id: "DTEF-DOCKER-003",
          ip: "172.30.249.223",
          porta: 288,
          nome: "LOJAS_21",
          identificador: "dtef_lojas_21",
          codigo: 7701,
        },
        {
          id: "DTEF-DOCKER-005",
          ip: "172.30.249.226",
          porta: 302,
          nome: "LOJAS-22",
          identificador: "dtef_lojas_22",
          codigo: 7095,
        },
        {
          id: "DTEF-DOCKER-007",
          ip: "172.30.249.228",
          porta: 333,
          nome: "LOJAS-04",
          identificador: "dtef_lojas_04",
          codigo: 7233,
        },
        {
          id: "DTEF-DOCKER-007",
          ip: "172.30.249.228",
          porta: 378,
          nome: "BOBS",
          identificador: "dtef_bobs",
          codigo: 7243,
        },
        {
          id: "DTEF-DOCKER-013",
          ip: "172.30.249.238",
          porta: 278,
          nome: "LOJAS-20",
          identificador: "dtef_lojas_20",
          codigo: 7183,
        },
        {
          id: "DTEF-DOCKER-013",
          ip: "172.30.249.238",
          porta: 311,
          nome: "LOJAS-13",
          identificador: "dtef_lojas_13",
          codigo: 7263,
        },
        {
          id: "DTEF-DOCKER-015",
          ip: "172.30.249.241",
          porta: 457,
          nome: "BOBS-03",
          identificador: "dtef_bobs_03",
          codigo: 7827,
        },
        {
          id: "DTEF-DOCKER-014",
          ip: "172.30.249.242",
          porta: 379,
          nome: "BOBS-02",
          identificador: "dtef_bobs_02",
          codigo: 7165,
        },
        {
          id: "DTEF-DOCKER-014",
          ip: "172.30.249.242",
          porta: 358,
          nome: "LOJAS-14",
          identificador: "dtef_lojas_14",
          codigo: 7264,
        },
        // Adicione os outros servidores da mesma forma
      ];
      return this.servers;
    },
  },
});
