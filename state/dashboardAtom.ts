import { NoteAllType, NoteType } from '@/types/note';
import { atom } from 'jotai';

export const currentNoteIdAtom = atom<string | null>(null);
export const allNoteAtom = atom<NoteAllType[]>([]);

export const getTreeNotesAtom = atom<NoteAllType[] | null>((get) => {
  const allNotes = get(allNoteAtom);

  return buildTree(allNotes) ?? [];
});

export const getCurrentNotePathAtom = atom<string[]>((get) => {
  const currentNoteId = get(currentNoteIdAtom);
  const allNotes = get(allNoteAtom);
  if (!currentNoteId || !allNotes) {
    return [];
  }
  return findPath(allNotes, currentNoteId) ?? [];
});
export const getNoteFromTreeByIdAtom = (noteId: string) =>
  atom<NoteAllType | null>((get) => {
    const treeNotes = get(getTreeNotesAtom);
    if (!treeNotes) {
      return null;
    }
    function findNoteById(
      notes: NoteAllType[],
      id: string,
    ): NoteAllType | null {
      for (const note of notes) {
        if (note.id === id) {
          return note;
        }
        if (note.children && note.children.length > 0) {
          const foundInChildren = findNoteById(note.children, id);
          if (foundInChildren) {
            return foundInChildren;
          }
        }
      }
      return null;
    }
    return findNoteById(treeNotes, noteId);
  });

export const getObjectNotesAtom = atom<Record<string, NoteAllType>>((get) => {
  const notes = get(allNoteAtom)?.reduce(
    (acc, note) => {
      acc[note.id] = note;
      return acc;
    },
    {} as Record<string, NoteAllType>,
  );
  return notes ?? {};
});

function findPath(nodes: NoteAllType[], nodeId: string): string[] {
  const nodeMap = new Map<string, NoteAllType>();
  nodes.forEach((node) => nodeMap.set(node.id, node));

  const path: string[] = [];
  let currentId = nodeId;
  const visited = new Set<string>(); // Keep track of visited nodes

  while (currentId != null) {
    if (visited.has(currentId)) {
      break; // If the node has already been visited, break the loop to prevent a loop
    }
    visited.add(currentId);
    path.push(currentId);
    const currentNode = nodeMap.get(currentId);
    if (!currentNode || !currentNode.parent_id) {
      break; // If the node isn't found or doesn't have a parent, break the loop
    }
    currentId = currentNode.parent_id;
  }

  return path.reverse(); // Reverse to get the path from root to the node
}

function buildTree(nodesData: NoteAllType[]): NoteAllType[] {
  const nodesMap = new Map<string, NoteAllType>();
  const result: NoteAllType[] = [];

  // Initialize nodes and map them by their IDs
  nodesData.forEach((data) => {
    const node: NoteAllType = {
      ...data,
      children: data.children ?? [],
    };
    nodesMap.set(data.id, node);
  });

  // Establish parent-child relationships
  nodesMap.forEach((node) => {
    if (node.parent_id === null) {
      result.push(node); // Add root nodes to the result list
    } else {
      const parentNode = nodesMap.get(node.parent_id);
      if (parentNode && parentNode.children) {
        parentNode.children.push(node);
      }
    }
  });
  console.log('[buildTree] result', result);
  return result;
}
