import { Distrito } from "./distrito";
import { Region } from "./region";

export class Provincia {
  idProv?: number | null;
  habilitadoProv?: boolean;
  nombreProv?: string | null;
  fechaCreacion?: Date | null;
  region?: Region;
  distritos?: Distrito[];
}
