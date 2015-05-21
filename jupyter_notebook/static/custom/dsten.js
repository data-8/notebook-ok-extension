/*

Customized for Data Science 10
taught by Professor DeNero

Toggle on-off "Simple Mode" using the check mark in the toolbar.

Simple Mode contains the following modifications:

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
        
        Simple Mode Button
        
        - adds a button to the notebook toolbar
        - toggles a global simple mode variable
        
        icon: fortawesome.github.io/Font-Awesome/icons
        
        */

        IPython.toolbar.add_buttons_group([
            {
                'label'   : 'Simple Mode Toggle',
                'icon'    : 'fa-check-square-o',
                'callback': function() {
                    var button = $(this).children('i');
                    button.toggleClass('fa-square-o').toggleClass('fa-check-square-o');
                    window.simple = button.hasClass('fa-check-square-o');
                    button.children('b').html(window.simple ? 'on' : 'off');
                }
            }
        ]);
        
        function add_simple_label() {
            $('.fa-check-square-o').html('    Simple mode <b>on</b>');
        }
        
        /*
        
        Custom Commands
        
        - run only if global simple mode is turned on
        
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
            if (shifted == true && window.simple) {
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
        
        - forcibly restore command mode to edit mode on switch
        - make text cell editable on hover
        - select the first cell on load (buggy)
        
        */
        
        function revive() {
            if ($('.notebook_app').hasClass('command_mode')) {
                $('.notebook_app').removeClass('command_mode').addClass('edit_mode');
            }
        }

        $(document).on('mouseenter', '.text_cell', function() {
            if (window.simple) keep_state(select_cell, this);
        });
        
        $(document).on('mouseenter', '.out_prompt_overlay', function() {
            if (window.simple) $(this).hide();
        })

        function keep_state(func, arg) {
            var cell = $('.selected');
            func(arg);
            select_cell(cell);
        }
        
        function select_cell(self) {
            $(self).click().dblclick();
        }
        
        function run(self) {
            $(self).click();
            $('#run_cell').click();
        }
        
        revert = setInterval(revive, 1000)
        
        /*
        
        Simple Mode Setup
        
        - add a label to the DS10 Button
        - select the first cell on load
        
        */
        
        window.simple = true;
        add_simple_label();
        select_cell($('.cell:first-child'));
     });
});