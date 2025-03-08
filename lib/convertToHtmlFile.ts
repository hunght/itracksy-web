import { NoteAllType } from '@/types/note';
import { marked } from 'marked';
import { saveAs } from 'file-saver';
import { v4 as uuidv4 } from 'uuid';
import { TypedSupabaseClient } from '@/types/supabase';

const getNoteIds = (note: NoteAllType): string[] => {
  let ids = [note.id];

  if (note.children && note.children.length > 0) {
    note.children.forEach((childNote) => {
      ids = ids.concat(getNoteIds(childNote));
    });
  }

  return ids;
};

type PopulatedNoteTreeType = NoteAllType & {
  summary?: string | null;
  content?: string | null;
};

const getPopulatedNote = (
  note: NoteAllType,
  data: {
    id: string;
    content: string | null;
    summary: string | null;
  }[],
): PopulatedNoteTreeType => {
  const populatedNote: PopulatedNoteTreeType = { ...note };
  const noteData = data.find((item) => item.id === note.id);

  if (noteData) {
    populatedNote.summary = noteData.summary;
    populatedNote.content = noteData.content;
  }

  if (note.children && note.children.length > 0) {
    populatedNote.children = note.children.map((childNote) =>
      getPopulatedNote(childNote, data),
    );
  }

  return populatedNote;
};

// Function to download images
const downloadImage = async (url: string): Promise<Blob | null> => {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.statusText}`);
    }
    return await response.blob();
  } catch (error) {
    console.error('Error downloading image:', error);
    return null;
  }
};

// Function to convert Markdown to HTML and embed images
const convertToHtml = async (content?: string | null): Promise<string> => {
  try {
    if (!content) return '';
    let html = await Promise.resolve(marked(content));

    // Extract image URLs from Markdown content and download them
    const imageUrls = Array.from(
      content.matchAll(/!\[.*?\]\((.*?)\)/g),
      (m) => m[1],
    );
    for (const url of imageUrls) {
      const imageBlob = await downloadImage(url);
      if (imageBlob) {
        const reader = new FileReader();
        reader.readAsDataURL(imageBlob);
        await new Promise((resolve) => {
          reader.onloadend = () => {
            const base64data = reader.result as string;
            html = html.replace(url, base64data);
            resolve(null);
          };
        });
      }
    }

    return html;
  } catch (error) {
    console.error('Error converting to HTML:', error);
    return '';
  }
};

const generateTOC = (note: PopulatedNoteTreeType): string => {
  let toc = '<ul>';
  toc += `<li><a href="#${note.id}">${note.title}</a></li>`;
  if (note.children && note.children.length > 0) {
    note.children.forEach((childNote) => {
      toc += generateTOC(childNote);
    });
  }
  toc += '</ul>';
  return toc;
};

const generateContent = async (
  note: PopulatedNoteTreeType,
): Promise<string> => {
  let content = `<h1 id="${note.id}">${note.title}</h1>`;
  if (note.content) {
    content += await convertToHtml(note.content);
  }
  if (note.children && note.children.length > 0) {
    for (const childNote of note.children) {
      content += await generateContent(childNote);
    }
  }
  return content;
};

export const convertToHtmlFile = async (
  note: NoteAllType,
  supabaseClient: TypedSupabaseClient,
) => {
  const fetchNoteData = async (ids: string[]) => {
    const { data, error } = await supabaseClient
      .from('notes')
      .select('id,content,summary')
      .in('id', ids);

    if (error) {
      console.error('Error fetching notes:', error);
      return [];
    }

    return data || [];
  };

  const noteIds = getNoteIds(note);
  const data = await fetchNoteData(noteIds);
  const populatedNote = getPopulatedNote(note, data);

  const toc = generateTOC(populatedNote);
  const content = await generateContent(populatedNote);

  const htmlFileContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>${note.title || 'Note'}</title>
    </head>
    <body>
      <nav>${toc}</nav>
      <main>${content}</main>
    </body>
    </html>
  `;

  const blob = new Blob([htmlFileContent], { type: 'text/html' });
  saveAs(blob, `${note.title || 'note'}.html`);
};
