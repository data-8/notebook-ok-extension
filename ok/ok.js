/*
Integration of OK and disabling structural edits.

@author: Alvin Wan
@site: alvinwan.com
*/
define([
	'base/js/namespace'
], function(IPython) {
	function _on_load() {

		/*

		Edit Mode Button

		- adds a button to the notebook toolbar
		- toggles a global edit mode variable

		icon: fortawesome.github.io/Font-Awesome/icons

		*/

		EDIT_CELL_CLASS = 'edit-mode-cell';

		IPython.toolbar.add_buttons_group([{
			'label': 'Edit',
			'icon': 'fa-square-o',
			'callback': function() {
				var button = $(this).children('i');
				button.toggleClass('fa-square-o').toggleClass('fa-check-square-o');
				window.no_edit = button.hasClass('fa-square-o');
				button.children('b').html(window.no_edit ? 'off' : 'on');
				if (window.no_edit) {
					remove_command_mode();
				} else {
					restore_command_mode();
				}
				toggle_edit_ui();
			}
		}]);

		// toggle specified CSS attribute between two options
		function toggle(list, attr, option1, option2) {
			var option = window.no_edit ? option1 : option2;
			for (var i in list) {
				item = list[i];
				$(item).css(attr, option);
			}
		}

		/*

		Edit Mode Setup

		- add a label to the edit button
		- select the first cell on load

		*/

		function initialize_no_edit_mode() {
			$('.fa-square-o').html('	Edit mode <b>off</b>')
				.parents('.btn-group').css('float', 'right');
			select_cell($('.cell:first-child'));
		}

		function pick_cell() {
			if ($('.'+EDIT_CELL_CLASS).length == 0) {
				candidate = next_available_code_cell();
				candidate.addClass(EDIT_CELL_CLASS);
			}
		}

		function unpick_cell() {
			$('.'+EDIT_CELL_CLASS).remove();
		}

		/*

		Ok Test Button

		- adds a button to the notebook toolbar
		- prompts user for and stores path to ok client binary
		- invokes `python3 ok --extension notebook`

		*/

		IPython.toolbar.add_buttons_group([{
			'label': 'Run ok tests',
			'icon': 'fa-user-secret',
			'callback': function() {
				run_script("import subprocess\nsubprocess.call(['python3', 'ok', '--extension', 'notebook'], env=os.environ.copy())");
				location.reload();
			}
		}]);

		/*

		OK Test Setup

		- add a label to the OK Button

		*/

		function initialize_ok_tests() {
			$('.fa-user-secret').html('	   Run ok tests')
				.parents('.btn-group').css('float', 'right').attr('id', 'ok_tests');
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
			add_edit_shortcuts();
			$('.edit_modal').show();
			$('#no_edit_mode').attr('rel', 'stylesheet');
		}

		function restore_command_mode() {
			restore_object('commands', cmd);
			restore_object('edits', edt);
			$('.edit_modal').hide();
			$('#no_edit_mode').attr('rel', 'edit-mode-deactivated');
		}

		function add_edit_shortcuts() {
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

		function toggle_edit_ui() {
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
			toggle([
				'.btn-group[id="ok_tests"]',
				'.'+EDIT_CELL_CLASS,
				'.edit_modal'
			], 'display', 'inline-block', 'none');
		}
		/*

		Utilities

		- Preventing Other Modes
			- destroy all "command mode" shortcuts
			- make text cell editable on hover
			- select the first cell on load (buggy)
		- Running Shell Script
			- if a cell is empty

		*/

		// Preventing Other Modes

		function select_cell(self) {
			$(self).click().dblclick();
		}

		function run(self) {
			$(self).click();
			$('#run_cell').click();
		}

		// Running Shell Script

		function run_script(script) {
			console.log('[Notebook] executing: '+script);
			var kernel = IPython.notebook.kernel;
            kernel.execute(script);
		}

		// TODO: a code cell with one character is "empty", according to this but empty has length of 1 0.o
		function is_empty(code_cell) {
			container = code_cell.find('.CodeMirror-code').children('pre').children('span');
			return container.contents('span').length == 1 && $(container.children('span')[0]).html().length <= 1;
		}

		function next_available_code_cell() {
			selector = '.code_cell:last-of-type';
			return next_available_cell(selector);
		}

		function next_available_cell(selector) {
			candidate = $(selector);
			if (is_empty(candidate)) {
				console.log('[Edit Mode] Cell empty. Selecting cell.');
				return candidate;
			} else {
				console.log('[Edit Mode] Cell not empty. Adding new cell.');
				select_cell($('.cell:last-child'));
				$('#insert_cell_below').click();
				return next_available_code_cell();
			}
		}

		/*

		"Scratch Cell" Modal

		- ever-present small bar in bottom-right
		- a single cell on expand
		- shift+enter runs only this cell

		*/

		function initialize_edit_modal() {
			window.modal = false;
			$('#insert-cell-below').click();
		}

		window.toggle_edit_modal = function() {
			if ($('.'+EDIT_CELL_CLASS).length > 0) unpick_cell(); else pick_cell();
			$('.'+EDIT_CELL_CLASS).toggleClass('shown');
			$('.edit_modal').toggleClass('shown');
			window.modal = $('.'+EDIT_CELL_CLASS).hasClass('shown');
			$('.edit_modal .button').html(window.modal ? 'Deactivate' : 'Scratch');
		}

		$(document).ready(function() {

			// JS initializers

			initialize_no_edit_mode();
			initialize_edit_modal();
			initialize_ok_tests();

			// DOM initializers

			$('head').append('<link href="/nbextensions/ok/ok.css" rel="stylesheet" id="no_edit_mode">');
			$('head').append('<script src="https://rawgit.com/dwachss/bililiteRange/master/bililiteRange.js"></script>');
			$('head').append('<script src="https://rawgit.com/dwachss/bililiteRange/master/jquery.sendkeys.js"></script>');
			$('#notebook').append('<div class="edit_modal"><div class="edit_text"></div><div class="button" ' + 'onclick="toggle_edit_modal()">Scratch</div></div>');
		});
	}

	return {load_ipython_extension: _on_load}
});
