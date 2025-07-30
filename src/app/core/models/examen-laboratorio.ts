import { Participante } from "./participante";

export class ExamenLaboratorio {
    idExa?: number;
    nombreExa!: string;
    examenResultado?: string;
    fechaResultado?: Date;
    //participantes?: Participante[]; // Evita ciclos si vas a anidar

}
