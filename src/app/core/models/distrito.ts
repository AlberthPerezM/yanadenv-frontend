import { Provincia } from "./provincia";

export class Distrito {
  idDist?: number | null;
  habilitadoDist?: boolean;
  nombreDist?: string | null;
  provincia?: Provincia;

  // Si necesitas manejar la lista centros en el futuro, descomenta y define la clase Centro
  // centros: Centro[];
}
