# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Handy is a cross-platform desktop speech-to-text application built with Tauri (Rust + React/TypeScript). It provides offline speech transcription using Whisper and Parakeet models with a focus on privacy and extensibility.

### Core Architecture

- **Frontend**: React + TypeScript with Tailwind CSS for the settings UI
- **Backend**: Rust for system integration, audio processing, and ML inference
- **Key Libraries**:
  - `whisper-rs`: Local speech recognition with Whisper models
  - `transcription-rs`: CPU-optimized speech recognition with Parakeet models
  - `cpal`: Cross-platform audio I/O
  - `vad-rs`: Voice Activity Detection
  - `rdev`: Global keyboard shortcuts and system events

## Development Commands

### Setup and Installation
```bash
# Install dependencies
bun install

# Start development server
bun tauri dev

# Build for production
bun tauri build
```

### Code Quality
```bash
# Format all code
bun run format

# Check formatting
bun run format:check

# Format frontend only
bun run format:frontend

# Format backend only
bun run format:backend
```

### Build Requirements
Windows users may need to set UTF-8 encoding flags to prevent compilation errors:
```cmd
set CFLAGS=/utf-8
set CXXFLAGS=/utf-8
set VULKAN_SDK=C:\VulkanSDK\1.3.280.0
```

## Recent Development Work

### 1. Overlay State Management Fix (Fixed)
- Fixed issue where "recognizing" state disappeared immediately after releasing shortcut key
- Implemented proper overlay state transitions: recording → recognizing → transcribing
- Added atomic operations to prevent duplicate `TranscribeAction::stop` calls
- Fixed async task lifecycle management

### 2. Internationalization (i18n) Implementation (Recently Added)
- Added comprehensive i18n infrastructure using react-i18next
- Implemented UI language switching between English and Chinese
- Added UiLanguageSelector component in General Settings
- Updated all UI components to use translation keys
- Files added:
  - `src/i18n/` - Complete i18n setup with resources
  - `src/components/settings/general/UiLanguageSelector.tsx`

## Key Architecture Patterns

### Settings Management
- Settings are stored in Rust backend (`src-tauri/src/settings.rs`)
- Frontend uses Tauri commands to get/set settings
- UI language preference persists across app restarts

### Audio Processing Pipeline
1. Audio capture via `cpal`
2. Voice Activity Detection using Silero VAD
3. Audio resampling with `rubato`
4. Transcription with Whisper or Parakeet models
5. Clipboard integration for text output

### Overlay System
- Floating overlay shows recording/transcription status
- States: recording → recognizing → transcribing
- Platform-specific positioning (disabled by default on Linux)

## File Structure

### Backend (Rust)
- `src-tauri/src/` - Main Rust source code
  - `main.rs` - Application entry point
  - `actions.rs` - Tauri command handlers
  - `settings.rs` - Settings management
  - `overlay.rs` - Overlay window management
  - `audio_toolkit/` - Audio processing modules
  - `managers/` - High-level management (audio, transcription, models)

### Frontend (TypeScript/React)
- `src/` - React source code
  - `components/` - UI components
    - `settings/` - Settings page components
    - `model-selector/` - Model selection UI
  - `overlay/` - Recording overlay components
  - `i18n/` - Internationalization setup and resources
  - `bindings.ts` - Tauri command bindings

## Testing Tips

Before testing speech recognition features:
1. Ensure microphone permissions are granted
2. Check that audio devices are properly configured
3. Verify model files are downloaded (Settings → Models)
4. Test with simple phrases first

For overlay testing:
- Use debug mode (Ctrl+Shift+D) to access additional features
- On Linux, consider using clipboard-based paste methods due to Wayland limitations

## Platform-Specific Notes

### Linux
- Overlay disabled by default due to compositor focus issues
- Wayland users should install `wtype` or `dotool` for clipboard integration
- Can control via signals: `pkill -USR2 -n handy`

### macOS
- Requires accessibility permissions for global shortcuts
- Supports Globe key as transcription trigger

### Windows
- Requires Microsoft C++ Build Tools
- May need UTF-8 encoding flags for compilation