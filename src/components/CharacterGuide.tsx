import TalkingCharacter, { type CharacterAnimation, type MessageContext } from "@/components/TalkingCharacter";
import { type CharacterKey } from "@/lib/characters";
import { useIsMobile } from "@/hooks/use-mobile";

interface CharacterGuideProps {
  character: CharacterKey;
  context: MessageContext;
  animation?: CharacterAnimation;
  className?: string;
}

/**
 * A large character guide placed inside cards/sections.
 * Hides speech bubble on mobile to save space.
 */
export default function CharacterGuide({
  character,
  context,
  animation = "float",
  className = "",
}: CharacterGuideProps) {
  const isMobile = useIsMobile();

  return (
    <TalkingCharacter
      character={character}
      context={context}
      animation={animation}
      size={isMobile ? "lg" : "xl"}
      showBubble={!isMobile}
      bubblePosition="top"
      className={className}
    />
  );
}
