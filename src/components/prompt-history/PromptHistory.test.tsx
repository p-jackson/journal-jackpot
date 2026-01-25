import { render, screen } from '@testing-library/react-native';
import { PromptHistory } from './PromptHistory';
import type { Prompt } from '../../types';

describe('PromptHistory', () => {
	describe('empty state', () => {
		it('renders empty message when no prompts', () => {
			render(<PromptHistory prompts={[]} journeyStartDate={null} />);
			expect(screen.getByText(/no prompts yet/i)).toBeTruthy();
		});
	});

	describe('with prompts', () => {
		const mockPrompts: Prompt[] = [
			{ words: ['a', 'b', 'c'], createdAt: '2024-01-17T10:00:00.000Z' },
			{ words: ['d', 'e', 'f'], createdAt: '2024-01-16T10:00:00.000Z' },
			{ words: ['g', 'h', 'i'], createdAt: '2024-01-15T10:00:00.000Z' },
		];

		it('renders singular prompt count', () => {
			render(
				<PromptHistory
					prompts={[mockPrompts[0]]}
					journeyStartDate={mockPrompts[0].createdAt}
				/>
			);
			expect(screen.getByText(/1 prompt/i)).toBeTruthy();
		});

		it('renders plural prompt count', () => {
			render(
				<PromptHistory
					prompts={mockPrompts}
					journeyStartDate={mockPrompts[2].createdAt}
				/>
			);
			expect(screen.getByText(/3 prompts/i)).toBeTruthy();
		});

		it('renders all prompts', () => {
			render(
				<PromptHistory
					prompts={mockPrompts}
					journeyStartDate={mockPrompts[2].createdAt}
				/>
			);
			expect(screen.getByText('a · b · c')).toBeTruthy();
			expect(screen.getByText('d · e · f')).toBeTruthy();
			expect(screen.getByText('g · h · i')).toBeTruthy();
		});
	});

	describe('date formatting', () => {
		beforeEach(() => {
			jest.useFakeTimers();
			// Set to noon local time
			const now = new Date();
			now.setHours(12, 0, 0, 0);
			jest.setSystemTime(now);
		});

		afterEach(() => {
			jest.useRealTimers();
		});

		function getDateString(daysAgo: number): string {
			const date = new Date();
			date.setHours(10, 0, 0, 0);
			date.setDate(date.getDate() - daysAgo);
			return date.toISOString();
		}

		it('formats today as "Today"', () => {
			const createdAt = getDateString(0);
			const prompts: Prompt[] = [{ words: ['a', 'b', 'c'], createdAt }];
			render(
				<PromptHistory
					prompts={prompts}
					journeyStartDate={prompts[0].createdAt}
				/>
			);
			expect(screen.getByText('Today')).toBeTruthy();
		});

		it('formats yesterday as "Yesterday"', () => {
			const createdAt = getDateString(1);
			const prompts: Prompt[] = [{ words: ['a', 'b', 'c'], createdAt }];
			render(
				<PromptHistory
					prompts={prompts}
					journeyStartDate={prompts[0].createdAt}
				/>
			);
			expect(screen.getByText('Yesterday')).toBeTruthy();
		});

		it('formats 3 days ago as "3 days ago"', () => {
			const createdAt = getDateString(3);
			const prompts: Prompt[] = [{ words: ['a', 'b', 'c'], createdAt }];
			render(
				<PromptHistory
					prompts={prompts}
					journeyStartDate={prompts[0].createdAt}
				/>
			);
			expect(screen.getByText('3 days ago')).toBeTruthy();
		});

		it('formats older dates as weekday + day', () => {
			const createdAt = getDateString(9);
			const prompts: Prompt[] = [{ words: ['a', 'b', 'c'], createdAt }];
			render(
				<PromptHistory
					prompts={prompts}
					journeyStartDate={prompts[0].createdAt}
				/>
			);
			// Check that we get a weekday abbreviation followed by a number
			const date = new Date(createdAt);
			const expected = `${date.toLocaleDateString('en-US', { weekday: 'short' })} ${date.getDate()}`;
			expect(screen.getByText(expected)).toBeTruthy();
		});
	});
});
