# Parse PBN files to JSON

## overview

PBN files contain data about Contract Bridge hands.
Write a Typescript main routine (src/pbn/pbn.ts) to parse a PBN file and return a JSON object of all the games in the file.
The JSON for a game should include fields

- event
- site
- date
- board
- west
- north
- east
- south
- dealer
- vulnerable
- scoring
- declarer
- contract
- result
- deal  // a PBN Deal string
- hands?: // an array if hands of cards for each of N, E, S, W
- bcflags
- generator

## Technology 

- generate warning-free typescript code using typescript best practices 2025
- generate a [valibot schema](https://valibot.dev/)
- use [pbn parser](https://github.com/richardschneider/pbn) to handle the low-level parsing
- use [bun](https://bun.com/) runtime
