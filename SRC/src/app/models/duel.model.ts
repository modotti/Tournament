export class Duel {
    team1: string;
    team2: string;
    winner: number;
    disabled: boolean;
    round?: number;
    index?: number;

  /**
   * getEmptyDuel()
   * Return an empty duel.
   *
   * @param <number> roundParam
   * @param <number> indexParam
   */
    public static getEmptyDuel = (roundParam: number, indexParam: number): Duel => {
        return {
            team1: null,
            team2: null,
            winner: 0,
            disabled: true,
            round: roundParam,
            index: indexParam
        };
    }
}
