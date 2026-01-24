import { View } from 'react-native';
import { Reel } from './reel';
import type { Reel as ReelType } from '../../types';

interface SlotMachineProps {
	reels: ReelType[];
	spinning: boolean;
	displayWords: (string | null)[];
	onReelStopped: () => void;
}

const STOP_DELAYS = [1000, 1800, 2600];

export function SlotMachine({
	reels,
	spinning,
	displayWords,
	onReelStopped,
}: SlotMachineProps) {
	return (
		<View className="flex-row gap-2">
			{reels.map((reel, index) => (
				<Reel
					key={reel.id}
					reel={reel}
					spinning={spinning}
					stopDelay={STOP_DELAYS[index]}
					selectedWord={displayWords[index]}
					onStopped={onReelStopped}
				/>
			))}
		</View>
	);
}
