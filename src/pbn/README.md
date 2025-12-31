# PBN (Portable Bridge Notation) Parser

A TypeScript module for parsing PBN files into structured JSON objects, designed for Contract Bridge hand data.

## Features

- **Type-safe parsing** with TypeScript and Valibot schema validation
- **Modern async API** using Promises
- **Comprehensive data extraction** including:
  - Event metadata (event, site, date)
  - Board information (board number, dealer, vulnerability)
  - Player names (North, East, South, West)
  - Contract details (level, strain, risk)
  - Deal strings and parsed hand data
  - Results and scoring information
- **CLI tool** for quick file conversion
- **Test coverage** with Bun test runner

## Installation

The required dependencies are already included in the project:
- `pbn` - Low-level PBN parser
- `valibot` - Schema validation

## Usage

### Programmatic API

```typescript
import { parsePBNFile, parsePBNFileToJSON } from '@/pbn/pbn'

// Parse to JavaScript objects
const games = await parsePBNFile('path/to/file.pbn')
console.log(games[0].board) // "1"
console.log(games[0].dealer) // "N"
console.log(games[0].hands) // Array of 4 hands with parsed cards

// Parse to JSON string
const json = await parsePBNFileToJSON('path/to/file.pbn')
console.log(json)

// Compact JSON (no pretty-printing)
const compactJson = await parsePBNFileToJSON('path/to/file.pbn', false)
```

### CLI Tool

```bash
# Pretty-printed JSON to stdout
bun src/pbn/cli.ts testdata/250429.pbn

# Compact JSON to file
bun src/pbn/cli.ts testdata/250429.pbn --compact > output.json

# Show help
bun src/pbn/cli.ts --help
```

## Data Structure

Each game/board parsed from a PBN file has the following structure:

```typescript
{
  event?: string           // Event name
  site?: string            // Location
  date?: string            // Date string
  board?: string           // Board number
  west?: string            // West player name
  north?: string           // North player name
  east?: string            // East player name
  south?: string           // South player name
  dealer?: 'N' | 'E' | 'S' | 'W'  // Dealer position
  vulnerable?: 'None' | 'NS' | 'EW' | 'Both' | 'All' | '-'  // Vulnerability
  scoring?: string         // Scoring method
  declarer?: 'N' | 'E' | 'S' | 'W'  // Declarer position
  contract?: {             // Contract information
    level: 0-7
    strain: 'C' | 'D' | 'H' | 'S' | 'NT'
    risk: '' | 'X' | 'XX'  // Undoubled, doubled, redoubled
  }
  result?: string          // Contract result
  deal?: string            // PBN deal string (e.g., "N:J95.A.J82...")
  hands?: [                // Parsed hands (4 hands)
    {
      seat: 'N' | 'E' | 'S' | 'W'
      spades: ['A', 'K', 'Q', ...]
      hearts: ['J', 'T', '9', ...]
      diamonds: ['8', '7', '6', ...]
      clubs: ['5', '4', '3', ...]
    }
  ]
  bcflags?: string         // BridgeComposer flags
  generator?: string       // Software that generated the file
}
```

## Example

```typescript
import { parsePBNFile } from '@/pbn/pbn'

const games = await parsePBNFile('testdata/250429.pbn')

// Access first game
const firstGame = games[0]
console.log(`Board ${firstGame.board}`)
console.log(`Dealer: ${firstGame.dealer}`)
console.log(`Vulnerable: ${firstGame.vulnerable}`)

// Access North's hand
const northHand = firstGame.hands?.find(h => h.seat === 'N')
console.log('North spades:', northHand?.spades.join(' '))
// Output: North spades: J 9 5
```

## Testing

Run the test suite:

```bash
bun test src/pbn/pbn.test.ts
```

## Implementation Details

- Built with **TypeScript** for type safety
- Uses **Valibot** for runtime schema validation
- Leverages the **pbn npm package** for low-level parsing
- Designed for **Bun runtime** (also works with Node.js)
- Follows **2025 TypeScript best practices**

## Schema Validation

All parsed data is validated against Valibot schemas to ensure type safety and data integrity. Invalid games are logged as warnings and excluded from the results.

## Files

- `pbn.ts` - Main parser module with types and schemas
- `cli.ts` - Command-line interface tool
- `pbn.test.ts` - Test suite
- `README.md` - This file

## License

Part of the Bridgeserver project.
