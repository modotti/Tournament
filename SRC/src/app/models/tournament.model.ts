import { Duel } from './duel.model';

export interface Tournament {
    name: string;
    roundOne: Duel[];
    roundTwo: Duel[];
    semifinals: Duel[];
    final: Duel[];
}
