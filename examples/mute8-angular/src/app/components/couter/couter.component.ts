import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { newStore } from 'mute8-angular';


const store = newStore({
  value: {
    counter: 0
  },
  actions: {
    increment(value: number = 1) {
      this.counter = this.counter + value
    }
  }
})

@Component({
  selector: 'app-couter',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './couter.component.html',
  styleUrl: './couter.component.scss'
})
export class CouterComponent {

  title = "test"
  counter = store.angular.useOne("counter")

  constructor() {
    setInterval(() => {
      store.actions.increment()
    }, 20)
  }

}
