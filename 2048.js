const game = (function (obj) {

	// UTILITY FUNCTIONS 

	function* range(n) {
		let i = 0;

		while (i < n) {
			yield i;
			i++;
		}
	}

	function selectTwoRandomIndices(arr, n) {
		const r = Math.random();
		const i = Math.floor((arr.length-1)*r);
		const random = [arr[i]];

		if (n == undefined) {
			n = 1;
		}

		if (n == 2) {
			return random;
		} else {
			const newArr = arr.filter(function (item, ind) {
				return i != ind;
			})
			return random.concat(selectTwoRandomIndices(newArr, n+1))
		}
	}

	function twoOrFour() {
		return Math.random() > 0.15 ? 2 : 4;
	}

	function removeZeros(arr) {
		return arr.filter(function (num) {
			return num != 0
		});
	}

	function sumLeft(arr) {
		if (arr.length < 2) {
			return arr;
		} else {
			if (arr[0] == arr[1]) {
				const s = arr[0]+arr[1]

				score += s;
				if (score > highscore) {
					highscore = score;
				}

				return [s].concat(sumLeft(arr.slice(2)))
			} else {
				return [arr[0]].concat(sumLeft(arr.slice(1)));
			}
		}
	}

	function sumRight(arr) {
		return sumLeft(arr.reverse()).reverse();
	}

	function addZerosLeft(arr, boardSize) {
		if (arr.length < boardSize) {
			while (arr.length < boardSize) {
				arr.unshift(0);
			}
		}

		return arr;
	}

	function addZerosRight(arr, boardSize) {
		if (arr.length < boardSize) {
			while (arr.length < boardSize) {
				arr.push(0);
			}
		}

		return arr;
	}

	function getEmptyCellsIndices(board, allIndices) {
		return allIndices.filter(function ([r, c]) {
			return board[r][c] == 0
		})
	}

	function addRandomNumberToBoard(board, indices) {
		const emptyIndices = getEmptyCellsIndices(board, indices);
		const [r, c] = selectTwoRandomIndices(emptyIndices)[0];
		board[r][c] = twoOrFour();

		return board;
	}

	function getColumnsFromBoard(board, boardSize) {
		const boardColumns = [];

		for (let col of range(boardSize)) {
			const r = [];
			for (let row of range(boardSize)) {
				r.push(board[row][col])
			}
			boardColumns.push(r);
		}

		return boardColumns;
	}

	function applyColumnsToBoard(boardColumns, boardSize) {
		const board = [];

		for (let col of range(boardSize)) {
			const r = [];
			for (let row of range(boardSize)) {
				r.push(boardColumns[row][col]);
			}
			board.push(r);
		}

		return board;
	}

	function boardHasNotChanged(prevBoard, newBoard) {
		let value = true;

		newBoard.forEach(function (ro, i) {
			ro.forEach(function (co, j) {
				value = value && (prevBoard[i][j] == co);
			})
		})

		return value;
	}

	function boardUpdate(oldBoard, newBoard) {
		if (!boardHasNotChanged(oldBoard, newBoard)) {
			boardNotChanged = false;
			return addRandomNumberToBoard(newBoard, allIndices);
		} else {
			boardNotChanged = true;
			return null;
		}
	}

	// GLOBAL VARIABLES

	let allIndices;
	let score;
	let highscore;
	let boardNotChanged;

	// OBJECT PROERTIES
	
	obj.board = null;
	obj.boardSize = null;

	// GAME OBJECT METHODS 

	obj.newGame = function (boardSize) {
		score = 0;
		highscore = 0;
		boardNotChanged = false;

		obj.board = [];
		obj.boardSize = boardSize;

		allIndices = [];

		for (let row of range(boardSize)) {
			const c = [];
			for (let col of range(boardSize)) {
				c.push(0);
				allIndices.push([row, col]);
			}
			obj.board.push(c);
		}

		const [[r1, c1], [r2, c2]] = selectTwoRandomIndices(allIndices);

		obj.board[r1][c1] = twoOrFour();
		obj.board[r2][c2] = twoOrFour();
	}	

	obj.moveLeft = function () {
		const board = [];

		for (let row of range(obj.boardSize)) {
			const result = addZerosRight(sumLeft(removeZeros(obj.board[row])), obj.boardSize);
			board.push(result);
		}

		// if (!boardHasNotChanged(obj.board, board)) {
		// 	obj.board = addRandomNumberToBoard(board, allIndices);
		// }
		const update = boardUpdate(obj.board, board)
		if (update) {
			obj.board = update;
		}
	}

	obj.moveRight = function () {
		const board = [];

		for (let row of range(obj.boardSize)) {
			const result = addZerosLeft(sumRight(removeZeros(obj.board[row])), obj.boardSize);
			board.push(result);
		}

		// if (!boardHasNotChanged(obj.board, board)) {
		// 	obj.board = addRandomNumberToBoard(board, allIndices);
		// }
		const update = boardUpdate(obj.board, board)
		if (update) {
			obj.board = update;
		}
	}

	obj.moveUp = function () {
		const boardCol = [];
		const boardColumns = getColumnsFromBoard(obj.board, obj.boardSize);

		for (let col of range(obj.boardSize)) {
			const res = addZerosRight(sumLeft(removeZeros(boardColumns[col])), obj.boardSize);
			boardCol.push(res);
		}

		const board = applyColumnsToBoard(boardCol, obj.boardSize);
		// if (!boardHasNotChanged(obj.board, board)) {
		// 	obj.board = addRandomNumberToBoard(board, allIndices);
		// }
		const update = boardUpdate(obj.board, board)
		if (update) {
			obj.board = update;
		}
	}

	obj.moveDown = function () {
		const boardCol = [];
		const boardColumns = getColumnsFromBoard(obj.board, obj.boardSize);

		for (let col of range(obj.boardSize)) {
			const result = addZerosLeft(sumRight(removeZeros(boardColumns[col])), obj.boardSize);
			boardCol.push(result);
		}

		const board = applyColumnsToBoard(boardCol, obj.boardSize);
	
		const update = boardUpdate(obj.board, board);
		if (update) {
			obj.board = update;
		}
	}

	obj.getCell = function (ro, co) {
		return obj.board[ro][co];
	}

	return {
		...obj,
		get highscore() {
			return highscore;
		},
		get score() {
			return score;
		},
		get boardNotChanged() {
			return boardNotChanged;
		}
	}
})({});

