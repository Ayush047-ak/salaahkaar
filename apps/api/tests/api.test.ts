import app from '../src/app';

describe('Application API Health and Routes', () => {
  it('should define express app without errors', () => {
    expect(app).toBeDefined();
  });
});
