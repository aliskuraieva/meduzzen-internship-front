// app.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ModalComponent } from './shared/modal/modal.component';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { changeTestString } from './core/state/app.actions';
import { selectTestString } from './core/state/app.selectors';
import { AppState } from './core/state/app.state';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule, ModalComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  isModalVisible: boolean = false;
  testString$: Observable<string>;

  constructor(private store: Store<AppState>) {
    this.testString$ = this.store.select(selectTestString);
  }

  toggleModal() {
    this.isModalVisible = !this.isModalVisible;
  }

  closeModal() {
    this.isModalVisible = false;
  }

  changeTestString() {
    this.store.dispatch(changeTestString({ newValue: 'New Test String' }));
  }
}
