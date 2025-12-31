/**
 * PBN (Portable Bridge Notation) to JSON conversion module
 *
 * This module parses PBN files containing Contract Bridge hand data
 * and converts them to structured JSON objects.
 */

import * as v from 'valibot'
import * as fs from 'fs'
import { Readable } from 'stream'

// Import the pbn parser library
// eslint-disable-next-line @typescript-eslint/no-var-requires
const pbn = require('pbn')

// ===== Valibot Schemas =====

/**
 * Schema for card suits
 */
export const SuitSchema = v.union([
  v.literal('C'),
  v.literal('D'),
  v.literal('H'),
  v.literal('S'),
])

/**
 * Schema for card ranks
 */
export const RankSchema = v.union([
  v.literal('2'),
  v.literal('3'),
  v.literal('4'),
  v.literal('5'),
  v.literal('6'),
  v.literal('7'),
  v.literal('8'),
  v.literal('9'),
  v.literal('T'),
  v.literal('J'),
  v.literal('Q'),
  v.literal('K'),
  v.literal('A'),
])

/**
 * Schema for seat positions
 */
export const SeatSchema = v.union([
  v.literal('N'),
  v.literal('E'),
  v.literal('S'),
  v.literal('W'),
])

/**
 * Schema for vulnerability states
 */
export const VulnerabilitySchema = v.union([
  v.literal('None'),
  v.literal('NS'),
  v.literal('EW'),
  v.literal('Both'),
  v.literal('All'),
  v.literal('-'),
])

/**
 * Schema for a single dealt card
 */
export const DealtCardSchema = v.object({
  seat: SeatSchema,
  suit: SuitSchema,
  rank: RankSchema,
})

/**
 * Schema for contract information
 */
export const ContractSchema = v.object({
  level: v.pipe(v.number(), v.minValue(0), v.maxValue(7)),
  strain: v.union([SuitSchema, v.literal('NT')]),
  risk: v.union([v.literal(''), v.literal('X'), v.literal('XX')]),
})

/**
 * Schema for a hand of cards (13 cards for one player)
 */
export const HandSchema = v.object({
  seat: SeatSchema,
  spades: v.array(RankSchema),
  hearts: v.array(RankSchema),
  diamonds: v.array(RankSchema),
  clubs: v.array(RankSchema),
})

/**
 * Schema for a bridge game/board
 */
export const GameSchema = v.object({
  event: v.optional(v.string()),
  site: v.optional(v.string()),
  date: v.optional(v.string()),
  board: v.optional(v.string()),
  west: v.optional(v.string()),
  north: v.optional(v.string()),
  east: v.optional(v.string()),
  south: v.optional(v.string()),
  dealer: v.optional(SeatSchema),
  vulnerable: v.optional(VulnerabilitySchema),
  scoring: v.optional(v.string()),
  declarer: v.optional(SeatSchema),
  contract: v.optional(ContractSchema),
  result: v.optional(v.string()),
  deal: v.optional(v.string()),
  hands: v.optional(v.array(HandSchema)),
  bcflags: v.optional(v.string()),
  generator: v.optional(v.string()),
})

// ===== TypeScript Types (inferred from schemas) =====

export type Suit = v.InferOutput<typeof SuitSchema>
export type Rank = v.InferOutput<typeof RankSchema>
export type Seat = v.InferOutput<typeof SeatSchema>
export type Vulnerability = v.InferOutput<typeof VulnerabilitySchema>
export type DealtCard = v.InferOutput<typeof DealtCardSchema>
export type Contract = v.InferOutput<typeof ContractSchema>
export type Hand = v.InferOutput<typeof HandSchema>
export type Game = v.InferOutput<typeof GameSchema>

// ===== Internal PBN Parser Types =====

interface PBNTag {
  type: 'tag'
  name: string
  value: string
  level?: number
  denomination?: Suit | 'NT'
  risk?: '' | 'X' | 'XX'
  cards?: DealtCard[]
}

interface PBNGame {
  type: 'game'
}

interface PBNDirective {
  type: 'directive'
  name: string
  value: string
}

interface PBNComment {
  type: 'comment'
  text: string
}

interface PBNNote {
  type: 'note'
  text: string
}

type PBNData = PBNTag | PBNGame | PBNDirective | PBNComment | PBNNote

// ===== Helper Functions =====

/**
 * Converts a PBN Deal string to an array of Hand objects
 *
 * Deal format: "N:spades.hearts.diamonds.clubs ..."
 * Example: "N:J95.A.J82.AKJ976 T3.K63.AT743.QT2 ..."
 */
