import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { faPlus, faTrophy } from '@fortawesome/free-solid-svg-icons';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Duel } from '../models/duel.model';
import { TournamentSetup } from '../models/tournament-setup.model';
import { Tournament } from '../models/tournament.model';
import { NewTournamentComponent } from '../new-tournament/new-tournament.component';

@Component({
  selector: 'app-tournament',
  templateUrl: './tournament.component.html',
  styleUrls: ['./tournament.component.scss']
})
export class TournamentComponent implements OnInit {

  faPlus = faPlus;
  faTrophy = faTrophy;

  @ViewChild('welcomeModal') private welcomeModal: ElementRef;
  @ViewChild('newTournamentModal') private newTournamentModal: NewTournamentComponent;

  tournament: Tournament;
  private hasSavedTournament = false;

  constructor(private modalService: NgbModal) {
    this.initializeTournament();
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.openWelcome();
    }, 10);

    if (localStorage.getItem('nibo-tournament')) {
      this.hasSavedTournament = true;
    }
  }

  /**
   * openWelcome()
   * Open the welcome modal.
   */
  private openWelcome(): void {
    this.modalService.open(this.welcomeModal,
      {
        ariaLabelledBy: 'modal-basic-title',
        centered: true,
        animation: false,
        backdrop: 'static'
      });
  }

  /**
   * newTournament()
   * Opens the modal to configure new tournament.
   */
  newTournament(): void {
    this.modalService.dismissAll();
    setTimeout(() => {
      this.newTournamentModal.open();
    }, 1);
  }

  /**
   * initializeTournament()
   * Initializes a new object of type 'tournament' to be populated.
   */
  private initializeTournament(): void {
    this.tournament = {
      name: 'Tournament',
      roundOne: null,
      roundTwo: null,
      semifinals: null,
      final: null
    };

    this.initializeRounds();
  }

  /**
   * initializeRounds()
   * Initializes all rounds of tournament with empty duels to be populated.
   */
  private initializeRounds(): void {
    this.tournament.roundOne = new Array(8).fill(null).map((duel, index) => (Duel.getEmptyDuel(1, index)));
    this.tournament.roundTwo = new Array(4).fill(null).map((duel, index) => (Duel.getEmptyDuel(2, index)));
    this.tournament.semifinals = new Array(2).fill(null).map((duel, index) => (Duel.getEmptyDuel(3, index)));
    this.tournament.final = new Array(1).fill(null).map((duel, index) => (Duel.getEmptyDuel(4, index)));
  }

  /**
   * initializeDuels()
   * Set the name of the tournament and initialize all duels with the informed teams.
   * If there are less than 16 teams, the teams that will automatically reach the next round will be drawn.
   *
   * @param <TournamentSetup> setup
   */
  initializeDuels(setup: TournamentSetup): void {

    this.initializeRounds();

    this.tournament.name = setup.name;
    const teams = setup.teams;

    // It is important to fill the teams in the correct positions to
    // calculate the automatic results (in case we have less than 16 teams)
    this.tournament.roundOne[0].team1 = teams[0];
    this.tournament.roundOne[4].team1 = teams[1];
    this.tournament.roundOne[2].team1 = teams[2];
    this.tournament.roundOne[6].team1 = teams[3];

    this.tournament.roundOne[1].team1 = teams[4];
    this.tournament.roundOne[5].team1 = teams[5];
    this.tournament.roundOne[3].team1 = teams[6];
    this.tournament.roundOne[7].team1 = teams[7];

    this.tournament.roundOne[0].team2 = teams[8];
    this.tournament.roundOne[4].team2 = teams[9];
    this.tournament.roundOne[2].team2 = teams[10];
    this.tournament.roundOne[6].team2 = teams[11];

    this.tournament.roundOne[1].team2 = teams[12];
    this.tournament.roundOne[5].team2 = teams[13];
    this.tournament.roundOne[3].team2 = teams[14];
    this.tournament.roundOne[7].team2 = teams[15];

    // Calculate the automatic results and advances
    this.tournament.roundOne.forEach(this.automaticResults.bind(this));
    this.tournament.roundOne.forEach(this.automaticAdvance.bind(this));
    this.tournament.roundTwo.forEach(this.automaticResults.bind(this));
    this.tournament.roundTwo.forEach(this.automaticAdvance.bind(this));
    this.tournament.semifinals.forEach(this.automaticResults.bind(this));
    this.tournament.semifinals.forEach(this.automaticAdvance.bind(this));
    this.tournament.final.forEach(this.automaticResults.bind(this));

    // store tournament status
    this.saveTournament();
  }

  /**
   * automaticResults()
   * Checks if there are two teams for the duel and if the previous phase was completed to
   * determine if the duel is active or if the result should be set automatically.
   *
   * @param <Duel> duel
   * @param <number> index
   */
  private automaticResults(duel: Duel, index: number): void {
    const rounds = [null, this.tournament.roundOne, this.tournament.roundTwo, this.tournament.semifinals, this.tournament.final];
    const previousRound = rounds[duel.round - 1];
    if (duel.team1 && duel.team2) {
      duel.disabled = false;
    } else if (duel.team1 || duel.team2) {
      if (!this.hasDuelsInRound(previousRound)) {
        if (!duel.team1) {
          duel.team1 = 'BYE';
          duel.winner = 2;
        }
        if (!duel.team2) {
          duel.team2 = 'BYE';
          duel.winner = 1;
        }
      }
    }
  }

  /**
   * automaticAdvance()
   * Checks if there is a winner for the duel to advance the winning team to the next round.
   * If the tournament has started, the next round can be enabled.
   *
   * @param <Duel> duel
   * @param <number> index
   * @param <boolean> startedTournament
   */
  private automaticAdvance(duel: Duel, index: number, startedTournament?: boolean): void {
    const rounds = [null, this.tournament.roundOne, this.tournament.roundTwo, this.tournament.semifinals, this.tournament.final];
    const previousRound = rounds[duel.round - 1];
    if (!this.hasDuelsInRound(previousRound) || startedTournament) {
      if (duel.winner) {
        const winner = (duel.winner === 1 ? duel.team1 : duel.team2);
        const nextRound = rounds[duel.round + 1];
        if (!nextRound) {
          return;
        }

        const nextDuel = nextRound[Math.floor(index / 2)];
        if (index % 2 === 0) {
          nextDuel.team1 = winner;
        } else {
          nextDuel.team2 = winner;
        }
        if (startedTournament === true) {
          if (nextDuel.team1 && nextDuel.team2) {
            nextDuel.disabled = false;
          }
        }
      }
    }
  }

  /**
   * hasDuelsInRound()
   * Check if there is any duel enabled in the round.
   *
   * @param <Duel[]> round
   */
  private hasDuelsInRound(round: Duel[]): boolean {
    if (!round) {
      return false;
    }
    return round.some(duel => !duel.disabled);
  }

  /**
   * setDuelWinner()
   * Set the winner of the duel and advance to the next round.
   *
   * @param <Duel> duel
   */
  setDuelWinner(duel): void {
    this.automaticAdvance(duel, duel.index, true);
    this.saveTournament();
  }

  /**
   * getChampion()
   * Returns the champion of the tournament.
   */
  getChampion(): string {
    const final = this.tournament.final[0];
    if (final.winner) {
      return (final.winner === 1 ? final.team1 : final.team2);
    }
    return null;
  }

  /**
   * getChampionGoldClass()
   * Returns the CSS class name to 'Champion' label.
   */
  getChampionGoldClass(): string {
    if (this.getChampion()) {
      return 'champion-gold';
    }
    return '';
  }

  /**
   * saveTournament()
   * Stores results of ongoing tournament.
   */
  private saveTournament(): void {
    localStorage.setItem('nibo-tournament', JSON.stringify(this.tournament));
  }

  /**
   * loadTournament()
   * Loads saved tournament results.
   */
  loadTournament(): void {
    this.tournament = JSON.parse(localStorage.getItem('nibo-tournament'));
    this.modalService.dismissAll();
  }

}



