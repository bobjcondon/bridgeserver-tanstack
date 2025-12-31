#!/usr/bin/env bun

/**
 * CLI tool for converting PBN files to JSON
 *
 * Usage:
 *   bun src/pbn/cli.ts <path-to-pbn-file> [--compact]
 *
 * Examples:
 *   bun src/pbn/cli.ts testdata/250429.pbn
 *   bun src/pbn/cli.ts testdata/250429.pbn --compact > output.json
 */

import { parsePBNFileToJSON } from './pbn'

async function main() {
  const args = process.argv.slice(2)

  if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
    console.error(`
Usage: bun src/pbn/cli.ts <path-to-pbn-file> [--compact]

Convert a PBN file to JSON format

Arguments:
  <path-to-pbn-file>  Path to the PBN file to parse

Options:
  --compact           Output compact JSON (no pretty-printing)
  -h, --help          Show this help message

Examples:
  bun src/pbn/cli.ts testdata/250429.pbn
  bun src/pbn/cli.ts testdata/250429.pbn --compact > output.json
`)
    process.exit(args.includes('--help') || args.includes('-h') ? 0 : 1)
  }

  const filePath = args[0]
  const compact = args.includes('--compact')

  try {
    const json = await parsePBNFileToJSON(filePath, !compact)
    console.log(json)
  } catch (error) {
    console.error('Error parsing PBN file:', error)
    process.exit(1)
  }
}

main()
