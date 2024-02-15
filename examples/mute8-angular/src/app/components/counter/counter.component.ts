import { Component, Injectable, inject } from '@angular/core';
import { FormsModule, NgForm, NgModel } from '@angular/forms';
import { newStore } from 'mute8-angular';
// import { DevTools } from 'mute8-plugins';

@Injectable({ providedIn: "root" })
export class CounterService {
  readonly store = newStore({
    value: {
      count: 0,
      count2: 0,
      appName: "Angular + Mute8"
    },
    actions: {
      incrementCounter2(value: number) {
        this.count2 = this.count2 + value;
      }
    },
    // plugin: DevTools.register("counter") as any
  })

  constructor() {
    setInterval(() => {
      this.store.count = this.store.count + 100;
      this.store.count = this.store.count + 100;
    }, 100)

    setInterval(() => {
      this.store.count = this.store.count + 1;
      this.store.count = Math.floor(this.store.count * 2)

      this.store.count2 = this.store.count2 + 1000;
    }, 100)

  }
}

@Component({
  selector: 'app-counter',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './counter.component.html',
  styleUrl: './counter.component.scss'
})
export class CounterComponent {
  store = inject(CounterService).store

  full = this.store.angular.use()
  countSelect = this.store.angular.select(v => `store.angular.select() ${v.count2.toFixed(2)}`);
  count = this.store.angular.useOne("count")
  count2 = this.store.angular.useOne("count2")
  name = this.store.angular.useOne("appName")

  updateDirect(event: Event) {
    this.store.appName = (event.target as any).value
  }

}
