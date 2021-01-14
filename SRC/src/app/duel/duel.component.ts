import { Component, Input, OnInit, ViewChild, ElementRef } from '@angular/core';
import { faCrown } from '@fortawesome/free-solid-svg-icons';
import { Duel } from '../models/duel.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AlertService } from '@full-fledged/alerts';

@Component({
  selector: 'app-duel',
  templateUrl: './duel.component.html',
  styleUrls: ['./duel.component.scss']
})
export class DuelComponent implements OnInit {

  faCrown = faCrown;

  @Input() duel: Duel;
  @Input() private callback;
  @ViewChild('winnerModal') private winnerModal: ElementRef;

  round: string;
  private winner: string = null;

  constructor(private modalService: NgbModal,
              private alertService: AlertService) { }

  ngOnInit(): void {
    switch (this.duel.round) {
      case 2: this.round = 'r2'; break;
      case 3: this.round = 'semi'; break;
      case 4: this.round = 'final'; break;
      default: this.round = '';
    }
  }

  /**
   * openWinnerSelection()
   * Opens the modal to select the winner of the duel.
   */
  public openWinnerSelection(): void {
    if (this.duel.disabled || this.duel.winner) {
      return;
    }

    this.modalService.open(this.winnerModal,
      {
        ariaLabelledBy: 'modal-basic-title',
        centered: true,
        animation: false
      });
  }

  /**
   * setWinner()
   * Set the winner of the duel.
   */
  public setWinner(): void {
    if (!this.winner) {
      this.alertService.danger('Select the Winner to proceed.');
      return;
    }

    this.duel.winner = +this.winner;
    this.modalService.dismissAll();
    this.callback(this.duel);
  }

  /**
   * getHasWinnerClass()
   * Returns the class name to the duel border.
   */
  getHasWinnerClass(): string {
    if (this.duel.winner) {
      return 'border-winner';
    }
    return '';
  }

  /**
   * getDisabledClass()
   * Returns the class name to the disabled duel.
   */
  getDisabledClass(): string {
    if (this.duel.disabled) {
      return 'disabled';
    }
    return '';
  }

  /**
   * getHasWinnerClass()
   * Returns the class name to the label of winner team.
   */
  getWinnerClass(n: number): string {
    if (this.duel.winner === n) {
      return 'winner';
    }
    return '';
  }
}
