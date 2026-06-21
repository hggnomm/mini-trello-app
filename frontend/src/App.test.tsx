import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import App from './App';

describe('App Component', () => {
    it('renders Hello World title', () => {
        render(<App />);
        expect(screen.getByText('Hello World')).toBeInTheDocument();
    });
});
