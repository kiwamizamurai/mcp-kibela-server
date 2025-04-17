# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] - 2025-04-17

### Added

- Optional image data inclusion in note content responses
- Support for excluding image data URLs for better performance
- Added `include_image_data` parameter to note retrieval endpoints

## [1.0.0] - 2025-04-12

### Added
- Initial release with Kibela API integration
- Core features:
  - Note search with advanced filtering options
  - Personal note management (latest notes, recently viewed)
  - Note content and comments retrieval
  - Group and folder management
  - Group notes management (notes without folders)
  - Folder notes management
  - User interaction features (like/unlike notes)
  - User listing functionality
  - Note attachment viewing
  - Path-based note retrieval
- Integration support:
  - Claude Desktop configuration
  - Cursor integration
  - Docker support
  - SSE transport capability
- Development environment setup:
  - Local development configuration
  - Docker development workflow
  - Environment variable management (KIBELA_TEAM, KIBELA_TOKEN)