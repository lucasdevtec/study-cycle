import { FullDataOfMateria } from '../../types/models';

export default function calculoCiclo(materias: FullDataOfMateria[], horasCiclo: number) {
  // Dificuldade é de 1 a 5
  // muito dificil | dificil | rasoável | bom | muito bom
  //       5       |    4    |     3    |  2  |     1
  //_____________________________________________________
  // O calculo funciona dividindo a quantidade total de dificuldades somadas pela qtd de horas do seu ciclo e com isso encontrará o valor minimo
  const totalDeDificuldades = materias.reduce((total, item) => (item.incluso ? total + (item.dificuldade || 0) : total), 0);
  const horaMinimaEstudo = horasCiclo / totalDeDificuldades;

  const materiasComHorasDeEstudo = materias.map((materia) => ({
    ...materia,
    horasTotais: Math.round(horaMinimaEstudo * materia.dificuldade),
    horasConcluidas: 0,
  }));

  return materiasComHorasDeEstudo;
}
