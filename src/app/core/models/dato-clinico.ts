// dato-clinico.ts

import { Participante } from "./participante";

export class DatoClinico {
  idDat?: number;
  fechaRegistro?: Date;
  fechaInicioSintomas?: Date;
  fechaTomaMuestra1?: Date;
  fechaTomaMuestra2?: Date;
  fiebre?: boolean;
  temperatura?: number;
  mialgias?: boolean;
  cefalea?: boolean;
  dolorOcular?: boolean;
  dolorLumbar?: boolean;
  erupcionCutanea?: boolean;
  conjuntivitis?: boolean;
  nauseasVomitos?: boolean;
  otrosSintomas1?: string;
  otrosSintomas2?: string;
  otrosSintomas3?: string;
  otrosSintomas4?: string;
  dolorAbdominalIntenso?: boolean;
  dolorToracicoDisnea?: boolean;
  derrameSeroso?: boolean;
  hipotermia?: boolean;
  diuresisDisminuida?: boolean;
  hepatomegalia?: boolean;
  ictericia?: boolean;
  estadoMentalAlterado?: boolean;
  hematocritoIncrementado?: boolean;
  pulsoIndetectable?: boolean;
  extremidadesFrias?: boolean;
  difPresionArterial?: boolean;
  compromisoOrganos?: boolean;
  tipoCompromisoOrganos?: string;
  sangradoGrave?: boolean;
  tipoSangrado?: string;
  glasgowAperturaOcular?: number;
  glasgowAperturaMotora?: number;
  glasgowAperturaVerbal?: number;
  participante?: Participante;

}