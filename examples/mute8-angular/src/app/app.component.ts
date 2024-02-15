import { AsyncPipe } from '@angular/common';
import { Component, Injectable, Signal, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { newStore } from 'mute8-angular';

import "zone.js";

const store = newStore({
  value: {
    name: "ok"
  },
  actions: {
    setName(name: string) {
      this.name = name;
    }
  }
})

@Injectable({providedIn: 'root'})
class HeroService {
  constructor() {

  }
}


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, AsyncPipe],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {

  x = inject(HeroService)

  title = "test"
  name_length: Signal<number> = store.angular.select(v => v.name.length)
  name = store.angular.useOne("name")


  constructor() {
    setInterval(() => {
      store.actions.setName(store.name + "_1")
    }, 2200)
  }

}