export function dealStringToHands(dealString: string): Hand[] {
  const parts = dealString.split(':')
  if (parts.length !== 2) {
    return []
  }

  const [firstSeat, handsData] = parts
  const handStrings = handsData.trim().split(/\s+/)

  if (handStrings.length !== 4) {
    return []
  }

  const seats: Seat[] = ['N', 'E', 'S', 'W']
  const startIndex = seats.indexOf(firstSeat as Seat)

  if (startIndex === -1) {
    return []
  }

  const hands: Hand[] = []

  for (let i = 0; i < 4; i++) {
    const seatIndex = (startIndex + i) % 4
    const seat = seats[seatIndex]
    const handString = handStrings[i]
    const suits = handString.split('.')

    if (suits.length !== 4) {
      continue
    }

    const hand: Hand = {
      seat,
      spades: suits[0].split('').filter(c => c !== '-') as Rank[],
      hearts: suits[1].split('').filter(c => c !== '-') as Rank[],
      diamonds: suits[2].split('').filter(c => c !== '-') as Rank[],
      clubs: suits[3].split('').filter(c => c !== '-') as Rank[],
    }

    hands.push(hand)
  }

  return hands
}

// ===== Main Parser Function =====

/**
 * Parses a PBN file and returns an array of Game objects
 *
 * @param filePath - Path to the PBN file
 * @returns Promise resolving to an array of parsed games
 */
export async function parsePBNFile(filePath: string): Promise<Game[]> {
  return new Promise((resolve, reject) => {
    const games: Game[] = []
    let currentGame: Partial<Game> = {}

    const stream: Readable = fs.createReadStream(filePath)

    stream
      .pipe(pbn())
      .on('data', (data: PBNData) => {
        if (data.type === 'game') {
          // Start of a new game - save the previous one if it exists
          if (Object.keys(currentGame).length > 0) {
            try {
              const validatedGame = v.parse(GameSchema, currentGame)
              games.push(validatedGame)
            } catch (error) {
              console.warn('Invalid game data:', error)
            }
          }
          currentGame = {}
          return
        }

        if (data.type === 'tag') {
          switch (data.name) {
            case 'Event':
              if (data.value && data.value.trim() !== '') {
                currentGame.event = data.value
              }
              break

            case 'Site':
              if (data.value && data.value.trim() !== '') {
                currentGame.site = data.value
              }
              break

            case 'Date':
              if (data.value && data.value.trim() !== '') {
                currentGame.date = data.value
              }
              break

            case 'Board':
              if (data.value && data.value.trim() !== '') {
                currentGame.board = data.value
              }
              break

            case 'West':
              if (data.value && data.value.trim() !== '') {
                currentGame.west = data.value
              }
              break

            case 'North':
              if (data.value && data.value.trim() !== '') {
                currentGame.north = data.value
              }
              break

            case 'East':
              if (data.value && data.value.trim() !== '') {
                currentGame.east = data.value
              }
              break

            case 'South':
              if (data.value && data.value.trim() !== '') {
                currentGame.south = data.value
              }
              break

            case 'Scoring':
              if (data.value && data.value.trim() !== '') {
                currentGame.scoring = data.value
              }
              break

            case 'Result':
              if (data.value && data.value.trim() !== '') {
                currentGame.result = data.value
              }
              break

            case 'BCFlags':
              if (data.value && data.value.trim() !== '') {
                currentGame.bcflags = data.value
              }
              break

            case 'Generator':
              if (data.value && data.value.trim() !== '') {
                currentGame.generator = data.value
              }
              break

            case 'Dealer':
              if (data.value && data.value.trim() !== '') {
                currentGame.dealer = data.value as Seat
              }
              break

            case 'Declarer':
              if (data.value && data.value.trim() !== '') {
                currentGame.declarer = data.value as Seat
              }
              break

            case 'Vulnerable':
              if (data.value && data.value.trim() !== '') {
                currentGame.vulnerable = data.value as Vulnerability
              }
              break

            case 'Contract':
              if (data.level !== undefined && data.denomination && data.risk !== undefined) {
                currentGame.contract = {
                  level: data.level,
                  strain: data.denomination,
                  risk: data.risk,
                }
              }
              break

            case 'Deal':
              currentGame.deal = data.value
              // Convert deal string to hands array
              if (data.value) {
                const hands = dealStringToHands(data.value)
                if (hands.length > 0) {
                  currentGame.hands = hands
                }
              }
              break

            default:
              // Ignore unknown tags
              break
          }
        }
      })
      .on('error', (err: Error) => {
        reject(new Error(`Failed to parse PBN file: ${err.message}`))
      })
      .on('end', () => {
        // Don't forget the last game
        if (Object.keys(currentGame).length > 0) {
          try {
            const validatedGame = v.parse(GameSchema, currentGame)
            games.push(validatedGame)
          } catch (error) {
            console.warn('Invalid game data:', error)
          }
        }
        resolve(games)
      })
  })
}

/**
 * Parses a PBN file and returns the result as a JSON string
 *
 * @param filePath - Path to the PBN file
 * @param pretty - Whether to pretty-print the JSON (default: true)
 * @returns Promise resolving to a JSON string
 */
export async function parsePBNFileToJSON(
  filePath: string,
  pretty = true
): Promise<string> {
  const games = await parsePBNFile(filePath)
  return JSON.stringify(games, null, pretty ? 2 : 0)
}
