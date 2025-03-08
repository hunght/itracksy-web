import { useState, useEffect, useCallback, useRef } from 'react';
import { useAtom } from 'jotai';
import {
 
  isPlayingAudioAtom,
  isPausedAudioAtom,
} from '@/state/textToSpeech';

// Global state to track the currently playing instance
let globalPlayingInstance: string | null = null;

// Storage keys for persistence
const STORAGE_KEYS = {
  CURRENT_SENTENCE: 'tts-current-sentence',
 
  INSTANCE_ID: 'tts-instance-id',
} as const;

export const useTextToSpeech = () => {
  const getInstanceId = useCallback(() => {
    // Use pathname as a stable identifier
    if (typeof window !== 'undefined') {
      return window.location.pathname;
    }
    return '';
  }, []);

  const instanceId = useRef(getInstanceId());
  const [isPausedAudio, setIsPausedAudio] = useAtom(isPausedAudioAtom);
  const [isPlayingAudio, setIsPlayingAudio] = useAtom(isPlayingAudioAtom);

  const [currentSentenceIndex, setCurrentSentenceIndex] = useState<
    number | null
  >(null);

  const sentencesRef = useRef<NodeListOf<HTMLElement> | null>(null);

  // Load saved state on mount
  useEffect(() => {
    const savedInstanceId = localStorage.getItem(STORAGE_KEYS.INSTANCE_ID);
    const savedSentenceIndex = localStorage.getItem(STORAGE_KEYS.CURRENT_SENTENCE);
 

    if (savedInstanceId === instanceId.current && savedSentenceIndex) {
      // Wait for DOM to be ready before setting the state
      setTimeout(() => {
        setCurrentSentenceIndex(parseInt(savedSentenceIndex, 10));
         
          setIsPausedAudio(true);
          setIsPlayingAudio(true);
          globalPlayingInstance = instanceId.current;
     
      }, 0);
    }
  }, []);

  // Highlight current sentence
  useEffect(() => {
    const highlightSentence = () => {
      sentencesRef.current = document.querySelectorAll('.sentence');
      if (sentencesRef.current) {
        sentencesRef.current.forEach((el, idx) => {
          if (idx === currentSentenceIndex) {
            el.classList.add('highlighted-sentence');
            const offset = 200; // pixels
            const rect = el.getBoundingClientRect();
            const isOutOfViewport =
              rect.bottom < offset || rect.top > window.innerHeight - offset;

            if (isOutOfViewport) {
              el.scrollIntoView({
                behavior: 'smooth',
                block: 'center',
              });
            }
          } else {
            el.classList.remove('highlighted-sentence');
          }
        });
      }
    };

    // Initial highlight
    highlightSentence();

    // Re-highlight when DOM updates
    const observer = new MutationObserver(highlightSentence);
    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      observer.disconnect();
    };
  }, [currentSentenceIndex]);

  // Save state when it changes
  useEffect(() => {
    // Skip effect on initial mount when currentSentenceIndex is null
    if (currentSentenceIndex === null && !isPausedAudio) {
      return;
    }

    if (currentSentenceIndex !== null) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_SENTENCE, currentSentenceIndex.toString());
      localStorage.setItem(STORAGE_KEYS.INSTANCE_ID, instanceId.current);
 
    } else {
      // Only clear storage if we're explicitly resetting (e.g., when stopping)
      if (isPlayingAudio === false && isPausedAudio === false) {
        localStorage.removeItem(STORAGE_KEYS.CURRENT_SENTENCE);
   
        localStorage.removeItem(STORAGE_KEYS.INSTANCE_ID);
      }
    }
  }, [currentSentenceIndex, isPausedAudio, isPlayingAudio]);

  // Function to start reading
  const startReading = useCallback(() => {
    sentencesRef.current = document.querySelectorAll('.sentence');

    const sentences = Array.from(sentencesRef.current).map(
      (sentence) => sentence.textContent || '',
    );

    let index = currentSentenceIndex ?? 0;
    const utterance = new SpeechSynthesisUtterance();
    const speakSentence = () => {
      if (index >= sentences.length) {
        setIsPlayingAudio(false);
        setIsPausedAudio(false);
        setCurrentSentenceIndex(null);
        if (globalPlayingInstance === instanceId.current) {
          globalPlayingInstance = null;
        }
        return;
      }

      const sentence = sentences[index];
      utterance.text = sentence;

      utterance.onstart = () => {
        setCurrentSentenceIndex(index);
      };
      utterance.onend = () => {
        index += 1;
        speakSentence();
      };

      window.speechSynthesis.speak(utterance);
    };

    return speakSentence;
  }, [currentSentenceIndex]);

  const removeLinks = useCallback((text: string) => {
    return text.replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1 ');
  }, []);

  const resetState = useCallback(() => {
    setIsPausedAudio(false);
    setIsPlayingAudio(false);
    setCurrentSentenceIndex(null);

    if (globalPlayingInstance === instanceId.current) {
      globalPlayingInstance = null;
    }

    // Clear storage when resetting
    localStorage.removeItem(STORAGE_KEYS.CURRENT_SENTENCE);
 
    localStorage.removeItem(STORAGE_KEYS.INSTANCE_ID);
  }, []);

  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  const handlePlay = useCallback(() => {
    const synth = window.speechSynthesis;

    if (globalPlayingInstance && globalPlayingInstance !== instanceId.current) {
      synth.cancel();
    }

    // Always start fresh when playing, whether it's a resume or new start
    synth.cancel();
    startReading()();

    globalPlayingInstance = instanceId.current;
    setIsPlayingAudio(true);
    setIsPausedAudio(false);
  }, [startReading]);

  const handlePause = useCallback(() => {
    if (globalPlayingInstance === instanceId.current) {
      window.speechSynthesis.pause();
      setIsPausedAudio(true);
    }
  }, []);

  const handleStop = useCallback(() => {
    if (globalPlayingInstance === instanceId.current) {
      window.speechSynthesis.cancel();
      resetState();
    }
  }, [resetState]);

  return {
    handlePlay,
    handlePause,
    handleStop,
    isPausedAudio,
    isPlayingAudio,
    removeLinks,
  };
};
