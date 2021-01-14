import { NgModule } from '@angular/core';
import { FormsModule } from "@angular/forms";
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AlertModule } from '@full-fledged/alerts';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppComponent } from './app.component';
import { DuelComponent } from './duel/duel.component';
import { NewTournamentComponent } from './new-tournament/new-tournament.component';
import { TournamentComponent } from './tournament/tournament.component';

@NgModule({
  declarations: [
    AppComponent,
    TournamentComponent,
    DuelComponent,
    NewTournamentComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FontAwesomeModule,
    NgbModule,
    FormsModule,
    AlertModule.forRoot({maxMessages: 5, timeout: 5000, positionX: 'right'})
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
