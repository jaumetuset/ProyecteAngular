import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class FilterService {

  /*
    - Poder comunicar 2 components , utilizant este intermediari
    - Subject : observable y subscriptor
    - BehaviorSubject : observable y suscriptor al que se li pasa un valor
  */

  constructor() { }

  /*
    - variable de tipo beahaviorSubject que retorna un string
    - acepta , rep y envia datos
    - behaviorSubject : busqueda , igual a totes
  */

  public searchFilter: Subject<string>= new Subject();
}
