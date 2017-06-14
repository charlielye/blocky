import { Block, BlockGrid, COLOURS, MAX_X, MAX_Y } from '../app/javascript/grid';
import { assert } from 'chai';

let { describe, it } = window;

describe('Block', () => {

    it('should be created with correctly', () => {
        let testCoords = [
            [1, 2],
            [4, 9],
            [0, 0]
        ];

        testCoords.forEach((testCoord) => {
            let block = new Block(...testCoord);
            assert.equal(block.x, testCoord[0], 'x is set correctly');
            assert.equal(block.y, testCoord[1], 'y is set correctly');
            assert.ok(COLOURS.indexOf(block.colour) > -1, 'colour is valid');
        });
    });

});

describe('BlockGrid', () => {
    let grid = new BlockGrid();

    it('mark correct blocks for removal', () => {
        for (let x = 0; x < MAX_X; x++) {
            for (let y = 0; y < MAX_Y; y++) {
                grid.grid[x][y].colour = COLOURS[0];
            }
        }
        for (let x = 0; x < MAX_X; x++) {
            grid.grid[x][4].colour = COLOURS[1];
            grid.grid[x][6].colour = COLOURS[1];
        }
        for (let y = 0; y < MAX_Y; y++) {
            grid.grid[4][y].colour = COLOURS[1];
        }

        let block = grid.grid[4][4];
        grid.nullifyRegion(block.x, block.y, block.colour);

        for (let x = 0; x < MAX_X; x++) {
            if (x == 4) continue;
            for (let y = 0; y < MAX_Y; y++) {
                if (y == 4 || y == 6) continue;
                assert.isNotNull(grid.grid[x][y]);
            }
        }
        for (let x = 0; x < MAX_X; x++) {
            assert.isNull(grid.grid[x][4]);
            assert.isNull(grid.grid[x][6]);
        }
        for (let y = 0; y < MAX_Y; y++) {
            assert.isNull(grid.grid[4][y]);
        }
    });

    it('collapse null blocks', () => {
        grid.collapseNullBlocks();

        for (let x = 0; x < MAX_X; x++) {
            for (let y = 0; y < MAX_Y; y++) {
                if (x == 4 || y >= MAX_Y-2) {
                    assert.isUndefined(grid.grid[x][y]);
                } else {
                    assert.isNotNull(grid.grid[x][y]);
                }
            }
        }
    });
});
