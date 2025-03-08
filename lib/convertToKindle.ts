import { NoteAllType } from '@/types/note';
import { marked } from 'marked';
import { saveAs } from 'file-saver';
import { v4 as uuidv4 } from 'uuid';
import { TypedSupabaseClient } from '@/types/supabase';
import JSZip from 'jszip';

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

const createContentOpf = (note: PopulatedNoteTreeType): string => {
  let manifest = '';
  let spine = '';

  const addToManifestAndSpine = (n: PopulatedNoteTreeType) => {
    const id = `note-${n.id}`;
    manifest += `<item id="${id}" href="${id}.xhtml" media-type="application/xhtml+xml"/>`;
    spine += `<itemref idref="${id}"/>`;

    n.children?.forEach(addToManifestAndSpine);
  };

  addToManifestAndSpine(note);

  return `<?xml version="1.0" encoding="UTF-8"?>
    <package xmlns="http://www.idpf.org/2007/opf" unique-identifier="BookID" version="2.0">
      <metadata xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:opf="http://www.idpf.org/2007/opf">
        <dc:title>${note.title || 'Notes'}</dc:title>
        <dc:language>en</dc:language>
        <dc:identifier id="BookID" opf:scheme="UUID">urn:uuid:${uuidv4()}</dc:identifier>
      </metadata>
      <manifest>
        <item id="ncx" href="toc.ncx" media-type="application/x-dtbncx+xml"/>
        ${manifest}
      </manifest>
      <spine toc="ncx">
        ${spine}
      </spine>
    </package>`;
};

const createTocNcx = (note: PopulatedNoteTreeType): string => {
  let playOrder = 1;

  const addNavPoint = (n: PopulatedNoteTreeType, level: number = 0): string => {
    const indent = '  '.repeat(level + 2);
    const childNavPoints =
      n.children?.map((child) => addNavPoint(child, level + 1)).join('') || '';

    return `
${indent}<navPoint id="navPoint-${playOrder}" playOrder="${playOrder++}">
${indent}  <navLabel>
${indent}    <text>${n.title}</text>
${indent}  </navLabel>
${indent}  <content src="note-${n.id}.xhtml"/>
${childNavPoints}
${indent}</navPoint>`;
  };

  const navPoints = addNavPoint(note);

  return `<?xml version="1.0" encoding="UTF-8"?>
<ncx xmlns="http://www.daisy.org/z3986/2005/ncx/" version="2005-1">
  <head>
    <meta name="dtb:uid" content="urn:uuid:${uuidv4()}"/>
    <meta name="dtb:depth" content="1"/>
    <meta name="dtb:totalPageCount" content="0"/>
    <meta name="dtb:maxPageNumber" content="0"/>
  </head>
  <docTitle>
    <text>${note.title || 'Notes'}</text>
  </docTitle>
  <navMap>${navPoints}
  </navMap>
</ncx>`;
};

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

const convertToHtml = async (
  content?: string | null,
  oebps?: JSZip,
): Promise<string> => {
  try {
    if (!content) return '';
    let html = marked(content);
    if (html instanceof Promise) {
      return html.then((html) => html);
    }

    // Extract image URLs from Markdown content and download them
    const imageUrls = Array.from(
      content.matchAll(/!\[.*?\]\((.*?)\)/g),
      (m) => m[1],
    );
    for (const url of imageUrls) {
      const imageBlob = await downloadImage(url);
      if (imageBlob && oebps) {
        const imageName = `images/${uuidv4()}.png`;
        oebps.file(imageName, imageBlob);
        html = html.replace(url, imageName);
      }
    }

    return html;
  } catch (error) {
    console.error('Error converting to HTML:', error);
    return '';
  }
};

const addContentFiles = async (oebps: JSZip, note: PopulatedNoteTreeType) => {
  const addFile = async (n: PopulatedNoteTreeType) => {
    const content = `<?xml version="1.0" encoding="UTF-8"?>
      <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1//EN" "http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd">
      <html xmlns="http://www.w3.org/1999/xhtml">
      <head>
        <title>${n.title}</title>
        <style type="text/css">
          body { font-family: Arial, sans-serif; }
          h1 { color: #333; }
          .summary { background-color: #f0f0f0; padding: 10px; margin-top: 20px; }
        </style>
      </head>
      <body>
        <h1>${n.title}</h1>
        ${await convertToHtml(n.content, oebps)}
        ${n.summary ? `<div class="summary"><h2>Summary</h2>${await convertToHtml(n.summary, oebps)}</div>` : ''}
      </body>
      </html>`;

    oebps.file(`note-${n.id}.xhtml`, content);

    if (n.children) {
      for (const child of n.children) {
        await addFile(child);
      }
    }
  };

  await addFile(note);
};

export const convertToKindle = async (
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

  // Create EPUB content
  const zip = new JSZip();

  // Add mimetype file
  zip.file('mimetype', 'application/epub+zip');

  // Add container.xml
  zip.file(
    'META-INF/container.xml',
    `<?xml version="1.0" encoding="UTF-8"?>
    <container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container">
      <rootfiles>
        <rootfile full-path="OEBPS/content.opf" media-type="application/oebps-package+xml"/>
      </rootfiles>
    </container>`,
  );

  // Create OEBPS folder
  const oebps = zip.folder('OEBPS');
  if (!oebps) throw new Error('Failed to create OEBPS folder');

  // Add content.opf
  const contentOpf = createContentOpf(populatedNote);
  oebps.file('content.opf', contentOpf);

  // Add toc.ncx
  const tocNcx = createTocNcx(populatedNote);
  oebps.file('toc.ncx', tocNcx);

  // Add content files
  await addContentFiles(oebps, populatedNote);

  // Generate EPUB file
  const epubBlob = await zip.generateAsync({
    type: 'blob',
    mimeType: 'application/epub+zip',
  });

  // Save the file
  saveAs(epubBlob, `${populatedNote.title || 'notes'}.epub`);
};
