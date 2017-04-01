import { Injectable } from '@angular/core';
import { isNullOrUndefined } from 'util';

@Injectable()
export class Spinner {

  private _selector: string = 'preloader';
  private _element: HTMLElement = null;

  constructor() {
    this.getElementIfNull();
  }

  public show(): void {
    this.getElementIfNull();
    this._element.style['display'] = 'block';
  }

  public hide(delay: number = 0): void {
    this.getElementIfNull();
    setTimeout(() => {
      this._element.style['display'] = 'none';
    }, delay);
  }

  private getElementIfNull() {
    if (isNullOrUndefined(this._element)) {
      this._element = document.getElementById(this._selector);
    }
  }
}
