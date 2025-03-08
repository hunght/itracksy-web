import { useState, useEffect } from 'react';
import { useAtom } from 'jotai';
import { selectedVoiceAtom, voicesAtom } from '@/state/textToSpeech';

export const useVoiceSettings = () => {
  const [voices, setVoices] = useAtom(voicesAtom);
  const [selectedVoiceName, setSelectedVoiceName] = useAtom(selectedVoiceAtom);
  const [isVoicesLoaded, setIsVoicesLoaded] = useState(false);

  useEffect(() => {
    const synth = window.speechSynthesis;

    const updateVoices = () => {
      const availableVoices = synth.getVoices();
      if (availableVoices.length > 0) {
        setVoices(availableVoices);
        if (!selectedVoiceName) {
          setSelectedVoiceName(availableVoices[0].name);
        }
        setIsVoicesLoaded(true);
      }
    };

    if (voices.length === 0) {
      if (synth.onvoiceschanged !== undefined) {
        synth.onvoiceschanged = updateVoices;
      }
      updateVoices();
    } else {
      setIsVoicesLoaded(true);
    }
  }, [voices, setVoices, selectedVoiceName, setSelectedVoiceName]);

  const handleVoiceChange = (voice: SpeechSynthesisVoice) => {
    setSelectedVoiceName(voice.name);
  };

  return {
    voices,
    selectedVoiceName,
    handleVoiceChange,
    isVoicesLoaded,
  };
};
