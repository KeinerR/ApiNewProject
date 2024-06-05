$(document).ready(function () {
    function formatState(state) {
        if (!state.id) {
            return state.text;
        }
        var $state = $(
            '<span><i class="' + $(state.element).data('icon') + '"></i> ' + state.text + '</span>'
        );
        return $state;
    };

    $("#TipoMovimiento").select2({
        templateResult: formatState,
        templateSelection: formatState
    });
});