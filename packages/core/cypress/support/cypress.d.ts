import type { mount } from 'cypress/react18';

declare global {
  namespace Cypress {
    interface Chainable {
      mount: typeof mount;
      mousedown(x: number, y: number): Chainable<Subject>;
      mousemove(x: number, y: number): Chainable<Subject>;
      mouseup(x: number, y: number): Chainable<Subject>;
    }
  }
}
