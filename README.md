# Kibela MCP Server
[![smithery badge](https://smithery.ai/badge/@kiwamizamurai/mcp-kibela-server)](https://smithery.ai/server/@kiwamizamurai/mcp-kibela-server)

MCP server implementation for Kibela API integration, enabling LLMs to interact with Kibela content.

<img width="320" alt="Example" src="https://github.com/user-attachments/assets/eeed8f45-eb24-456d-bb70-9e738aa1bfb3" />

<a href="https://glama.ai/mcp/servers/m21nkeig1p"><img width="380" height="200" src="https://glama.ai/mcp/servers/m21nkeig1p/badge" alt="Kibela Server MCP server" /></a>

## Features

- Search notes
- Get your latest notes
- Get note content and comments

## Configuration

### Environment Variables

- `KIBELA_TEAM`: Your Kibela team name (required)
- `KIBELA_TOKEN`: Your Kibela API token (required)

### Usage with Claude Desktop

Add to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "kibela": {
      "command": "npx",
      "args": ["-y", "@kiwamizamurai/mcp-kibela-server"],
      "env": {
        "KIBELA_TEAM": "your-team",
        "KIBELA_TOKEN": "your-token"
      }
    }
  }
}
```

## Cursor Integration

Add to your `~/.cursor/config.json`:

```json
{
  "mcp": {
    "servers": {
      "kibela": {
        "command": "node",
        "args": ["dist/src/index.js"],
        "env": {
          "KIBELA_TEAM": "your-team",
          "KIBELA_TOKEN": "your-token"
        }
      }
    }
  }
}
```

For SSE transport, ensure the server URL is set to: `http://localhost:3000/sse`

## Tools

### kibela_search_notes
Search Kibela notes with given query
- Input:
  - `query` (string): Search query
- Returns: List of matching notes with ID, title and URL

### kibela_get_my_notes
Get your latest notes from Kibela
- Input:
  - `limit` (number, optional): Number of notes to fetch (default: 15)
- Returns: List of your latest notes

### kibela_get_note_content
Get content and comments of a specific note
- Input:
  - `id` (string): Note ID
- Returns: Note content in HTML format and recent comments

## Reference
1. https://modelcontextprotocol.info/docs/guide/quickstart/
2. https://github.com/modelcontextprotocol/quickstart-resources
3. https://docs.cursor.com/advanced/model-context-protocol
4. https://modelcontextprotocol.io/introduction
