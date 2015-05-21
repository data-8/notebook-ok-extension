/*

Customized for Data Science 10
taught by Professor DeNero

Toggle on-off "Simple Mode" using the check mark in the toolbar.

Simple Mode contains the following modifications:

1. By default, shift-enter runs all cells.
2. Only edit mode exists:
    a. All command mode shortcuts are removed.
    b. The first code cell is selected upon page load.
    c. Markdown-formatted cells are automatically editable upon hover.
3. Small "scratch cell" modal is available for testing code outside of the current file.
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
                'icon'    : 'fa-square-o',
                'callback': function() {
                    var button = $(this).children('i');
                    button.toggleClass('fa-square-o').toggleClass('fa-check-square-o');
                    window.simple = button.hasClass('fa-check-square-o');
                    button.children('b').html(window.simple ? 'on' : 'off');
                    if (window.simple) remove_command_mode();
                    else restore_command_mode();
                    toggle([
                        '.input_prompt',
                        '.dropdown:nth-child(2)',
                        '.dropdown:nth-child(4)',
                        '.dropdown:nth-child(5)',
                        '.btn-group[id="insert_above_below"]',
                        '.btn-group[id="cut_copy_paste"]',
                        '.btn-group[id="move_up_down"]',
                        '.btn-group[id="run_int"] .btn:first-child',
                        '.form-control',
                        '.btn-group .navbar-text'],
                        'display', 'none', 'inline-block');
                }
            }
        ]);
        
        /*
                
        Simple Mode Setup
        
        - add a label to the DS10 Button
        - select the first cell on load
        
        */
        
        function initialize_simple_mode() {
            $('.fa-square-o').html('    Simple mode <b>on</b>').click();
            select_cell($('.cell:first-child'));
        }
        
        function remove_command_mode() {
            console.log('Simple Mode: Command mode deactivated.');
            kbd = IPython.keyboard_manager;
            cmd = kbd.command_shortcuts;
            edt = kbd.edit_shortcuts;
            freeze_object('commands', cmd);
            freeze_object('edits', edt);
            cmd.clear_shortcuts()
            edt.clear_shortcuts()
        }
        
        function restore_command_mode() {
            console.log('Simple Mode: Command mode restored.')
            kbd = IPython.keyboard_manager;
            cmd = kbd.command_shortcuts;
            edt = kbd.edit_shortcuts;
            restore_object('commands', cmd);
            restore_object('edits', edt)
        }
        
        function freeze_object(variable, obj) {
            window[variable] = {};
            for (var key in obj) {
                if (obj.hasOwnProperty(key)) {
                    window[variable][key] = obj[key];
                }
            }
        }
        
        function restore_object(variable, obj) {
            for (var key in window[variable]) {
                obj[key] = window[variable][key];
            }
        }
        
        function toggle(list, attr, option1, option2) {
            var option = window.simple ? option1 : option2;
            for (var i in list) {
                item = list[i];
                $(item).css(attr, option);
            }
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
                    $('.code_cell').each(function() {
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
                    }
                });
            }
        });
        
        /*
        
        Preventing Other Modes
        
        - destroy all "command mode" shortcuts
        - make text cell editable on hover
        - select the first cell on load (buggy)
        
        */

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
        
        /*
        
        "Scratch Cell" Modal
        
        - ever-present small bar in bottom-right
        - a single cell on expand
        - shift+enter runs only this cell
        
        */
        
        initialize_simple_mode();
        
        $(document).ready(function() {
            $('.input_prompt').css('display', 'none');
        });
        
     });
});