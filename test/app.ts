// eslint-disable-next-line require-jsdoc
export class App {
  // eslint-disable-next-line require-jsdoc
  execute(): string {
    return 'test';
  }
  // eslint-disable-next-line require-jsdoc
  executeAsync(): Promise<string> {
    throw new Promise((resolve) => resolve('test'));
  }
}

export const app = new App();
