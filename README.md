# Air-WhiteBoard — AirBoard Extreme V2

A gesture-powered virtual whiteboard built with HTML, CSS and Vanilla JavaScript. Draw with a webcam, mouse or touchscreen.

## Features
- Webcam hand tracking with MediaPipe Hands.
- Index finger draws; index + middle fingers temporarily erase; pinch pauses drawing; fist or hand-away pauses.
- Pen, highlighter, eraser, line, rectangle and ellipse tools.
- Color picker, quick palettes, brush size, opacity and stroke smoothing.
- Undo, redo, clear page, multiple pages and editable board title.
- Automatic local saving with browser LocalStorage.
- Export current page as PNG (2× resolution) or SVG.
- Grid overlay, camera status, hand tracking status, FPS and session statistics.
- Responsive desktop, tablet and mobile layout.
- Mouse and touch drawing work even when camera is off.

## Run locally
1. Clone this repository.
2. Open the folder in VS Code and start it with Live Server, or serve it from localhost.
3. Open the localhost URL in a modern browser.
4. Press Enable camera and allow camera access for gesture drawing.

No npm, build process, backend or framework is required. MediaPipe is loaded from jsDelivr, so hand tracking needs an internet connection. Camera access generally requires HTTPS or localhost.

## Gestures
| Gesture | Action |
|---|---|
| Index raised, middle lowered | Draw with selected tool |
| Index + middle raised | Temporary gesture eraser |
| Thumb + index pinch | Hover / pause drawing |
| Fist or hand outside frame | Pause drawing |

Good lighting and a plain background improve tracking. Select shape tools in the toolbar; mouse/touch gives precise start and end points for shapes.

## Shortcuts
| Key | Action |
|---|---|
| P / H / E | Pen / highlighter / eraser |
| L / R / O | Line / rectangle / ellipse |
| Ctrl/Cmd + Z | Undo |
| Ctrl/Cmd + Shift + Z or Ctrl/Cmd + Y | Redo |

## Project files
- index.html — workspace structure and MediaPipe script loading
- style.css — responsive cyan glass interface
- script.js — canvas engine, gesture processing, storage and export
- README.md — setup and usage

## Privacy and limitations
- Camera access starts only after the user chooses to enable it.
- Camera frames are processed in the browser; the app does not upload or record video.
- Board data is saved only in this browser's LocalStorage. Export important work; clearing browser site data can remove saved boards.
- Hand tracking requires MediaPipe CDN availability and camera permission.
- Gesture-based shape placement is less precise than mouse/touch placement.
- SVG export approximates eraser edits with white paths; PNG is the more faithful export for erased artwork.

## Links
Live demo: https://arjunsharma-55.github.io/Air-WhiteBoard/
Repository: https://github.com/ArjunSharma-55/Air-WhiteBoard

Built by Arjun Sharma.
