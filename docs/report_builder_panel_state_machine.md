# Report Builder Panel State Machine

This document describes the state machine that governs the collapsed/expanded state of the Report List and Column List panels in the report builder UI. This explicit state model ensures predictable, robust panel behavior and simplifies UI logic.

## States

| State      | Description                                                        |
|------------|--------------------------------------------------------------------|
| RLISTE     | Report List only, expanded (main navigation/default state)         |
| RLISTC     | Report List only, collapsed (narrow, vertical label)               |
| RCROPEN    | Both lists shown: Report List expanded, Column List collapsed      |
| RCCOPEN    | Both lists shown: Report List collapsed, Column List expanded      |
| RCCCLOSED  | Both lists shown: both collapsed (both narrow, vertical labels)    |

## State Transitions

| From      | Action                        | To         | Notes                                  |
|-----------|-------------------------------|------------|----------------------------------------|
| RLISTE    | Collapse report list          | RLISTC     |                                        |
| RLISTC    | Expand report list            | RLISTE     |                                        |
| RCROPEN   | Collapse report list          | RCCCLOSED  |                                        |
| RCCOPEN   | Collapse column list          | RCCCLOSED  |                                        |
| RCCCLOSED | Expand report list            | RCROPEN    |                                        |
| RCCCLOSED | Expand column list            | RCCOPEN    |                                        |
| RCROPEN   | Expand column list            | RCCOPEN    |                                        |
| RCCOPEN   | Expand report list            | RCROPEN    |                                        |
| RLISTE    | Click new report button       | RCCOPEN    | Enter new mode, column list expanded   |
| RCROPEN   | Click new report button       | RCCOPEN    | Enter new mode, column list expanded   |

## Notes
- "Expanded" means the panel is wide and interactive; "collapsed" means the panel is narrow, showing only the icon and vertical label.
- Only one panel is ever expanded at a time, except in RCCCLOSED (both collapsed) or RCROPEN/RCCOPEN (one expanded, one collapsed).
- The "new report" button always transitions to RCCOPEN (column list expanded for new report creation).
- This state machine should be the single source of truth for panel layout logic in the report builder UI. 