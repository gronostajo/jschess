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

    var pieceDict = {
        'P': 'pawn',
        'R': 'rook',
        'N': 'knight',
        'B': 'bishop',
        'Q': 'queen',
        'K': 'king'
    };
    var pieces = Object.keys(pieceDict).map(function (key) {
        return pieceDict[key]
    });

    var initialChessboard = (
        'WR,WN,WB,WK,WQ,WB,WK,WR,' +
        'WP,WP,WP,WP,WP,WP,WP,WP,' +
        '  ,  ,  ,  ,  ,  ,  ,  ,' +
        '  ,  ,  ,  ,  ,  ,  ,  ,' +
        '  ,  ,  ,  ,  ,  ,  ,  ,' +
        '  ,  ,  ,  ,  ,  ,  ,  ,' +
        'BP,BP,BP,BP,BP,BP,BP,BP,' +
        'BR,BN,BB,BQ,BK,BB,BK,BR'
    ).split(',').map(function (shortPiece) {
            if (shortPiece.trim().length == 0) {
                return false;
            } else {
                return {
                    color: (shortPiece[0] == 'W') ? 'white' : 'black',
                    piece: pieceDict[shortPiece[1]]
                }
            }
        });

    function applyToView(model) {
        var fields = $chessboard.find('.field');
        var $field;
        for (var i = 0; i < 64; i++) {
            $field = $(fields[i]);
            $field.removeClass(pieces.join(' ')).removeClass('piece white black');
            if (!model[i]) {
                continue;
            }
            $field.addClass('piece').addClass(model[i].color).addClass(model[i].piece);
        }
    }

    function read(model, x, y) {
        return model[y * 8 + x];
    }

    function store(model, x, y, piece) {
        model[y * 8 + x] = piece;
    }

    function cloneModel(model) {
        return JSON.parse(JSON.stringify(model));
    }

    function initialize() {
        applyToView(initialChessboard);
    }

    initialize();
});