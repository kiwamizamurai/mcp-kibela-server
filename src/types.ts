export interface KibelaUser {
  id: string;
  account: string;
  realName: string;
}

export interface KibelaGroup {
  id: string;
  name: string;
  description?: string;
  isPrivate?: boolean;
  canBeManaged?: boolean;
  canBeJoinedBySelf?: boolean;
  isJoined?: boolean;
}

export interface KibelaFolder {
  id: string;
  name: string;
  fullName: string;
  path: string;
  canBeManaged?: boolean;
  parent?: {
    id: string;
    name: string;
  };
}

export interface KibelaAttachment {
  id: string;
  name: string;
  url?: string;
  dataUrl?: string;
  mimeType: string;
}

export interface KibelaNote {
  id: string;
  title: string;
  url: string;
  content?: string;
  contentHtml?: string;
  contentUpdatedAt?: string;
  publishedAt?: string;
  path?: string;
  isLikedByCurrentUser?: boolean;
  author?: KibelaUser;
  groups?: KibelaGroup[];
  folders?: {
    nodes: KibelaFolder[];
  };
  attachments?: {
    nodes: KibelaAttachment[];
  };
}

export interface NoteComment {
  id?: string;
  content: string;
  contentHtml?: string;
  author: {
    account?: string;
    realName: string;
  };
  createdAt?: string;
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

export interface NoteContentResponse {
  note: KibelaNote & {
    comments: {
      nodes: NoteComment[];
    };
  };
}

export interface GroupResponse {
  groups: {
    nodes: KibelaGroup[];
  };
}

export interface GroupFoldersResponse {
  group: {
    folders: {
      nodes: (KibelaFolder & {
        notes: {
          nodes: KibelaNote[];
        };
      })[];
    };
  };
}

export interface UsersResponse {
  users: {
    nodes: KibelaUser[];
  };
}

export interface LikeResponse {
  like: {
    clientMutationId: string;
    likers: {
      nodes: KibelaUser[];
    };
  };
}

export interface UnlikeResponse {
  unlike: {
    clientMutationId: string;
    likers: {
      nodes: KibelaUser[];
    };
  };
}

export interface RecentlyViewedNotesResponse {
  noteBrowsingHistories: {
    nodes: Array<{
      note: KibelaNote;
    }>;
  };
}

export interface NoteFromPathResponse {
  noteFromPath: KibelaNote & {
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

export interface GroupNotesResponse {
  group: {
    notes: {
      nodes: {
        id: string;
        title: string;
        contentUpdatedAt: string;
        publishedAt: string;
        author: {
          account: string;
          realName: string;
        };
      }[];
    };
  };
}

export interface FolderNotesResponse {
  folder: {
    notes: {
      nodes: {
        id: string;
        title: string;
        contentUpdatedAt: string;
        publishedAt: string;
        author: {
          account: string;
          realName: string;
        };
      }[];
    };
  };
}
