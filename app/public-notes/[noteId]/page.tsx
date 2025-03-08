import { Metadata, ResolvingMetadata } from 'next';
import { createClient } from '@/lib/supabase/server';

import { getURL } from '@/utils/url';

import { markdownToPlainText } from '@/utils/markdown';
import { PublicNoteView } from '@/components/PublicNoteView';

function getYouTubeVideoId(url: string): string | null {
  const regExp =
    /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
}

function getYouTubeThumbnail(videoId: string): string {
  return `https://img.youtube.com/vi/${videoId}/0.jpg`;
}

function extractImageFromContent(content: string): string | null {
  const imgRegex = /!\[.*?\]\((.*?)\)/;
  const match = content.match(imgRegex);
  return match ? match[1] : null;
}

export async function generateMetadata(
  { params }: { params: { noteId: string } },
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const id = params.noteId;
  console.log('Generating metadata for note:', id);

  const supabase = createClient();
  const { data: note, error } = await supabase
    .from('notes')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching note:', error);
    return {
      title: 'Error fetching note',
      description: 'There was an error retrieving the note.',
    };
  }

  if (!note) {
    return {
      title: `generateMetadata Note Not Found ${id}`,
      description: 'The requested note could not be found.',
    };
  }

  const title = note.title || 'Untitled Note';

  // Generate an engaging description
  let contentPreview = note.summary
    ? markdownToPlainText(note.summary)
    : note.content
      ? markdownToPlainText(note.content)
      : '';

  contentPreview = contentPreview.substring(0, 150); // Limit to 150 characters for the content preview

  let engagingIntro = 'Dive into this insightful note: ';
  if (note.type === 'summary-youtube-videos') {
    engagingIntro = 'Explore this YouTube video summary: ';
  }

  const description = `${engagingIntro}${contentPreview}...`;

  const url = getURL(`/public-notes/${id}`);

  // Handle image for sharing
  let imageUrl: string | null = null;

  if (note.type === 'summary-youtube-videos' && note.source_url) {
    const videoId = getYouTubeVideoId(note.source_url);
    if (videoId) {
      imageUrl = getYouTubeThumbnail(videoId);
    }
  } else if (note.content) {
    imageUrl = extractImageFromContent(note.content);
  }

  // Fallback image if no specific image is found
  const fallbackImage = getURL('/images/default-share-image.jpg');

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      type: 'article',
      images: imageUrl ? [{ url: imageUrl }] : [{ url: fallbackImage }],
      siteName: 'BubbyBeep',
      locale: 'en_US',
      publishedTime: note.created_at,
      modifiedTime: note.updated_at,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: imageUrl ? [imageUrl] : [fallbackImage],
    },
  };
}

export default async function PublicNotePage({
  params,
}: {
  params: { noteId: string };
}) {
  const id = params.noteId;
  const supabase = createClient();

  if (!id) {
    return <div>PublicNotePage Note not found {`params: ${params}`}</div>;
  }
  const { data: note } = await supabase
    .from('notes')
    .select('*')
    .eq('id', id)
    .single();
  if (!note) {
    return <div>PublicNotePage {`PublicNotePage id: ${id}`}</div>;
  }
  return (
    <>
      <PublicNoteView note={note} />
      {note.source_url && (
        <div className="mt-4 text-center">
          <a
            href={note.source_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 underline hover:text-blue-700"
          >
            View Original Source
          </a>
        </div>
      )}
    </>
  );
}
