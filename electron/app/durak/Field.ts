import {Match} from "./Match";
export class Field {

    private matches: Array<Match> = []

    addMatch(match: Match) {
        this.matches.push(match);
    }

}