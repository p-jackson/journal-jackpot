import { View, ScrollView } from "react-native";
import { differenceInCalendarDays, format } from "date-fns";
import { Text } from "../components/ui/text";
import { usePromptStorage } from "../prompt-storage-context";
import type { HistoryEntry } from "../types";
import { HStack, VStack } from "../components/ui/stack";

function formatDate(date: Date): string {
  const diffDays = differenceInCalendarDays(new Date(), date);

  if (diffDays === 0) {
    return "Today";
  }
  if (diffDays === 1) {
    return "Yesterday";
  }
  if (diffDays <= 6) {
    return `${String(diffDays)} days ago`;
  }

  return format(date, "EEE d");
}

interface PromptCardProps {
  prompt: HistoryEntry;
  isLast: boolean;
}

function PromptTimelineItem({ prompt, isLast }: PromptCardProps) {
  return (
    <HStack justify="start">
      {/* Timeline connector */}
      <VStack gap={0} align="center" className="mr-4 mt-0.5">
        <View className="w-3 h-3 rounded-full bg-primary" />
        {!isLast && (
          <View className="flex-1 w-0.5 bg-border dark:bg-border-dark" />
        )}
      </VStack>
      {/* Card content */}
      <VStack gap={0} className="flex-1 pb-8">
        <Text variant="body-sm" className="mb-1">
          {formatDate(prompt.createdAt)}
        </Text>
        <Text className="font-mono text-base">{prompt.text}</Text>
      </VStack>
    </HStack>
  );
}

export default function History() {
  const [history] = usePromptStorage();
  const prompts = history.filter((p) => p.text.trim()).reverse();

  const pastPrompts = prompts.slice(1);

  return (
    <ScrollView className="flex-1" contentContainerClassName="p-6">
      {pastPrompts.map((prompt, index) => (
        <PromptTimelineItem
          key={prompt.createdAt.toISOString()}
          prompt={prompt}
          isLast={index === pastPrompts.length - 1}
        />
      ))}
    </ScrollView>
  );
}
