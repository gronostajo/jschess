$(function () {
    var $chessboard;

    function createChessboard(element) {
        var i, j, row, field;
        element.addClass('chessboard');
        element.empty();
        for (i = 0; i < 8; i++) {
            row = $('<div>').addClass('row');
            for (j = 0; j < 8; j++) {
                $('<div>').addClass('field').appendTo(row);
            }
            row.appendTo(element);
        }
    }

    $chessboard = $('#chessboard');
    createChessboard($chessboard);

    var pieceClassDict = {
        'P': 'pawn',
        'R': 'rook',
        'N': 'knight',
        'B': 'bishop',
        'Q': 'queen',
        'K': 'king'
    };
    var pieceClasses = Object.keys(pieceClassDict).map(function (key) {
        return pieceClassDict[key]
    });

    function Piece(type, color) {
        this.type = type;
        this.color = color;
        this.moved = false;
    }

    var initialModel = (
        'WR,WN,WB,WK,WQ,WB,WN,WR,' +
        'WP,WP,WP,WP,WP,WP,WP,WP,' +
        '  ,  ,  ,  ,  ,  ,  ,  ,' +
        '  ,  ,  ,  ,  ,  ,  ,  ,' +
        '  ,  ,  ,  ,  ,  ,  ,  ,' +
        '  ,  ,  ,  ,  ,  ,  ,  ,' +
        'BP,BP,BP,BP,BP,BP,BP,BP,' +
        'BR,BN,BB,BQ,BK,BB,BN,BR'
    ).split(',').map(function (shortPiece) {
        if (shortPiece.trim().length == 0) {
            return false;
        } else {
            var fullType = pieceClassDict[shortPiece[1]];
            var fullColor = (shortPiece[0] == 'W') ? 'white' : 'black';
            return new Piece(fullType, fullColor)
        }
    });

    function applyToView(model) {
        var fields = $chessboard.find('.field');
        var $field;
        for (var i = 0; i < 64; i++) {
            $field = $(fields[i]);
            $field.removeClass(pieceClasses.join(' ')).removeClass('piece white black');
            if (!model[i]) {
                continue;
            }
            $field.addClass('piece').addClass(model[i].color).addClass(model[i].type);
        }
    }

    function setHighlightedFields(highlightedPositions) {
        var fields = $chessboard.find('.field');
        fields.removeClass('active highlighted');
        for (var i = 0; i < highlightedPositions.length; i++) {
            var pos = highlightedPositions[i];
            var offset = pos.y * 8 + pos.x;
            $(fields[offset]).addClass(pos.active ? 'active' : 'highlighted');
        }
    }

    function read(model, x, y) {
        return model[y * 8 + x];
    }

    function store(model, x, y, piece) {
        piece.moved = true;
        model[y * 8 + x] = piece;
    }

    function cloneModel(model) {
        return JSON.parse(JSON.stringify(model));
    }

    function Pos(x, y, active) {
        this.x = x;
        this.y = y;
        this.active = active;
    }

    function isValidPos(x, y) {
        return (x >= 0) && (x <= 7) && (y >= 0) && (y <= 7);
    }

    function getPossibleMovesForPiece(model, x, y) {
        var possiblePositions = [];
        var piece = read(model, x, y);
        var basicMove, multiplier, multipliedMove, directionX, directionY, posX, posY, moveset, move, i;
        switch (piece.type) {
            case 'pawn':
                basicMove = (piece.color == 'white') ? 1 : -1;
                if (!isValidPos(x, y + basicMove) || read(model, x, y + basicMove)) {
                    return [];
                }
                possiblePositions.push(new Pos(x, y + basicMove));
                if (piece.moved || !isValidPos(x, y + 2 * basicMove) || read(model, x, y + 2 * basicMove)) {
                    return possiblePositions;
                }
                possiblePositions.push(new Pos(x, y + 2 * basicMove));
                return possiblePositions;
            case 'rook':
                // these loops run only twice (for -1 and for 1) but it's more concise this way
                // X (horizontal) loop
                for (basicMove = -1; basicMove <= 1; basicMove += 2) {
                    for (multiplier = 1; multiplier < 8; multiplier++) {
                        multipliedMove = basicMove * multiplier;
                        if (!isValidPos(x + multipliedMove, y) || read(model, x + multipliedMove, y)) {
                            break;
                        }
                        possiblePositions.push(new Pos(x + multipliedMove, y));
                    }
                }
                // Y (vertical) loop
                for (basicMove = -1; basicMove <= 1; basicMove += 2) {
                    for (multiplier = 1; multiplier < 8; multiplier++) {
                        multipliedMove = basicMove * multiplier;
                        if (!isValidPos(x, y + multipliedMove) || read(model, x, y + multipliedMove)) {
                            break;
                        }
                        possiblePositions.push(new Pos(x, y + multipliedMove));
                    }
                }
                return possiblePositions;
            case 'knight':
                moveset = [[-2, -1], [-1, -2], [1, -2], [2, -1], [2, 1], [1, 2], [-1, 2], [-2, 1]];
                for (i = 0; i < moveset.length; i++) {
                    move = moveset[i];
                    posX = x + move[0];
                    posY = y + move[1];
                    if (!isValidPos(posX, posY) || read(model, posX, posY)) {
                        continue;
                    }
                    possiblePositions.push(new Pos(posX, posY));
                }
                return possiblePositions;
            case 'bishop':
                // again, just 2-value loops for brevity
                for (directionX = -1; directionX <= 1; directionX += 2) {
                    for (directionY = -1; directionY <= 1; directionY += 2) {
                        for (multiplier = 1; multiplier < 8; multiplier++) {
                            posX = x + directionX * multiplier;
                            posY = y + directionY * multiplier;
                            if (!isValidPos(posX, posY) || read(model, posX, posY)) {
                                break;
                            }
                            possiblePositions.push(new Pos(posX, posY));
                        }
                    }
                }
                return possiblePositions;
            case 'queen':
                // outer and middle loop change direction, inner loop drives distance {
                for (directionX = -1; directionX <= 1; directionX++) {
                    for (directionY = -1; directionY <= 1; directionY++) {
                        if (directionX == 0 && directionY == 0) {
                            continue;
                        }
                        for (multiplier = 1; multiplier < 8; multiplier++) {
                            posX = x + directionX * multiplier;
                            posY = y + directionY * multiplier;
                            if (!isValidPos(posX, posY) || read(model, posX, posY)) {
                                break;
                            }
                            possiblePositions.push(new Pos(posX, posY));
                        }
                    }
                }
                return possiblePositions;
            case 'king':
                for (directionX = -1; directionX <= 1; directionX++) {
                    for (directionY = -1; directionY <= 1; directionY++) {
                        if (directionX == 0 && directionY == 0) {
                            continue;
                        }
                        posX = x + directionX;
                        posY = y + directionY;
                        if (!isValidPos(posX, posY) || read(model, posX, posY)) {
                            break;
                        }
                        possiblePositions.push(new Pos(posX, posY));
                    }
                }
                return possiblePositions;
            default:
                throw new Error('Unknown piece type ' + piece.type);
        }
    }

    var model = {
        chessboard: null
    };

    $chessboard.find('.field').click(function () {
        if (!$(this).hasClass('piece')) {
            return;
        }
        var $fields = $chessboard.find('.field');
        var offset = $fields.toArray().indexOf(this);
        var x = offset % 8;
        var y = (offset - x) / 8;
        var possibleMoves = getPossibleMovesForPiece(model.chessboard, x, y);
        setHighlightedFields(possibleMoves.concat(new Pos(x, y, true)));
    });

    function initialize() {
        model.chessboard = initialModel;
        applyToView(model.chessboard);
        setHighlightedFields([]);
    }

    initialize();
});