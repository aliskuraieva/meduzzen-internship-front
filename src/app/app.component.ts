import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { ModalComponent } from './shared/modal/modal.component';
import { changeTestString } from './core/state/app.actions';
import { selectTestString } from './core/state/app.selectors';
import { AppState } from './core/state/app.state';
import { environment } from '../environments/environment';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule, ModalComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  isModalVisible = false;
  readonly testString$: Observable<string>;
  readonly apiUrl = environment.apiUrl;
  constructor(private store: Store<AppState>) {
    this.testString$ = this.store.select(selectTestString);
    console.log('Backend API URL:', this.apiUrl);
  }

  toggleModal(): void {
    this.isModalVisible = !this.isModalVisible;
  }

  closeModal(): void {
    this.isModalVisible = false;
  }

  changeTestString(): void {
    this.store.dispatch(changeTestString({ newTestString: 'New Test String' }));
  }
}
