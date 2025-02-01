import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { GraphQLClient } from 'graphql-request';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
} from "@modelcontextprotocol/sdk/types.js";
import { SearchResponse, NotesResponse, NoteContentResponse } from './types.js';

if (!process.env.KIBELA_TEAM || !process.env.KIBELA_TOKEN) {
  console.error("Required environment variables KIBELA_TEAM and KIBELA_TOKEN are not set");
  process.exit(1);
}

const client = new GraphQLClient(
  `https://${process.env.KIBELA_TEAM}.kibe.la/api/v1`,
  {
    headers: { Authorization: `Bearer ${process.env.KIBELA_TOKEN}` },
  }
);

const SEARCH_NOTES_TOOL: Tool = {
  name: "kibela_search_notes",
  description: "Search Kibela notes with given query",
  inputSchema: {
    type: "object",
    properties: {
      query: {
        type: "string",
        description: "Search query"
      }
    },
    required: ["query"]
  }
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
        default: 15
      }
    }
  }
};

const GET_NOTE_CONTENT_TOOL: Tool = {
  name: "kibela_get_note_content",
  description: "Get content and comments of a specific note",
  inputSchema: {
    type: "object",
    properties: {
      id: {
        type: "string",
        description: "Note ID"
      }
    },
    required: ["id"]
  }
};

export const createServer = () => {
  const server = new Server(
    {
      name: "kibela-mcp-server",
      version: "0.1.0",
    },
    {
      capabilities: {
        tools: {},
      },
    }
  );

  server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools: [SEARCH_NOTES_TOOL, GET_MY_NOTES_TOOL, GET_NOTE_CONTENT_TOOL],
  }));

  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    try {
      const { name, arguments: args = {} } = request.params;

      switch (name) {
        case "kibela_search_notes": {
          const query = args.query as string;
          if (!query) {
            throw new Error("Query is required");
          }

          const operation = `
            query SearchNotes($query: String!) {
              search(query: $query, first: 15) {
                edges {
                  node {
                    document {
                      ... on Note {
                        id
                        title
                        url
                      }
                    }
                  }
                }
              }
            }
          `;

          const response = await client.request<SearchResponse>(operation, { query });
          const notes = response.search.edges
            .filter(edge => edge.node.document !== null)
            .map(edge => edge.node.document);

          return {
            content: [{
              type: "text",
              text: JSON.stringify(notes, null, 2)
            }]
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
                    }
                  }
                }
              }
            }
          `;

          const response = await client.request<NotesResponse>(operation, { limit });
          const notes = response.currentUser.latestNotes.edges.map(edge => edge.node);

          return {
            content: [{
              type: "text",
              text: JSON.stringify(notes, null, 2)
            }]
          };
        }

        case "kibela_get_note_content": {
          const id = args.id as string;
          if (!id) {
            throw new Error("Note ID is required");
          }
          const operation = `
            query GetNote($id: ID!) {
              note(id: $id) {
                contentHtml
                comments(first:5) {
                  nodes {
                    content
                    author {
                      realName
                    }
                  }
                }
              }
            }
          `;

          const response = await client.request<NoteContentResponse>(operation, { id });

          return {
            content: [{
              type: "text",
              text: JSON.stringify(response.note, null, 2)
            }]
          };
        }

        default:
          throw new Error(`Unknown tool: ${name}`);
      }
    } catch (error) {
      console.error("Error:", error);
      return {
        content: [{
          type: "text",
          text: `Error: ${error instanceof Error ? error.message : String(error)}`
        }],
        isError: true
      };
    }
  });

  return { server };
};