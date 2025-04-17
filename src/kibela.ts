import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { CallToolRequestSchema, ListToolsRequestSchema, Tool } from "@modelcontextprotocol/sdk/types.js";
import { GraphQLClient } from "graphql-request";
import {
  FolderNotesResponse,
  GroupFoldersResponse,
  GroupNotesResponse,
  GroupResponse,
  LikeResponse,
  NoteContentResponse,
  NoteFromPathResponse,
  NotesResponse,
  RecentlyViewedNotesResponse,
  SearchResponse,
  UnlikeResponse,
  UsersResponse,
} from "./types.js";

if (!process.env.KIBELA_TEAM || !process.env.KIBELA_TOKEN) {
  console.error("Required environment variables KIBELA_TEAM and KIBELA_TOKEN are not set");
  process.exit(1);
}

const client = new GraphQLClient(`https://${process.env.KIBELA_TEAM}.kibe.la/api/v1`, {
  headers: { Authorization: `Bearer ${process.env.KIBELA_TOKEN}` },
});

const SEARCH_NOTES_TOOL: Tool = {
  name: "kibela_search_notes",
  description: "Search Kibela notes with given query",
  inputSchema: {
    type: "object",
    properties: {
      query: { type: "string", description: "Search query" },
      coediting: { type: "boolean", description: "Filter by co-editing status" },
      isArchived: { type: "boolean", description: "Filter by archive status" },
      sortBy: { type: "string", description: "Sort by (RELEVANT, CONTENT_UPDATED_AT)" },
      userIds: { type: "array", items: { type: "string" }, description: "Filter by user IDs" },
      folderIds: { type: "array", items: { type: "string" }, description: "Filter by folder IDs" },
    },
    required: ["query"],
  },
};

const GET_MY_NOTES_TOOL: Tool = {
  name: "kibela_get_my_notes",
  description: "Get your latest notes from Kibela",
  inputSchema: {
    type: "object",
    properties: {
      limit: {
        type: "number",
        description: "Number of notes to fetch (max 50)",
        default: 15,
      },
    },
  },
};

const GET_NOTE_CONTENT_TOOL: Tool = {
  name: "kibela_get_note_content",
  description: "Get content and comments of a specific note",
  inputSchema: {
    type: "object",
    properties: {
      id: { type: "string", description: "Note ID" },
      include_image_data: {
        type: "boolean",
        description: "Whether to include image data URLs in the response",
        default: false,
      },
    },
    required: ["id"],
  },
};

const GET_GROUPS_TOOL: Tool = {
  name: "kibela_get_groups",
  description: "Get list of accessible groups",
  inputSchema: {
    type: "object",
    properties: {},
  },
};

const GET_GROUP_FOLDERS_TOOL: Tool = {
  name: "kibela_get_group_folders",
  description: "Get folders in a group",
  inputSchema: {
    type: "object",
    properties: {
      groupId: { type: "string", description: "Group ID" },
      parentFolderId: { type: "string", description: "Parent folder ID" },
    },
    required: ["groupId"],
  },
};

const GET_GROUP_NOTES_TOOL: Tool = {
  name: "kibela_get_group_notes",
  description: "Get notes in a group that are not attached to any folder",
  inputSchema: {
    type: "object",
    properties: {
      groupId: { type: "string", description: "Group ID" },
    },
    required: ["groupId"],
  },
};

const GET_FOLDER_NOTES_TOOL: Tool = {
  name: "kibela_get_folder_notes",
  description: "Get notes in a folder",
  inputSchema: {
    type: "object",
    properties: {
      folderId: { type: "string", description: "Folder ID" },
    },
    required: ["folderId"],
  },
};

const GET_USERS_TOOL: Tool = {
  name: "kibela_get_users",
  description: "Get list of users",
  inputSchema: {
    type: "object",
    properties: {},
  },
};

const LIKE_NOTE_TOOL: Tool = {
  name: "kibela_like_note",
  description: "Like a note",
  inputSchema: {
    type: "object",
    properties: {
      noteId: { type: "string", description: "Note ID" },
    },
    required: ["noteId"],
  },
};

