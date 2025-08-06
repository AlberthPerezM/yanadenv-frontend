import { Centro } from './centro';

export class Campania {
    idCam!: number;
    habilitadoCam!: boolean;
    nombreCam!: string;
    descripcionCam?: string;
    fechaInicio!: Date;
    fechaFin?: Date;
    centro!: Centro;
}
