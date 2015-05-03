/*

Customized for Data Science 10
taught by Professor DeNero

Toggle on-off "DS10 Mode" using the check mark in the toolbar.

DS10 Mode contains the following modifications:

1. By default, shift-enter runs all cells.
2. Cells are editable upon hover.
3. Only edit mode exists:
    a. One code cell is selected at all times, for text input.
    b. Typed characters are always entered as text and not as commands.
    c. The first code cell is selected upon page load.
*/

define([
     'base/js/namespace',
     'base/js/events'
 ], function(IPython, events) {
     events.on('app_initialized.NotebookApp', function(){

        /*
        
        DS10 Mode Button
        
        - adds a button to the notebook toolbar
        - toggles a global ds10 mode variable
        
        icon: fortawesome.github.io/Font-Awesome/icons
        
        */

        IPython.toolbar.add_buttons_group([
            {
                'label'   : 'DS10 Toggle',
                'icon'    : 'fa-check-square-o',
                'callback': function() {
                    var button = $(this).children('i');
                    button.toggleClass('fa-square-o').toggleClass('fa-check-square-o');
                    window.ds10 = button.hasClass('fa-check-square-o');
                    button.children('b').html(window.ds10 ? 'on' : 'off');
                }
            }
        ]);
        
        function add_ds10_label() {
            $('.fa-check-square-o').html('    DS10 mode <b>on</b>');
        }
        
        /*
        
        Custom Commands
        
        - run only if global ds10 mode is turned on
        
        Ref: http://www.sitepoint.com/jquery-capture-multiple-key-press-combinations/
        
        */
             
        var shortcuts = [
            {
                // Run all cells on shift-enter
                key: 13,
                func: function() {
                    $('.cell').each(function() {
                        run(this);
                    });
                }
            }
        ];

        var shift = 16;
        var shifted = false;
        
        $(document).keyup(function(e) {
            if (e.which == shift) shifted = false;
        }).keydown(function(e) {
            if (e.which == shift) shifted = true;
            if (shifted == true && window.ds10) {
                jQuery.each(shortcuts, function(i) {
                    if (shortcuts[i].key == e.which) {
                        shortcuts[i].func(e);
                        throw '';
                    }
                });
            }
        });
        
        /*
        
        Preventing Other Modes
        
        - make text cell editable on hover
        - select the first cell on load
        
        */

        $(document).on('mouseenter', '.text_cell', function() {
            keep_state(select_cell, this);
        });

        function keep_state(func, arg) {
            var cell = $('.selected');
            if (arg == null) func();
            else func(arg);
            select_cell(cell);
        }
        
        function select_cell(self) {
            console.log('DS10: Auto-selecting cell.');
            $(self).click().dblclick();
        }
        
        function run(self) {
            console.log('DS10: Auto-running cell.');
            $(self).click();
            $('#run_cell').click();
        }
        
        /*
        
        DS10 Mode Setup
        
        - add a label to the DS10 Button
        - select the first cell on load
        
        */
        
        window.ds10 = true;
        add_ds10_label();
        select_cell($('.cell:first-child'));
     });
});