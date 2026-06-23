import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import App from './App';

describe('App Component', () => {
    it('renders login page', () => {
        render(<App />);
        expect(screen.getByText('Log in to continue')).toBeInTheDocument();
    });
});
