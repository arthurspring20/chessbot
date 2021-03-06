import { Injectable, Inject } from "di-xxl";
import { Side } from '@scaljeri/chess-shared';
import { IChessBoard } from '../../models/chessboard';
import { IBrowserSettings } from '../../models/browser-settings';
import { getS, getM } from './find';
import { IChessPoint } from '../../models/chess-point';

// Handles everything related to the chessboard, like time and square details
@Injectable({ name: 'browser.utils.chessboard', singleton: true })
export class BrowserChessBoard implements IChessBoard {
    // @Inject('utils') utils: IChessUtils;
    @Inject('settings') settings: IBrowserSettings;

    public opponent: Side;
    public bot: Side;
		private gridRect: DOMRect;
		private squareSize: number;

    reset(): void {
			this.gridRect = null;
    }

    getTimeLeftBottom(): string {
			const timeEl = getS(`${this.settings.PLAYER_DETAILS} ${this.settings.CLOCK_TIMELEFT}`);
        return timeEl ? timeEl.innerText : '';
    }

    getTimeLeftTop(): string {
				const timeEl = getS(`${this.settings.OPP_DETAILS} ${this.settings.CLOCK_TIMELEFT}`);
        return timeEl ? timeEl.innerText : '';
    }

    buildGrid() {
        const board = getS(this.settings.BOARD_NAME)!;
        const first = getS(this.settings.GRID_NAME, board)

        this.bot = first.innerHTML === '8' ? Side.White : Side.Black;
        this.opponent = this.bot === Side.White ? Side.Black : Side.White;

				this.gridRect = board.getBoundingClientRect() as DOMRect;
				this.squareSize = this.gridRect.width / 8;
    }

    findCoordinates(position: string): IChessPoint {
        if (!this.gridRect) {
            this.buildGrid();
        }

				let [col, row] = position.split('');
				if (this.bot === Side.b) {
					row = String(9 - +row);
					col = String.fromCharCode(97 + (104 - col.charCodeAt(0)));
				}

				const y = (8.5 - +row) * this.squareSize + this.gridRect.top; // this.grid[row].y; // + size + this.boardTop;
				const x = (col.charCodeAt(0) - 96.5) * this.squareSize + this.gridRect.left; // 'a'.charCodeAt(0) === 97; // this.grid[col].x; // + size + this.boardLeft;

        return { x, y };
    }

    findPiece(position: string): HTMLElement {
        const { x, y } = this.findCoordinates(position);

        const piece = document.elementFromPoint(x, y) as HTMLElement;

        return piece;
    }
}
