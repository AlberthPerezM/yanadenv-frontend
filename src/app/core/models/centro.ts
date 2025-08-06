import { Campania } from "./campania";
import { Distrito } from "./distrito";

export class Centro {
  idCent!: number;
  habilitadoCent!: boolean;
  direccion!: string;
  latitud!: number;
  longitud!: number;
  nivel!: number;
  nombreCent!: string;
  distrito!: Distrito;
  campanias?: Campania[];
}

