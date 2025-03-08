'use client';
import React, { ReactNode } from 'react';
import ReactMarkdown, { Components } from 'react-markdown';
import { NoteType } from '@/types/note';

import { useAtomValue } from 'jotai';
import { fontAtom, speedAtom } from '@/state/fastReadSettings';
import { CloneNoteButton } from '@/components/CloneNoteButton';
import { useState, useRef, useMemo } from 'react';
import nlp from 'compromise';
import { Button } from './ui/button';
import {
  RabbitIcon,
  TurtleIcon,
  PlayIcon,
  PauseIcon,
  XIcon,
} from 'lucide-react';
import { ReadingSettingDialog } from './ReadingSettingDialog';

import { isPausedAudioAtom, isPlayingAudioAtom } from '@/state/textToSpeech';
let currentSentence = 0;

let key = 0;
const YouTubeEmbed: React.FC<{ videoId: string }> = ({ videoId }) => (
  <div className="relative mb-4 w-full pb-[56.25%]">
    <iframe
      src={`https://www.youtube.com/embed/${videoId}`}
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
      className="absolute left-0 top-0 h-full w-full"
    />
  </div>
);

export const PublicNoteView: React.FC<{
  note: NoteType;
  isReadingMode?: boolean;
  onClose?: () => void;
}> = ({ note, isReadingMode = false, onClose }) => {
  const isPausedAudio = useAtomValue(isPausedAudioAtom);
  const isPlayingAudio = useAtomValue(isPlayingAudioAtom);
  const speed = useAtomValue(speedAtom);
  const font = useAtomValue(fontAtom);

  const fontOptions: Record<string, string> = {
    sans: 'font-sans',
    serif: 'font-serif',
    mono: 'font-mono',
  };

  const getYouTubeVideoId = (url: string | null) => {
    if (!url) return null;
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const videoId =
    note.type === 'summary-youtube-videos'
      ? getYouTubeVideoId(note.source_url)
      : null;

  const [isReading, setIsReading] = useState(false);
  const [isPausedReading, setIsPausedReading] = useState(false);
  const sentenceRefs = useRef<(HTMLSpanElement | null)[]>([]);

  const timeoutRef = useRef<NodeJS.Timeout>();

  const handleReadingProgress = () => {
    if (note.content) {
      sentenceRefs.current = Array.from(
        document.querySelectorAll<HTMLSpanElement>('.sentence'),
      );
      const maxIndex = sentenceRefs.current.length - 1;
      const currentSentenceElement = sentenceRefs.current[currentSentence];
      if (currentSentence <= maxIndex && currentSentenceElement) {
        const currentSentenceText = currentSentenceElement?.textContent || '';
        currentSentenceElement?.classList.add('highlighted-sentence');

        const offset = 200; // pixels
        const rect = currentSentenceElement.getBoundingClientRect();
        const isOutOfViewport =
          rect.bottom < offset || rect.top > window.innerHeight - offset;

        if (isOutOfViewport) {
          currentSentenceElement.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
          });
        }

        const wordCount = currentSentenceText.trim().split(/\s+/).length;
        const baseDelay = Math.max(wordCount * 200, 500);
        const adjustedDelay = baseDelay / (speed / 250);

        timeoutRef.current = setTimeout(() => {
          currentSentenceElement?.classList.remove('highlighted-sentence');
          currentSentence++;
          handleReadingProgress();
        }, adjustedDelay);

        return () => timeoutRef.current && clearTimeout(timeoutRef.current);
      } else {
        currentSentence = 0;
        setIsReading(false);
        return;
      }
    }
  };
  const processSentences = (text?: ReactNode): ReactNode[] => {
    key++;
    if (typeof text !== 'string') {
      if (Array.isArray(text)) {
        return text.map((item) => {
          if (typeof item === 'string') {
            return processSentences(item);
          }
          return (
            <span key={`non-text-${key}`} className="sentence">
              {item}
            </span>
          );
        });
      }
      return [
        <span key={`single-node-${key}`} className="sentence">
          {text}
        </span>,
      ];
    }

    const doc = nlp(text);
    const sentences = doc
      .sentences()
      .out('array')
      .filter((sentence: string) => sentence.trim());

    return sentences.map((sentence: string, idx: number) => (
      <React.Fragment key={`${key}-${idx}`}>
        <span className="sentence">{sentence}</span>
        {idx < sentences.length - 1 && ' '} {/* Add space between sentences */}
      </React.Fragment>
    ));
  };

  const markdownComponents = useMemo<Components>(
    () => ({
      p: ({ children, node, ...props }) => (
        <p {...props}>{processSentences(children)}</p>
      ),
      li: ({ children, node, ...props }) => (
        <li {...props}>{processSentences(children)}</li>
      ),
      h1: ({ children, node, ...props }) => (
        <h1 {...props}>{processSentences(children)}</h1>
      ),
      h2: ({ children, node, ...props }) => (
        <h2 {...props}>{processSentences(children)}</h2>
      ),
      h3: ({ children, node, ...props }) => (
        <h3 {...props}>{processSentences(children)}</h3>
      ),
    }),
    [],
  ); // Empty dependency array since these components don't depend on any props

  const memoizedMarkdown = useMemo(
    () => (
      <ReactMarkdown components={markdownComponents}>
        {note.content}
      </ReactMarkdown>
    ),
    [note.content, markdownComponents],
  );

  if (!note) return <div>PublicNoteView Note not found noteId</div>;
  return (
    <div className={`${fontOptions[font]} mx-auto max-w-4xl`}>
      <div className="rounded-lg p-4 transition-colors">
        <div className="mb-4 flex flex-col items-center justify-between gap-2 sm:flex-row">
          <h1 className="text-center text-2xl font-bold sm:text-left sm:text-3xl">
            {note.title}
          </h1>
        </div>

        {videoId && <YouTubeEmbed videoId={videoId} />}

        {!isReadingMode && note.summary && note.summary.length > 0 && (
          <div className="mt-4 rounded-lg bg-gray-100 p-3 dark:bg-gray-800/50 sm:p-4">
            <div className="flex flex-wrap items-center gap-2 border-b-2 border-gray-200 py-2 dark:border-gray-700">
              <h3 className="text-lg font-semibold">Summary</h3>
              <CloneNoteButton note={note} />
            </div>
            <div className="prose prose-sm max-w-none pt-4 dark:prose-invert sm:prose">
              <ReactMarkdown>{note.summary}</ReactMarkdown>
            </div>
          </div>
        )}

        {note.content && note.type !== 'summary-youtube-videos' && (
          <div className="">
            <div className="sticky top-0 z-10 flex items-center justify-between gap-2 border-b px-1 py-1 shadow-sm backdrop-blur-sm">
              <div className="flex items-center gap-2">
                {!isReadingMode && <CloneNoteButton note={note} />}

                {!isPausedAudio && !isPlayingAudio && (
                  <Button
                    onClick={() => {
                      if (isReading) {
                        if (isPausedReading) {
                          setIsPausedReading(false);
                          handleReadingProgress();
                        } else {
                          setIsPausedReading(true);
                          if (timeoutRef.current) {
                            clearTimeout(timeoutRef.current);
                          }
                        }
                      } else {
                        setIsReading(true);
                        setIsPausedReading(false);
                        handleReadingProgress();
                      }
                    }}
                    variant="default"
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    {isReading ? (
                      isPausedReading ? (
                        <>
                          <PlayIcon className="h-3.5 w-3.5" />
                          Resume
                        </>
                      ) : (
                        <>
                          <PauseIcon className="h-3.5 w-3.5" />
                          Pause
                        </>
                      )
                    ) : (
                      <>
                        <RabbitIcon className="h-3.5 w-3.5" />
                        Fast Read
                      </>
                    )}
                  </Button>
                )}

                {isReading && (
                  <Button
                    onClick={() => {
                      setIsReading(false);
                      setIsPausedReading(false);
                      if (timeoutRef.current) {
                        clearTimeout(timeoutRef.current);
                      }
                      sentenceRefs.current[currentSentence]?.classList.remove(
                        'highlighted-sentence',
                      );
                      currentSentence = 0;
                    }}
                    variant="secondary"
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <TurtleIcon className="h-3.5 w-3.5" />
                    Stop
                  </Button>
                )}
                <ReadingSettingDialog />
              </div>
              <Button
                onClick={() => {
                  setIsReading(false);
                  setIsPausedReading(false);
                  if (timeoutRef.current) {
                    clearTimeout(timeoutRef.current);
                  }
                  sentenceRefs.current[currentSentence]?.classList.remove(
                    'highlighted-sentence',
                  );
                  currentSentence = 0;
                  onClose?.();
                }}
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
              >
                <XIcon className="h-4 w-4" />
              </Button>
            </div>
            <div className="prose prose-sm max-w-none pt-4 dark:prose-invert sm:prose">
              {memoizedMarkdown}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
