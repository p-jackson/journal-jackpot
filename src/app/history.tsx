import { ActivityIndicator, View } from 'react-native';
import { PromptHistory } from '../components/prompt-history/PromptHistory';
import { usePromptHistory } from '../hooks/use-prompt-history';

export default function History() {
	const { prompts, loading, journeyStartDate } = usePromptHistory();

	if (loading) {
		return (
			<View className="flex-1 items-center justify-center">
				<ActivityIndicator size="large" testID="activity-indicator" />
			</View>
		);
	}

	return <PromptHistory prompts={prompts} journeyStartDate={journeyStartDate} />;
}
