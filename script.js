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

    var initialChessboard =
        'WR,WN,WB,WK,WQ,WB,WK,WR,' +
        'WP,WP,WP,WP,WP,WP,WP,WP,' +
        '  ,  ,  ,  ,  ,  ,  ,  ,' +
        '  ,  ,  ,  ,  ,  ,  ,  ,' +
        '  ,  ,  ,  ,  ,  ,  ,  ,' +
        '  ,  ,  ,  ,  ,  ,  ,  ,' +
        'BP,BP,BP,BP,BP,BP,BP,BP,' +
        'BR,BN,BB,BQ,BK,BB,BK,BR';

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

    function applyToView(model) {
        var sequence = model.split(',');
        var fields = $chessboard.find('.field');
        var shortPiece, $field, color, piece;
        for (var i = 0; i < 64; i++) {
            shortPiece = sequence[i].toUpperCase();
            $field = $(fields[i]);
            $field.removeClass(pieces.join(' ')).removeClass('piece white black');
            if (shortPiece.trim().length == 0) {
                continue;
            }
            color = (shortPiece[0] == 'W') ? 'white' : 'black';
            piece = pieceDict[shortPiece[1]];
            $field.addClass('piece').addClass(color).addClass(piece);
        }
    }

    function initialize() {
        applyToView(initialChessboard);
    }

    initialize();
});