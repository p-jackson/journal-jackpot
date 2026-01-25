import { useState, useCallback } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { Text } from '../components/ui/text';
import { useSlotMachine } from '../hooks/use-slot-machine';
import { SlotMachine } from '../components/slot-machine/slot-machine';
import { SpinButton } from '../components/slot-machine/spin-button';
import { Celebration } from '../components/slot-machine/celebration';
import { CountdownTimer } from '../components/slot-machine/countdown-timer';
import { useHistoryContext } from '../contexts/history-context';

export default function Home() {
	const {
		reels,
		loading,
		spinning,
		canSpin,
		todaysPrompt,
		nextSpinAt,
		spin,
	} = useSlotMachine();
	const { refreshHistory } = useHistoryContext();

	const [showCelebration, setShowCelebration] = useState(false);
	const [reelWords, setReelWords] = useState<(string | null)[]>([null, null, null]);
	const [allReelsStopped, setAllReelsStopped] = useState(true);

	const handleSpin = useCallback(async () => {
		if (!canSpin || spinning) return;

		setReelWords([null, null, null]);
		setAllReelsStopped(false);
		await spin();
	}, [canSpin, spinning, spin]);

	const handleAllReelsStopped = useCallback(() => {
		setAllReelsStopped(true);
		setShowCelebration(true);
	}, []);

	const handleCelebrationComplete = useCallback(() => {
		setShowCelebration(false);
		refreshHistory();
	}, [refreshHistory]);

	if (loading) {
		return (
			<View className="flex-1 items-center justify-center">
				<ActivityIndicator size="large" color="#7c3aed" />
			</View>
		);
	}

	const displayWords = todaysPrompt?.words || reelWords;

	return (
		<View className="flex-1 items-center justify-center px-4 relative">
			<Celebration
				visible={showCelebration}
				onComplete={handleCelebrationComplete}
			/>

			<View className="mb-8">
				<SlotMachine
					reels={reels}
					spinning={spinning}
					displayWords={displayWords}
					onAllReelsStopped={handleAllReelsStopped}
				/>
			</View>

			{todaysPrompt && allReelsStopped && (
				<View className="mb-8 px-4">
					<Text variant="heading-lg" className="text-center">
						“{todaysPrompt.words.join(' ')}”
					</Text>
					<Text variant="body-sm" className="text-center mt-2">
						Today's prompt
					</Text>
				</View>
			)}

			{!todaysPrompt && allReelsStopped && (
				<View className="mb-8">
					<Text variant="muted" className="text-center">
						Tap SPIN to get today's prompt
					</Text>
				</View>
			)}

			<SpinButton
				onPress={handleSpin}
				disabled={!canSpin}
				spinning={spinning || !allReelsStopped}
			/>

			{nextSpinAt && allReelsStopped && (
				<View className="mt-6">
					<CountdownTimer targetDate={nextSpinAt} />
				</View>
			)}
		</View>
	);
}
