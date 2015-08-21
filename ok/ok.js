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

		EDIT_CELL_CLASS = 'edit_mode_cell';

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
				window.last_exec = -1;
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
			$('.fa-square-o').html('	Edit mode <b>off</b>').click().click()
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
				IPython.notebook.save_checkpoint();
				var name = IPython.notebook.notebook_name;

				/*

				Export the current notebook as a Python file called submission.py,
				then execute all "ok" cells

				*/
				var cmd = '!ipython nbconvert --to python --stdout '
				cmd += '"' + name + '" | grep -v "^get_ipython" > submission.py',
				run_script(cmd, function (response) {
					console.log("Finished exporting");
					$.each(IPython.notebook.get_cells(),
						function () {
							console.log(this);
							if (this.get_text().startsWith('# ok')) {
								this.execute()
							}
						}
					)
				})
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
			hide_special_inputs()
		}

		function restore_command_mode() {
			restore_object('commands', cmd);
			restore_object('edits', edt);
			$('.edit_modal').hide();
			$('#no_edit_mode').attr('rel', 'edit-mode-deactivated');
			show_all_inputs();
		}

		function add_edit_shortcuts() {
			edt.add_shortcut('shift-enter', function() {
				if (window.modal) {
					run($('.edit_mode_cell'));
				} else {
					var cells = get_normal_cells();
					// Index of the selected element
					var selected = $.map(cells, function(cell, index) {
					    if(cell.selected) { return index; }
					})[0];
					if (!isFinite(selected)) {
						console.log("No selected cell: " + cells);
						return;
					}
					console.log("Selected index: " + selected);

					$(get_ok_cells()).each(function (i, cell) {
						cell.clear_output()
					});

					var previous = window.last_exec
					window.last_exec = selected;
					if (selected < previous) {
						IPython.notebook.clear_all_output()
						run_slice(cells, 0, selected);
					} else if (selected == previous) {
						run_slice(cells, selected, selected);
					} else {
						run_slice(cells, previous+1, selected);
					}
				}
			});
		}

		// All cells except hidden cells and the edit modal cell
		function get_normal_cells() {
			var all = IPython.notebook.get_cells()
			return all.filter(function (cell) {
				if (cell.cell_type != "code") { return false; }
				if (is_special_cell(cell)) { return false; }
				return true;
			});
		}

		function get_ok_cells() {
			var all = IPython.notebook.get_cells()
			return all.filter(function (cell) {
				if (cell.cell_type != "code") { return false; }
				var text = cell.get_text().toLowerCase();
				return text.startsWith("# ok");
			});
		}

		function run_slice(cells, start, end) {
			$(cells).slice(start, end+1).each(function(i, cell) {
				console.log("Clearing cell: " + (i + start));
				cell.clear_output();
			});
			$(cells).slice(start, end+1).each(function(i, cell) {
				console.log("Executing cell: " + (i + start));
				cell.execute();
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

		function hide_special_inputs() {
			$.each(IPython.notebook.get_cells(), function() {
				if (is_special_cell(this)) {
					this.element.find('.input').hide();
				}
			});
		}

		function is_special_cell(cell) {
			var text = cell.get_text().toLowerCase();
			if(text.startsWith("# hidden")) { return true; }
			if(text.startsWith("# ok")) { return true; }
			if(cell.element.hasClass(EDIT_CELL_CLASS)) { return true; }
			return false;
		}

		function show_all_inputs() {
			$('.code_cell:not(.edit_mode_cell)').each(function() {
				$(this).find('.input').show();
			});
		}

		function toggle_edit_ui() {
			toggle([
					'.input_prompt',
					'.prompt',
					'.out_prompt_overlay',
					'.dropdown:nth-child(1)',
					'.dropdown:nth-child(2)',
					'.dropdown:nth-child(3)',
					'.dropdown:nth-child(4)',
					'.dropdown:nth-child(5)',
					'.btn-group[id="insert_above_below"]',
					'.btn-group[id="cut_copy_paste"]',
					'.btn-group[id="move_up_down"]',
					'.btn-group[id="run_int"] .btn:nth-child(0)',
					'.btn-group[id="run_int"] .btn:nth-child(0)',
					'.btn-group[id="run_int"] .btn:nth-child(2)',
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

		function run_script(script, callback) {
			console.log('[Notebook] executing: ' + script);
			var kernel = IPython.notebook.kernel;
            kernel.execute(script, {
                shell: {
                  reply: callback,
                  payload: {}
                },
                iopub : {
                  output : function () {},
                  clear_output : function () {},
                },
                input : function () {}
            });
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
