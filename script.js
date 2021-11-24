

(function () {
	
	const boardSize =4;
	const board = document.querySelector('#board');
	const score = document.querySelector('#score').querySelector('.value');
	const highscore = document.querySelector('#highscore').querySelector('.value');
	const newGameBtn = document.querySelector('#new-game');

	const BGCOLORS = [
	    '#D6CDC4', '#ECE1D7', '#E5D8C2', '#F2B179', '#F59563', '#F67C5F', '#F65E3B', 
	    '#EDCF72', '#EDCC61', '#EDC850', '#EDC53F', '#EDC22E', '#6ECC13', '#64C00B', '#5CB901'  
	];

	newGameBtn.onclick = function (event) { newGame() }

	function newGame() {
		game.newGame(boardSize);
		createBoard();
	}

	function* range(n) {
		let i = 0;

		while (i < n) {
			yield i;
			i++;
		}
	}

	function createCell(row, col) {
		const cell = document.createElement('span');

		cell.setAttribute('class', 'cell')

		cell.style.gridRowStart = `${row+1}`;
		cell.style.gridColumnStart = `${col+1}`;
		cell.style.borderRadius = '10px';
		cell.style.textAlign = 'center'
		cell.style.padding = '26px 0';

		return cell;
	}

	function createBoard() {
		board.innerHTML = '';

		board.style.gridTemplateRows = `repeat(${boardSize}, 80px`;
		board.style.gridTemplateColumns = `repeat(${boardSize}, 80px`;

		for (let row of range(boardSize)) {
			for (let col of range(boardSize)) {
				const cell = createCell(row, col);

				const value = game.getCell(row, col);

				if (value == 0) {
					cell.style.backgroundColor = BGCOLORS[0];
				} else {
					const i = Math.log2(value);

					cell.innerText = value;
					cell.style.backgroundColor = BGCOLORS[i];

					if ([2, 4].indexOf(value) != -1) {
						cell.style.color = '#776E65';
					} else {
						cell.style.color = 'white';
					}
				}

				score.innerText = game.score;

				if (game.highscore) {
					highscore.innerText = game.highscore;
				} else {
					highscore.innerText = 0;
				}
				

				board.appendChild(cell);
			}
		}
	}

	document.onkeydown = function (event) {
		switch (event.key) {
			case 'ArrowUp':
				game.moveUp();
				break;
			case 'ArrowDown':
				game.moveDown();
				break;
			case 'ArrowLeft':
				game.moveLeft();
				break;
			case 'ArrowRight':
				game.moveRight();
				break;
		}	

		if (!game.boardNotChanged) {
			createBoard();
		}	
	}

	newGame();
})();