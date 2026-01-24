import { Pressable, Text as RNText } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

type IoniconsName = React.ComponentProps<typeof Ionicons>['name'];

interface LinkProps {
	href: string | 'back';
	label: string;
	icon?: IoniconsName;
	iconPosition?: 'left' | 'right';
	className?: string;
}

export function Link({
	href,
	label,
	icon,
	iconPosition = 'left',
	className = '',
}: LinkProps) {
	const router = useRouter();

	const handlePress = () => {
		if (href === 'back') {
			router.back();
		} else {
			router.push(href as any);
		}
	};

	const iconElement = icon && (
		<Ionicons name={icon} size={icon === 'chevron-back' ? 20 : 16} color="#7c3aed" />
	);

	return (
		<Pressable
			onPress={handlePress}
			className={`flex-row items-center gap-1.5 px-2 py-1 rounded-lg active:bg-violet-100 dark:active:bg-violet-900 ${className}`}
		>
			{iconPosition === 'left' && iconElement}
			<RNText className="text-primary font-medium">{label}</RNText>
			{iconPosition === 'right' && iconElement}
		</Pressable>
	);
}
