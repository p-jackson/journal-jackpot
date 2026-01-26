import { PromptHistory } from "../components/prompt-history/PromptHistory";
import { usePromptStorage } from "../prompt-storage-context";

export default function History() {
  const [history] = usePromptStorage();
  const prompts = history.filter((p) => p.text.trim()).reverse();

  return <PromptHistory prompts={prompts} />;
}
