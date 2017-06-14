export const COLOURS = ['red', 'green', 'blue', 'yellow'];
export const MAX_X = 10;
export const MAX_Y = 10;

export class Block {
  constructor (x, y, colour) {
    this.x = x;
    this.y = y;
    this.colour = colour || COLOURS[Math.floor(Math.random() * COLOURS.length)];
  }
}

export class BlockGrid {
  constructor() {
    this.grid = [];

    for (let x = 0; x < MAX_X; x++) {
      let col = [];
      for (let y = 0; y < MAX_Y; y++) {
        col.push(new Block(x, y));
      }

      this.grid.push(col);
    }
  }

  render (el = document.querySelector('#gridEl')) {
    for (let x = 0; x < MAX_X; x++) {
      let colEl = document.createElement('div');
      colEl.className = 'col';
      colEl.id = 'col_' + x;
      el.appendChild(colEl);

      for (let y = MAX_Y - 1; y >= 0; y--) {
        let id = `block_${x}x${y}`;
        let blockEl = document.createElement('div');

        blockEl.id = id;
        blockEl.className = 'block';
        blockEl.style.background = this.grid[x][y].colour;
        blockEl.addEventListener('click', (evt) => this.blockClicked(evt, x, y));
        colEl.appendChild(blockEl);
      }
    }

    return this;
  }

  updateRender(origGrid, newGrid) {
    origGrid.map((col,x) => col.map((b,y) =>
      document.querySelector(`#block_${x}x${y}`).style.background = newGrid[x][y] ? newGrid[x][y].colour : 'gray'
    ));
  }

  nullifyRegion(x, y, colour) {
    if (x < 0 || x > MAX_X-1 || y < 0 || y > MAX_Y-1) {
      return;
    }
    if (!this.grid[x][y] || this.grid[x][y].colour != colour) {
      return;
    }
    this.grid[x][y] = null;
    this.nullifyRegion(x+1, y, colour);
    this.nullifyRegion(x-1, y, colour);
    this.nullifyRegion(x, y+1, colour);
    this.nullifyRegion(x, y-1, colour);
  }

  collapseColumn(col) {
    let newCol = col.filter(e => e);
    newCol.forEach((b,i) => b.y = i);
    return newCol;
  }

  blockClicked (e, x, y) {
    if (!this.grid[x][y]) {
      return;
    }
    let origGrid = this.grid.map(c=>c.map(b=>new Block(b.x, b.y, b.colour)));
    this.nullifyRegion(x, y, this.grid[x][y].colour);
    this.grid = this.grid.map(this.collapseColumn);
    this.updateRender(origGrid, this.grid);
  }
}

window.addEventListener('DOMContentLoaded', () => new BlockGrid().render());
