import { View, ScrollView } from 'react-native';
import { Text } from '../ui/text';
import type { SavedPrompt } from '../../types';

interface PromptHistoryProps {
	prompts: SavedPrompt[];
}

function formatDate(dateString: string): string {
	const date = new Date(dateString);
	const now = new Date();
	const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
	const dateDay = new Date(
		date.getFullYear(),
		date.getMonth(),
		date.getDate()
	);

	const diffMs = today.getTime() - dateDay.getTime();
	const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

	if (diffDays === 0) return 'Today';
	if (diffDays === 1) return 'Yesterday';
	if (diffDays <= 6) return `${diffDays} days ago`;

	const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
	return `${dayName} ${date.getDate()}`;
}

function EmptyState() {
	return (
		<View className="flex-1 items-center justify-center px-8">
			<Text className="text-4xl mb-4">📝</Text>
			<Text variant="muted" className="text-center">
				No prompts yet. Spin the slot machine to get your first writing prompt!
			</Text>
		</View>
	);
}

interface PromptCardProps {
	prompt: SavedPrompt;
	isLast: boolean;
}

function PromptCard({ prompt, isLast }: PromptCardProps) {
	return (
		<View className="flex-row">
			{/* Timeline connector */}
			<View className="items-center mr-4 mt-0.5">
				<View className="w-3 h-3 rounded-full bg-primary" />
				{!isLast && <View className="flex-1 w-0.5 bg-border dark:bg-border-dark" />}
			</View>
			{/* Card content */}
			<View className="flex-1 pb-6">
				<Text variant="body-sm" className="mb-1">
					{formatDate(prompt.createdAt)}
				</Text>
				<Text className="font-mono text-base">
					{prompt.text}
				</Text>
			</View>
		</View>
	);
}

export function PromptHistory({ prompts }: PromptHistoryProps) {
	if (prompts.length === 0) {
		return <EmptyState />;
	}

	const pastPrompts = prompts.slice(1);

	return (
		<ScrollView className="flex-1" contentContainerClassName="px-4 py-6">
			{pastPrompts.map((prompt, index) => (
				<PromptCard
					key={prompt.createdAt}
					prompt={prompt}
					isLast={index === pastPrompts.length - 1}
				/>
			))}
		</ScrollView>
	);
}