const UNLIKE_NOTE_TOOL: Tool = {
  name: "kibela_unlike_note",
  description: "Unlike a note",
  inputSchema: {
    type: "object",
    properties: {
      noteId: { type: "string", description: "Note ID" },
    },
    required: ["noteId"],
  },
};

const GET_RECENTLY_VIEWED_NOTES_TOOL: Tool = {
  name: "kibela_get_recently_viewed_notes",
  description: "Get your recently viewed notes",
  inputSchema: {
    type: "object",
    properties: {
      limit: {
        type: "number",
        description: "Number of notes to fetch (max 15)",
        default: 15,
      },
    },
  },
};

const GET_NOTE_FROM_PATH_TOOL: Tool = {
  name: "kibela_get_note_from_path",
  description: "Get note content by its URL",
  inputSchema: {
    type: "object",
    properties: {
      path: { type: "string", description: "Note path (e.g. 'https://${process.env.KIBELA_TEAM}.kibe.la/notes/5154')" },
      include_image_data: {
        type: "boolean",
        description: "Whether to include image data URLs in the response",
        default: false,
      },
    },
    required: ["path"],
  },
};

export const createServer = () => {
  const server = new Server(
    {
      name: "kibela-mcp-server",
      version: "1.0.0",
    },
    {
      capabilities: {
        tools: {},
      },
    },
  );

  server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools: [
      SEARCH_NOTES_TOOL,
      GET_MY_NOTES_TOOL,
      GET_NOTE_CONTENT_TOOL,
      GET_GROUPS_TOOL,
      GET_GROUP_FOLDERS_TOOL,
      GET_GROUP_NOTES_TOOL,
      GET_FOLDER_NOTES_TOOL,
      GET_USERS_TOOL,
      LIKE_NOTE_TOOL,
      UNLIKE_NOTE_TOOL,
      GET_RECENTLY_VIEWED_NOTES_TOOL,
      GET_NOTE_FROM_PATH_TOOL,
    ],
  }));

  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    try {
      const { name, arguments: args = {} } = request.params;

      switch (name) {
        case "kibela_search_notes": {
          const { query, coediting, isArchived, sortBy, userIds, folderIds } = args as {
            query: string;
            coediting?: boolean;
            isArchived?: boolean;
            sortBy?: string;
            userIds?: string[];
            folderIds?: string[];
          };

          const operation = `
            query SearchNotes(
              $query: String!,
              $coediting: Boolean,
              $isArchived: Boolean,
              $sortBy: SearchSortKind,
              $userIds: [ID!],
              $folderIds: [ID!]
            ) {
              search(
                query: $query,
                first: 15,
                coediting: $coediting,
                isArchived: $isArchived,
                sortBy: $sortBy,
                userIds: $userIds,
                folderIds: $folderIds
              ) {
                edges {
                  node {
                    document {
                      ... on Note {
                        id
                        title
                        url
                        contentUpdatedAt
                        author {
                          id
                          account
                          realName
                        }
                        groups {
                          id
                          name
                        }
                      }
                    }
                  }
                }
              }
            }
          `;

          const response = await client.request<SearchResponse>(operation, {
            query,
            coediting,
            isArchived,
            sortBy,
            userIds,
            folderIds,
          });

          const notes = response.search.edges
            .filter((edge) => edge.node.document !== null)
            .map((edge) => edge.node.document);

          return {
            content: [
              {
                type: "text",
                text: JSON.stringify(notes, null, 2),
              },
            ],
          };
        }

        case "kibela_get_my_notes": {
          const limit = (args.limit as number) || 15;
          const operation = `
            query GetMyNotes($limit: Int!) {
              currentUser {
                latestNotes(first: $limit) {
                  totalCount
                  edges {
                    node {
                      id
                      title
                      url
                      contentUpdatedAt
                      author {
                        id
                        account
                        realName
                      }
                    }
                  }
                }
              }
            }
          `;

          const response = await client.request<NotesResponse>(operation, { limit });
          const notes = response.currentUser.latestNotes.edges.map((edge) => edge.node);

          return {
            content: [
              {
                type: "text",
                text: JSON.stringify(notes, null, 2),
              },
            ],
          };
        }

        case "kibela_get_note_content": {
          const id = args.id as string;
          const includeImageData = (args.include_image_data as boolean) || false;

          const attachmentsFragment = includeImageData
            ? `attachments(first: 3) {
                  nodes {
                    id
                    name
                    dataUrl
                    mimeType
                  }
                }`
            : "";

          const operation = `
            query GetNote($id: ID!) {
              note(id: $id) {
                id
                title
                content
                contentHtml
                contentUpdatedAt
                publishedAt
                url
                path
                isLikedByCurrentUser
                ${attachmentsFragment}
                author {
                  id
                  account
                  realName
                }
                groups {
                  id
                  name
                }
                folders(first: 3) {
                  nodes {
                    id
                    name
                    fullName
                    path
                  }
                }
                comments(first: 3) {
                  nodes {
                    id
                    content
                    contentHtml
                    author {
                      account
                      realName
                    }
                    createdAt
                  }
                }
              }
            }
          `;

          const response = await client.request<NoteContentResponse>(operation, { id });
          return {
            content: [
              {
                type: "text",
                text: JSON.stringify(response.note, null, 2),
              },
            ],
          };
        }

        case "kibela_get_groups": {
          const operation = `
            query GetGroups {
              groups(first: 10, ability: READABLE) {
                nodes {
                  id
                  name
                  description
                  isPrivate
                  canBeManaged
                  canBeJoinedBySelf
                  isJoined
                }
              }
            }
          `;

          const response = await client.request<GroupResponse>(operation);
          return {
            content: [
              {
                type: "text",
                text: JSON.stringify(response.groups.nodes, null, 2),
              },
            ],
          };
        }

        case "kibela_get_group_folders": {
          const { groupId, parentFolderId } = args as {
            groupId: string;
            parentFolderId?: string;
          };

          const operation = `
            query GetGroupFolders($groupId: ID!, $parentFolderId: ID) {
              group(id: $groupId) {
                folders(first: 30, active: true, parentFolderId: $parentFolderId) {
                  nodes {
                    id
                    name
                    fullName
                    path
                    canBeManaged
                    parent {
                      id
                      name
                    }
                    notes(first: 10, active: true, orderBy: { field: CONTENT_UPDATED_AT, direction: DESC }) {
                      nodes {
                        id
                        title
                        contentUpdatedAt
                        publishedAt
                        author {
                          account
                          realName
                        }
                      }
                    }
                  }
                }
              }
            }
          `;

          const response = await client.request<GroupFoldersResponse>(operation, {
            groupId,
            parentFolderId,
          });

          return {
            content: [
              {
                type: "text",
                text: JSON.stringify(response.group.folders.nodes, null, 2),
              },
            ],
          };
        }

        case "kibela_get_group_notes": {
          const { groupId } = args as { groupId: string };

          const operation = `
            query GetGroupNotes($groupId: ID!) {
              group(id: $groupId) {
                notes(first: 10, active: true, onlyNotAttachedFolder: true, orderBy: { field: CONTENT_UPDATED_AT, direction: DESC }) {
                  nodes {
                    id
                    title
                    contentUpdatedAt
                    publishedAt
                    author {
                      account
                      realName
                    }
                  }
                }
              }
            }
          `;

          const response = await client.request<GroupNotesResponse>(operation, { groupId });
          return {
            content: [
              {
                type: "text",
                text: JSON.stringify(response.group.notes.nodes, null, 2),
              },
            ],
          };
        }

        case "kibela_get_folder_notes": {
          const { folderId } = args as { folderId: string };

          const operation = `
            query GetFolderNotes($folderId: ID!) {
              folder(id: $folderId) {
                notes(first: 10, active: true, orderBy: { field: CONTENT_UPDATED_AT, direction: DESC }) {
                  nodes {
                    id
                    title
                    contentUpdatedAt
                    publishedAt
                    author {
                      account
                      realName
                    }
                  }
                }
              }
            }
          `;

          const response = await client.request<FolderNotesResponse>(operation, { folderId });
          return {
            content: [
              {
                type: "text",
                text: JSON.stringify(response.folder.notes.nodes, null, 2),
              },
            ],
          };
        }

        case "kibela_get_users": {
          const operation = `
            query GetUsers {
              users(first: 100) {
                nodes {
                  id
                  account
                  realName
                }
              }
            }
          `;

          const response = await client.request<UsersResponse>(operation);
          return {
            content: [
              {
                type: "text",
                text: JSON.stringify(response.users.nodes, null, 2),
              },
            ],
          };
        }

        case "kibela_like_note": {
          const noteId = args.noteId as string;
          const operation = `
            mutation LikeNote($input: LikeInput!) {
              like(input: $input) {
                clientMutationId
                likers(first: 3) {
                  nodes {
                    id
                    account
                    realName
                  }
                }
              }
            }
          `;

          const response = await client.request<LikeResponse>(operation, {
            input: { noteId },
          });

          return {
            content: [
              {
                type: "text",
                text: JSON.stringify(response.like, null, 2),
              },
            ],
          };
        }

        case "kibela_unlike_note": {
          const noteId = args.noteId as string;
          const operation = `
            mutation UnlikeNote($input: UnlikeInput!) {
              unlike(input: $input) {
                clientMutationId
                likers(first: 10) {
                  nodes {
                    id
                    account
                    realName
                  }
                }
              }
            }
          `;

          const response = await client.request<UnlikeResponse>(operation, {
            input: { noteId },
          });

          return {
            content: [
              {
                type: "text",
                text: JSON.stringify(response.unlike, null, 2),
              },
            ],
          };
        }

        case "kibela_get_recently_viewed_notes": {
          const limit = (args.limit as number) || 15;
          const operation = `
            query GetRecentlyViewedNotes($limit: Int!) {
              noteBrowsingHistories(first: $limit) {
                nodes {
                  note {
                    id
                    title
                    url
                    contentUpdatedAt
                    author {
                      id
                      account
                      realName
                    }
                  }
                }
              }
            }
          `;

          const response = await client.request<RecentlyViewedNotesResponse>(operation, { limit });
          const notes = response.noteBrowsingHistories.nodes.map((node) => node.note);

          return {
            content: [
              {
                type: "text",
                text: JSON.stringify(notes, null, 2),
              },
            ],
          };
        }

        case "kibela_get_note_from_path": {
          const rawPath = args.path as string;
          const includeImageData = (args.include_image_data as boolean) || false;
          // Extract path from URL if full URL is provided
          const path = rawPath.includes("kibe.la/notes/") ? `/notes/${rawPath.split("/notes/")[1]}` : rawPath;

          const attachmentsFragment = includeImageData
            ? `attachments(first: 3) {
                  nodes {
                    id
                    name
                    dataUrl
                    mimeType
                  }
                }`
            : "";

          const operation = `            query GetNoteFromPath($path: String!) {
              noteFromPath(path: $path) {
                id
                title
                content
                contentHtml
                contentUpdatedAt
                publishedAt
                url
                path
                isLikedByCurrentUser
                ${attachmentsFragment}
                author {
                  id
                  account
                  realName
                }
                groups {
                  id
                  name
                }
                folders(first: 3) {
                  nodes {
                    id
                    name
                    fullName
                    path
                  }
                }
                comments(first: 3) {
                  nodes {
                    id
                    content
                    contentHtml
                    author {
                      account
                      realName
                    }
                    createdAt
                  }
                }
              }
            }
          `;

          const response = await client.request<NoteFromPathResponse>(operation, { path });
          return {
            content: [
              {
                type: "text",
                text: JSON.stringify(response.noteFromPath, null, 2),
              },
            ],
          };
        }

        default:
          throw new Error(`Unknown tool: ${name}`);
      }
    } catch (error) {
      console.error("Error:", error);
      return {
        content: [
          {
            type: "text",
            text: `Error: ${error instanceof Error ? error.message : String(error)}`,
          },
        ],
        isError: true,
      };
    }
  });

  return { server };
};
