import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { AlertService } from '@full-fledged/alerts';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TournamentSetup } from '../models/tournament-setup.model';

@Component({
  selector: 'app-new-tournament',
  templateUrl: './new-tournament.component.html',
  styleUrls: ['./new-tournament.component.scss']
})
export class NewTournamentComponent implements OnInit {

  public static DEFAULT_TOURNAMENT_NAMES = ['Legends Cup', 'Duel of Conquerors', 'Conquerors Cup', 'Super League', 'Super Cup'];
  public static DEFAULT_TEAM_NAMES = ['Playing Solo', 'The Flash Forces', 'Skillful Outplay Squad', 'The Enemy Dominators',
    'Potential to Damage', 'Humanoid Form Mimics', 'The Demon Remains', 'Endlessly Victorious', 'Nexus Siege Squad', 'Dragon Pit Dragons',
    'Blitzing the Base', 'The Reforged Runes', 'Karma Contrivers', 'Shy Bombers', 'Goal to Destroy', 'Web of Runes & Spells',
    'Under A.I. Control', 'Fog of War Forces', 'Magical Energy Matrix', 'In the Shadow Isles', 'Prisoners of the League',
    'Dealing the Wildcards', 'Damage Over Time', 'Sorcery Unleashed', 'Zombie Ward Network', 'Twisted Treeline Team'];

  @ViewChild('newTournamentModal') private newTournamentModal: ElementRef;
  @Input() private onSetup;

  private tournament: TournamentSetup = null;

  constructor(private modalService: NgbModal,
              private alertService: AlertService) { }

  ngOnInit(): void { }

  /**
   * open()
   * Opens modal to configure new tournament.
   */
  public open(): void {
    this.tournament = {
      name: '',
      teams: new Array(16).fill('')
    };

    this.modalService.open(this.newTournamentModal,
      {
        ariaLabelledBy: 'modal-basic-title',
        centered: true,
        animation: false,
        backdrop: 'static'
      });
  }

  /**
   * clear()
   * Clears all fields.
   */
  private clear(): void {
    this.tournament = {
      name: '',
      teams: new Array(16).fill('')
    };
  }

  /**
   * randomize()
   * Fill all fields with random values for the tournament name and the 16 teams.
   */
  private randomize(): void {
    this.clear();

    const teamNames = [...NewTournamentComponent.DEFAULT_TEAM_NAMES]
      .map((a) => ({ sort: Math.random(), value: a }))
      .sort((a, b) => a.sort - b.sort)
      .map((a) => a.value);

    const randomIndex = Math.floor(Math.random() * NewTournamentComponent.DEFAULT_TOURNAMENT_NAMES.length);
    this.tournament.name = NewTournamentComponent.DEFAULT_TOURNAMENT_NAMES[randomIndex];
    this.tournament.teams = teamNames.slice(0, 16);
  }

  /**
   * submitTournament()
   * Validates and prepares the <TournamentSetup> object to start a new tournament.
   */
  private submitTournament(): void {
    const tournament = { ...this.tournament };

    // Remove empty teams and shuffle the team list
    tournament.teams =
      tournament.teams
        .filter(t => t !== '')
        .map((a) => ({ sort: Math.random(), value: a }))
        .sort((a, b) => a.sort - b.sort)
        .map((a) => a.value);

    // Validates the name for the tournament
    if (tournament.name === '') {
      this.alertService.danger('The Name is required.');
      return;
    }

    // Validates if there are at least 2 teams
    if (tournament.teams.length < 2) {
      this.alertService.danger('Register at least two teams.');
      return;
    }

    this.onSetup(tournament);
    this.modalService.dismissAll();
  }

  /**
   * getFilledClassName()
   * Returns the class name to the filled fields.
   */
  private getFilledClassName(text): string {
    if (text && text.length) {
      return 'filled';
    }
    return '';
  }
}
