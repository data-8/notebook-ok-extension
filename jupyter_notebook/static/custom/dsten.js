/*

Customized for Data Science 10
taught by Professor DeNero

Toggle on-off "DS10 Mode" using the check mark in the toolbar.

DS10 Mode contains the following modifications:

1. By default, shift-enter runs all, in place. (bug: jumps down to bottom of page)
2. All cells are immediately selected and editable upon hover.
3. Only edit mode exists:
    a. One code cell is selected at all times, for text input.
    b. Typed characters are always entered as text and not as commands.
*/

define([
     'base/js/namespace',
     'base/js/events'
 ], function(IPython, events) {
     events.on('app_initialized.NotebookApp', function(){

        /*
        Enabling and Disabling DS10 Mode
        - adds a button the notebook toolbar, as a check mark
        - toggles a global ds10 mode variable
        */
        
        window.ds10 = true;

        IPython.toolbar.add_buttons_group([
            {
                'label'   : 'toggle DS10 mode',
                'icon'    : 'fa-check-square-o', // select your icon from http://fortawesome.github.io/Font-Awesome/icons
                'callback': function () {
                    var button = $(this).children('i');
                    if (button.hasClass('fa-square-o')) {
                        window.ds10 = true;
                        button.removeClass('fa-square-o').addClass('fa-check-square-o');
                    } else {
                        window.ds10 = false;
                        button.removeClass('fa-check-square-o').addClass('fa-square-o');
                    }
                }
            }
        ]);
        
        /*
        Custom Commands
        - run only if global ds10 mode is turned on
        */
             
        // commands
        var arrShortCut = [
            { name: 'shift-enter', key: 13, fx: shiftEnter }
        ];
        
        function shiftEnter(e) {
            var cell = $('.cell.selected');
            $('#run_all_cells').click();
            cell.click();
            $(window).scrollTop(0);
        }
        
        // inner workings
        var iShortCutControlKey = 16; // SHIFT;
        var bIsControlKeyActived = false;
        
        // http://www.sitepoint.com/jquery-capture-multiple-key-press-combinations/
        $(document).keyup(function(e) {
         if (e.which == iShortCutControlKey) bIsControlKeyActived = false;
        }).keydown(function(e) {
         if (e.which == iShortCutControlKey) bIsControlKeyActived = true;
         if (bIsControlKeyActived == true && window.ds10) {
             jQuery.each(arrShortCut, function(i) {
                 if (arrShortCut[i].key == e.which) {
                     arrShortCut[i].fx(e);
                     throw '';
                 }
             });
         }
        });
        
        /*
        Preventing Other Modes
        */

        $(document).on('mouseenter', '.cell', function() {
            // select and focus on hover
        });
        
        $(document).on('mouseleave', '.cell_text', function() {
            // if text cell, prettify before leaving
        });
        
        function select_first_cell() {
            // on load, select a cell, and focus -- maintains invariant 
            // that one cell is selected at all times
            $('.cell:first-child .CodeMirror-lines').click();
        }
        
        select_first_cell();
     });
});