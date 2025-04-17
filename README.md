# Kibela MCP Server
![NPM Version](https://img.shields.io/npm/v/%40kiwamizamurai%2Fmcp-kibela-server)
![NPM Downloads](https://img.shields.io/npm/dm/%40kiwamizamurai%2Fmcp-kibela-server)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![smithery badge](https://smithery.ai/badge/@kiwamizamurai/mcp-kibela-server)](https://smithery.ai/server/@kiwamizamurai/mcp-kibela-server)

MCP server implementation for Kibela API integration, enabling LLMs to interact with Kibela content.

<img width="320" alt="Example" src="https://github.com/user-attachments/assets/eeed8f45-eb24-456d-bb70-9e738aa1bfb3" />

<a href="https://glama.ai/mcp/servers/m21nkeig1p"><img width="380" height="200" src="https://glama.ai/mcp/servers/m21nkeig1p/badge" alt="Kibela Server MCP server" /></a>

## Features

- Search notes with advanced filters
- Get your latest notes
- Get note content and comments
- Manage groups and folders
- Like/unlike notes
- List users
- View note attachments
- View recently viewed notes
- Get notes by path

## Configuration

### Environment Variables

- `KIBELA_TEAM`: Your Kibela team name (required)
- `KIBELA_TOKEN`: Your Kibela API token (required)

## Cursor Integration

Add to your `~/.cursor/mcp.json`:

```json
{
    "mcpServers": {
        "kibela": {
            "command": "npx",
            "args": ["-y", "@kiwamizamurai/mcp-kibela-server"],
            "env": {
                "KIBELA_TEAM": "YOUR_TEAM_NAME",
                "KIBELA_TOKEN": "YOUR_TOKEN"
            }
        }
    }
}
```

If you want to use docker instead

```json
{
    "mcpServers": {
        "kibela": {
            "command": "docker",
            "args": [
                "run",
                "-i",
                "--rm",
                "-e",
                "KIBELA_TEAM",
                "-e",
                "KIBELA_TOKEN",
                "ghcr.io/kiwamizamurai/mcp-kibela-server:latest"
            ],
            "env": {
                "KIBELA_TEAM": "YOUR_TEAM_NAME",
                "KIBELA_TOKEN": "YOUR_TOKEN"
            }
        }
    }
}
```

## Tools

### kibela_search_notes
Search Kibela notes with given query
- Input:
  - `query` (string): Search query
  - `coediting` (boolean, optional): Filter by co-editing status
  - `isArchived` (boolean, optional): Filter by archive status
  - `sortBy` (string, optional): Sort by (RELEVANT, CONTENT_UPDATED_AT)
  - `userIds` (string[], optional): Filter by user IDs
  - `folderIds` (string[], optional): Filter by folder IDs
- Returns: List of matching notes with ID, title, URL, author, groups and more

### kibela_get_my_notes
Get your latest notes from Kibela
- Input:
  - `limit` (number, optional): Number of notes to fetch (default: 15)
- Returns: List of your latest notes with author information

### kibela_get_note_content
Get content and comments of a specific note
- Input:
  - `id` (string): Note ID
  - `include_image_data` (boolean, optional): Whether to include image data URLs in the response (default: false)
- Returns: Full note content including HTML, comments, attachments, groups, folders and more

### kibela_get_groups
Get list of accessible groups
- Input: None
- Returns: List of groups with details like privacy settings and permissions

### kibela_get_group_folders
Get folders in a group
- Input:
  - `groupId` (string): Group ID
  - `parentFolderId` (string, optional): Parent folder ID for nested folders
- Returns: List of folders with their notes and metadata

### kibela_get_group_notes
Get notes in a group that are not attached to any folder
- Input:
  - `groupId` (string): Group ID
- Returns: List of notes with author information, sorted by last update time

### kibela_get_folder_notes
Get notes in a folder
- Input:
  - `folderId` (string): Folder ID
- Returns: List of notes with author information, sorted by last update time

### kibela_get_users
Get list of users
- Input: None
- Returns: List of users with ID, account and real name

### kibela_like_note
Like a note
- Input:
  - `noteId` (string): Note ID
- Returns: Updated likers list

### kibela_unlike_note
Unlike a note
- Input:
  - `noteId` (string): Note ID
- Returns: Updated likers list

### kibela_get_recently_viewed_notes
Get your recently viewed notes
- Input:
  - `limit` (number, optional): Number of notes to fetch (max 15)
- Returns: List of recently viewed notes with author information

### kibela_get_note_from_path
Get note content by its path or URL
- Input:
  - `path` (string): Note path (e.g. '/group/folder/note') or full Kibela URL (e.g. 'https://team.kibe.la/notes/123')
  - `include_image_data` (boolean, optional): Whether to include image data URLs in the response (default: false)
- Returns: Full note content including HTML, comments, attachments, groups, folders and more

## Local Development

### Running from Source

1. Clone the repository
2. Install dependencies: `npm install`

### Environment Setup

For local development, update your `~/.cursor/mcp.json`:

```json
{
    "mcpServers": {
        "kibela": {
            "command": "node",
            "args": ["path/to/mcp-kibela-server/dist/src/index.js"],
            "env": {
                "KIBELA_TEAM": "YOUR_TEAM_NAME",
                "KIBELA_TOKEN": "YOUR_TOKEN"
            }
        }
    }
}
```

### MCP inspector

```bash
npx @modelcontextprotocol/inspector node ./dist/src/index.js
```

and set environemtns


### Docker

Build and run locally:

```bash
docker build -t mcp-kibela-server .
```

Then use this configuration:

```json
{
    "mcpServers": {
        "kibela": {
            "command": "docker",
            "args": [
                "run",
                "-i",
                "--rm",
                "-e",
                "KIBELA_TEAM",
                "-e",
                "KIBELA_TOKEN",
                "mcp-kibela-server"
            ],
            "env": {
                "KIBELA_TEAM": "YOUR_TEAM_NAME",
                "KIBELA_TOKEN": "YOUR_TOKEN"
            }
        }
    }
}
```
For SSE transport, ensure the server URL is set to: `http://localhost:3000/sse`


# Other products

- [vscode extension for kibela](https://marketplace.visualstudio.com/items?itemName=kiwamizamurai-vscode.kibela-vscode)