import { render, screen } from '@testing-library/react';
import App from './App';

test('renders smart parking heading', () => {
  render(<App />);
  const headingElement = screen.getByText(/Smart Car Parking Management System/i);
  expect(headingElement).toBeInTheDocument();
});

test('renders welcome message', () => {
  render(<App />);
  const welcomeElement = screen.getByText(/Welcome to the Enderase Smart Parking System/i);
  expect(welcomeElement).toBeInTheDocument();
});
