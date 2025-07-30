import { Participante } from "./participante";

export class Apoderado {
    idApo!: number;
    nombre!: string;
    apellidoPaterno!: string;
    apellidoMaterno!: string;
    sexo!: string;
    tipoDocumento!: string;
    numeroDocumento!: string;
    edad!: number;
    participante?: Participante;  // Relación ManyToOne con Apoderado

}
