/*

Customized for Data Science 10
course created and taught by Professor John DeNero

Professor: denero.org
Course: dsten.github.io

Toggle on-off "Simple Mode" using the check mark in the toolbar.

Simple Mode contains the following modifications:

1. By default, shift-enter runs all cells.
2. Only edit mode exists:
	a. All command mode shortcuts are removed.
	b. The first code cell is selected upon page load.
	c. Markdown-formatted cells are automatically editable upon hover.
3. Small "scratch cell" modal is available for testing code outside of the current file.

@author: Alvin Wan
@site: alvinwan.com
*/
define([
	'base/js/namespace',
	'base/js/events'
], function(IPython, events) {
	events.on('app_initialized.NotebookApp', function() {

		/*

		Simple Mode Button

		- adds a button to the notebook toolbar
		- toggles a global simple mode variable

		icon: fortawesome.github.io/Font-Awesome/icons

		*/

		IPython.toolbar.add_buttons_group([{
			'label': 'Simple Mode Toggle',
			'icon': 'fa-square-o',
			'callback': function() {
				var button = $(this).children('i');
				button.toggleClass('fa-square-o').toggleClass('fa-check-square-o');
				window.simple = button.hasClass('fa-check-square-o');
				button.children('b').html(window.simple ? 'on' : 'off');
				if (window.simple) remove_command_mode();
				else restore_command_mode();
				toggle([
						'.input_prompt',
						'.prompt',
						'.out_prompt_overlay',
						'.dropdown:nth-child(2)',
						'.dropdown:nth-child(4)',
						'.dropdown:nth-child(5)',
						'.btn-group[id="insert_above_below"]',
						'.btn-group[id="cut_copy_paste"]',
						'.btn-group[id="move_up_down"]',
						'.btn-group[id="run_int"] .btn:first-child',
						'.form-control',
						'.btn-group .navbar-text'
					],
					'display', 'none', 'inline-block');
			}
		}]);

		// toggle specified CSS attribute between two options
		function toggle(list, attr, option1, option2) {
			var option = window.simple ? option1 : option2;
			for (var i in list) {
				item = list[i];
				$(item).css(attr, option);
			}
		}

		/*

		Simple Mode Setup

		- add a label to the DS10 Button
		- select the first cell on load

		*/

		function initialize_simple_mode() {
			$('.fa-square-o').html('	Simple mode <b>on</b>').click()
				.parents('.btn-group').css('float', 'right');
			select_cell($('.cell:first-child'));
		}

		/*

		Shortcut Objects Handling

		- save objects to a global variable
		- restore objects from global variable

		*/

		kbd = IPython.keyboard_manager;
		cmd = kbd.command_shortcuts;
		edt = kbd.edit_shortcuts;

		function remove_command_mode() {
			freeze_object('commands', cmd);
			freeze_object('edits', edt);
			cmd.clear_shortcuts();
			edt.clear_shortcuts();
			add_simple_shortcuts();
			$('.simple_modal').show();
			$('#simple_mode').attr('rel', 'stylesheet');
		}

		function restore_command_mode() {
			restore_object('commands', cmd);
			restore_object('edits', edt);
			$('.simple_modal').hide();
			$('#simple_mode').attr('rel', 'simple-mode-deactivated');
		}

		function add_simple_shortcuts() {
			edt.add_shortcut('shift-enter', function() {
				if (window.modal) {
					run($('.modal_cell'));
				} else {
					$('.code_cell:not(.modal_cell)').each(function() {
						run(this);
					});
				}
			});
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

		/*

		Preventing Other Modes

		- destroy all "command mode" shortcuts
		- make text cell editable on hover
		- select the first cell on load (buggy)

		*/

		$(document).on('mouseenter', '.text_cell', function() {
			if (window.simple) keep_state(select_cell, this);
		});

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

		function initialize_simple_modal() {
			window.modal = false;
			$('#insert-cell-below').click();
		}

		window.toggle_simple_modal = function() {
			$('.code_cell:nth-child(2)').toggleClass('show');
			$('.simple_modal').toggleClass('show');
			window.modal = $('.code_cell:nth-child(2)').hasClass('show');
			$('.simple_modal .button').html(window.modal ? 'Deactivate' : 'Activate');
		}

		// basic initializers

		initialize_simple_mode();
		initialize_simple_modal();

		$(document).ready(function() {
			$('head').append('<link href="/custom/dsten.css" rel="stylesheet" id="simple_mode">');
			$('#notebook').append('<div class="simple_modal"><div class="simple_text"><h3>Scratch Cell</h3>' + '<p>"Scratch" offers a small sandbox environment, independent of your IPython notebook. ' + 'Shift+Enter with the Scratch Cell open to run it.</div><div class="button" ' + 'onclick="toggle_simple_modal()">Activate</div></div>');
		});

	});
});