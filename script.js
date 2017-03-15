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

    // hardcoded pieces here
    var piece, pieces, whiteRow, blackRow, i;
    $chessboard.find('.row:nth-child(2) .field').addClass('piece white pawn');
    $chessboard.find('.row:nth-child(7) .field').addClass('piece black pawn');
    pieces = ['rook', 'knight', 'bishop', 'king', 'queen', 'bishop', 'knight', 'rook'];
    whiteRow = $chessboard.find('.row:first-child .field').addClass('piece white');
    blackRow = $chessboard.find('.row:last-child .field').addClass('piece black');
    for (i = 0; i < 8; i++) {
        piece = pieces[i];
        $(whiteRow[i]).addClass(piece);
        $(blackRow[7-i]).addClass(piece);
    }
});