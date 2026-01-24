import { useState, useCallback, useRef } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { Text } from '../components/ui/text';
import { useSlotMachine } from '../hooks/use-slot-machine';
import { SlotMachine } from '../components/slot-machine/slot-machine';
import { SpinButton } from '../components/slot-machine/spin-button';
import { Celebration } from '../components/slot-machine/celebration';
import { CountdownTimer } from '../components/slot-machine/countdown-timer';

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

	const [showCelebration, setShowCelebration] = useState(false);
	const [reelWords, setReelWords] = useState<(string | null)[]>([null, null, null]);
	const stoppedCountRef = useRef(0);

	const handleSpin = useCallback(async () => {
		if (!canSpin || spinning) return;

		setReelWords([null, null, null]);
		stoppedCountRef.current = 0;
		await spin();
	}, [canSpin, spinning, spin]);

	const handleReelStopped = useCallback(() => {
		stoppedCountRef.current += 1;
		if (stoppedCountRef.current === 3) {
			setShowCelebration(true);
		}
	}, []);

	const handleCelebrationComplete = useCallback(() => {
		setShowCelebration(false);
	}, []);

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
					onReelStopped={handleReelStopped}
				/>
			</View>

			{todaysPrompt && !spinning && (
				<View className="mb-8 px-4">
					<Text variant="heading-lg" className="text-center">
						“{todaysPrompt.words.join(' ')}”
					</Text>
					<Text variant="body-sm" className="text-center mt-2">
						Today's prompt
					</Text>
				</View>
			)}

			{!todaysPrompt && !spinning && (
				<View className="mb-8">
					<Text variant="muted" className="text-center">
						Tap SPIN to get today's prompt
					</Text>
				</View>
			)}

			<SpinButton
				onPress={handleSpin}
				disabled={!canSpin}
				spinning={spinning}
			/>

			{nextSpinAt && !spinning && (
				<View className="mt-6">
					<CountdownTimer targetDate={nextSpinAt} />
				</View>
			)}
		</View>
	);
}
