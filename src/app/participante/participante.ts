import { ExamenLaboratorio } from "../examen-laboratorio/examen-laboratorio";

export class Participante {
    idPar!: number;
    nombre!: string;
    apellidoPaterno!: string;
    apellidoMaterno!: string;
    sexo!: string;
    tipoDocumento!: string;
    numeroDocumento!: string;
    edad!: number;
    gestante?: string;
    edadGestacional?: number;
    examenesLaboratorio?: ExamenLaboratorio[];
}
