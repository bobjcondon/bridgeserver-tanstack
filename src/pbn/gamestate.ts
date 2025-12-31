const pbn = require('pbn')
import * as fs from 'fs';
import * as v from 'valibot';


// A tagged-union representing a parsed PBN board.  
// TODO; Use AI to infer this from node_modules/pbn
interface PBNDirective { type: "directive", name: string, value: string };
interface PBNComment { type: "comment", text: string };
interface PBNGame { type: "game", boardNumber: number, declarer: string, vulnerability: string, contract: string, result: string }
interface PBNNote { type: "note", text: string };
interface PBNEvent { type: 'tag', name: "Event", value: string };
interface PBNSite { type: 'tag', name: "Site", value: string };
interface PBNDate { type: 'tag', name: "Date", value: string };
interface PBNBoard { type: 'tag', name: "Board", value: string };
interface PBNWest { type: 'tag', name: "West", value: string };
interface PBNNorth { type: 'tag', name: "North", value: string };
interface PBNEast { type: 'tag', name: "East", value: string };
interface PBNSouth { type: 'tag', name: "South", value: string };
interface PBNDealer { type: 'tag', name: "Dealer", value: string };
interface PBNVulnerable { type: 'tag', name: "Vulnerable", value: string };
interface PBNScoring { type: 'tag', name: "Scoring", value: string };
interface PBNDeclarer { type: 'tag', name: "Declarer", value: string };
interface PBNContract {
    type: 'tag', name: "Contract",
    value: string,
    level?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7,
    denomination?: 'C' | 'D' | 'H' | 'S' | 'NT',
    risk?: '' | 'X' | 'XX'
};
interface PBNResult { type: 'tag', name: "Result", value: string };
interface PBNBCFlags { type: 'tag', name: "BCFlags", value: string };
interface PBNGenerator { type: 'tag', name: "Generator", value: string };
interface DealtCard {
    seat: 'N' | 'E' | 'S' | 'W',
    suit: 'C' | 'D' | 'H' | 'S',
    rank: '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | 'T' | 'J' | 'Q' | 'K' | 'A'
};
interface Contract {
    level: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7,
    strain: 'C' | 'D' | 'H' | 'S' | 'NT',
    risk: '' | 'X' | 'XX'
};
interface PBNDeal {
    type: 'tag', name: "Deal",
    value: string,
    cards: DealtCard[]
};
type PBNData = PBNDirective | PBNComment | PBNGame | PBNNote | PBNEvent
    | PBNDeal | PBNSite | PBNDate | PBNBoard | PBNWest | PBNNorth | PBNEast
    | PBNSouth | PBNDealer | PBNVulnerable | PBNScoring | PBNDeclarer
    | PBNContract | PBNResult | PBNBCFlags | PBNGenerator;

const SuitSchema = v.union([v.literal('C'), v.literal('D'), v.literal('H'), v.literal('S')]);
const RankSchema = v.union([v.literal('2'), v.literal('3'), v.literal('4'), v.literal('5'), v.literal('6'), v.literal('7'), v.literal('8'), v.literal('9'), v.literal('T'), v.literal('J'), v.literal('Q'), v.literal('K'), v.literal('A')]);
const SeatSchema = v.union([v.literal('N'), v.literal('E'), v.literal('S'), v.literal('W')]);

const CardSchema = v.object({
    suit: SuitSchema,
    rank: RankSchema
});

const ContractSchema = v.object({
    level: v.pipe(v.number(), v.minValue(0), v.maxValue(7)),
    strain: v.union([SuitSchema, v.literal('NT')]),
    risk: v.union([v.literal(''), v.literal('X'), v.literal('XX')]),
});

const EventBoardSchema = v.object({
    event: v.optional(v.string()),
    site: v.optional(v.string()),
    date: v.optional(v.date()),
    board: v.optional(v.string()),
    west: v.optional(v.string()),
    north: v.optional(v.string()),
    east: v.optional(v.string()),
    south: v.optional(v.string()),
    dealer: v.optional(SuitSchema),
    vulnerable: v.optional(v.union([v.literal('None'), v.literal('NS'), v.literal('EW'), v.literal('Both')])),
    scoring: v.optional(v.string()),
    declarer: v.optional(SeatSchema),
    contract: v.optional(ContractSchema),
    result: v.optional(v.string()),
    deal: v.optional(v.string()),
    cards: v.optional(v.array(CardSchema)),
    bcflags: v.optional(v.string()),
    generator: v.optional(v.string()),
});


type EventBoard = {
    event?: string,
    site?: string,
    date?: string,
    board?: string,
    west?: string,
    north?: string,
    east?: string,
    south?: string,
    dealer?: string,
    vulnerable?: string,
    scoring?: string,
    declarer?: string,
    contract?: Contract,
    result?: string,
    deal?: string,  // a PBN Deal string
    cards?: DealtCard[] // the PBN dealt cards parsed into structured data
    bcflags?: string,
    generator?: string,
};

interface GameState {
    hands: string,   // PBN string representing the hands
    declarer: 'N' | 'E' | 'S' | 'W',
    k: number,
};


const main2 = async (filePath: string) => {
    let boards: EventBoard[] = [];
    let board: EventBoard | null = null;
    fs.createReadStream(filePath)
        .pipe(pbn())
        .on('data', (data: PBNData) => {
            switch (data.type) {
                case 'directive':
                case 'comment':
                case 'note':
                    break;
                case 'game':
                    if (board) boards.push(board);
                    board = {};
                    break;
                case 'tag':
                    switch (data.name) {
                        case 'Event':

                        case 'Site':
                        case 'Date':
                        case 'Board':
                        case 'West':
                        case 'North':
                        case 'East':
                        case 'South':
                        case 'Dealer':
                        case 'Vulnerable':
                        case 'Scoring':
                        case 'Declarer':
                        case 'Result':
                        case 'BCFlags':
                        case 'Generator':
                            if (board) board[data.name.toLowerCase()] = data.value;
                            break;
                        case 'Contract':
                            if (board) board.contract = {
                                level: data.level!,
                                strain: data.denomination!,
                                risk: data.risk!
                            };
                            break;
                        case 'Deal':
                            if (board) {
                                board.deal = data.value;
                                board.cards = data.cards;
                            }
                            break;
                        default:
                            throw new Error(`Unhandled tag ${data!.name || 'undefined'}`);
                    }
                    break;
                default:
                    throw new Error(`Unhandled tag ${data.type || 'undefined'}`);
            }

        })
        .on('error', (err: Error) => {
            process.stderr.write(err.message);
            process.exit(1);
        })
        .on('end', () => {
            if (board) boards.push(board);
            console.log("Boards:", JSON.stringify(boards));
        });

    console.warn("main2 completed.");
    return boards;
}

async function main1(filePath) {

    fs.createReadStream(filePath)
        .pipe(pbn.autoConvert())
        .on('data', data => {
            console.log(JSON.stringify(data));
        })
        .on('error', err => {
            process.stderr.write(err.message);
            process.exit(1);
        });
}

main2(process.argv[2] || '');
console.log("main complete");
