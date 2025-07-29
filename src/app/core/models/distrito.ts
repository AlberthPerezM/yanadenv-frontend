import { Centro } from "./centro";
import { Provincia } from "./provincia";

export class Distrito {
  idDist?: number | null;
  habilitadoDist?: boolean;
  nombreDist?: string | null;
  provincia?: Provincia;
  centros?: Centro[];
}
