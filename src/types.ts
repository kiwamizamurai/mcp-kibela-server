export interface KibelaNote {
  id: string;
  title: string;
  url: string;
  content?: string;
}

export interface SearchResponse {
  search: {
    edges: Array<{
      node: {
        document: KibelaNote | null;
      };
    }>;
  };
}

export interface NotesResponse {
  currentUser: {
    latestNotes: {
      totalCount: number;
      edges: Array<{
        node: KibelaNote;
      }>;
    };
  };
}

export interface NoteComment {
  content: string;
  author: {
    realName: string;
  };
}

export interface NoteContentResponse {
  note: {
    contentHtml: string;
    comments: {
      nodes: NoteComment[];
    };
  };
}

export interface KibelaToolRequest {
  params: {
    name: string;
    arguments?: Record<string, unknown>;
    _meta?: {
      progressToken?: string | number;
    };
  };
  method: "tools/call";
}