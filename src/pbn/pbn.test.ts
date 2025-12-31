import { describe, expect, test } from 'bun:test'
import { parsePBNFile, parsePBNFileToJSON, dealStringToHands } from './pbn'
import path from 'path'

describe('PBN Parser', () => {
  describe('dealStringToHands', () => {
    test('should parse a valid Deal string', () => {
      const dealString =
        'N:J95.A.J82.AKJ976 T3.K63.AT743.QT2 KQ.QJ87542.K6.84 A87642.T9.Q95.53'
      const hands = dealStringToHands(dealString)

      expect(hands).toHaveLength(4)

      // Check North's hand
      const north = hands.find((h) => h.seat === 'N')
      expect(north).toBeDefined()
      expect(north?.spades).toEqual(['J', '9', '5'])
      expect(north?.hearts).toEqual(['A'])
      expect(north?.diamonds).toEqual(['J', '8', '2'])
      expect(north?.clubs).toEqual(['A', 'K', 'J', '9', '7', '6'])

      // Check East's hand
      const east = hands.find((h) => h.seat === 'E')
      expect(east).toBeDefined()
      expect(east?.spades).toEqual(['T', '3'])
      expect(east?.hearts).toEqual(['K', '6', '3'])
      expect(east?.diamonds).toEqual(['A', 'T', '7', '4', '3'])
      expect(east?.clubs).toEqual(['Q', 'T', '2'])
    })

    test('should handle empty suits (void)', () => {
      const dealString =
        'N:AKQ.-.J82.AKJ976 T3.K63.AT743.QT2 KQ.QJ87542.K6.84 A87642.T9.Q95.53'
      const hands = dealStringToHands(dealString)

      const north = hands.find((h) => h.seat === 'N')
      expect(north?.hearts).toEqual([])
    })

    test('should return empty array for invalid Deal string', () => {
      const dealString = 'invalid'
      const hands = dealStringToHands(dealString)
      expect(hands).toEqual([])
    })
  })

  describe('parsePBNFile', () => {
    test('should parse a PBN file with multiple boards', async () => {
      const testFilePath = path.join(
        process.cwd(),
        'testdata',
        '250429.pbn'
      )

      const games = await parsePBNFile(testFilePath)

      expect(games.length).toBeGreaterThan(0)

      // Check first game
      const firstGame = games[0]
      expect(firstGame).toBeDefined()
      expect(firstGame.board).toBe('1')
      expect(firstGame.dealer).toBe('N')
      expect(firstGame.vulnerable).toBe('None')
      expect(firstGame.deal).toBeDefined()

      // Check that hands were parsed
      if (firstGame.hands) {
        expect(firstGame.hands).toHaveLength(4)
      }
    })

    test('should handle contract information', async () => {
      const testFilePath = path.join(
        process.cwd(),
        'testdata',
        '250429.pbn'
      )

      const games = await parsePBNFile(testFilePath)

      // Find a game with contract information
      const gameWithContract = games.find((g) => g.contract !== undefined)

      if (gameWithContract?.contract) {
        expect(gameWithContract.contract.level).toBeGreaterThanOrEqual(0)
        expect(gameWithContract.contract.level).toBeLessThanOrEqual(7)
        expect(gameWithContract.contract.strain).toBeDefined()
        expect(['C', 'D', 'H', 'S', 'NT']).toContain(
          gameWithContract.contract.strain
        )
      }
    })
  })

  describe('parsePBNFileToJSON', () => {
    test('should return valid JSON string', async () => {
      const testFilePath = path.join(
        process.cwd(),
        'testdata',
        '250429.pbn'
      )

      const json = await parsePBNFileToJSON(testFilePath)

      // Should be valid JSON
      expect(() => JSON.parse(json)).not.toThrow()

      // Should be pretty-printed by default
      expect(json).toContain('\n')

      const parsed = JSON.parse(json)
      expect(Array.isArray(parsed)).toBe(true)
      expect(parsed.length).toBeGreaterThan(0)
    })

    test('should support compact JSON format', async () => {
      const testFilePath = path.join(
        process.cwd(),
        'testdata',
        '250429.pbn'
      )

      const json = await parsePBNFileToJSON(testFilePath, false)

      // Should not have newlines (compact)
      expect(json).not.toContain('\n  ')
    })
  })
})
