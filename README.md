# OK Extension

Jupyter notebook extension that enables a form-filling mode for limiting the
interface and executing tests through the
[OK Client](https://github.com/Cal-CS-61A-Staff/ok-client).

With this extension, most Notebook contents is not editable by default.
Click the *Edit* button to toggle editing, which reverts to the standard Notebook interface.

When *Edit* is toggled off (default):
- Shift-enter executes every code cell from the previously executed cell and
  clears all output from any subsequent cell. If the previously executed cell
  is below the current cell, then execution begins at the top of the notebook.
- Cell editing is modeless; cells can be edited, but there is no command mode.
- A *scratch* cell is available in a separate sandboxed environment.
- The *Run Tests* button executes the `ok` client on the notebook contents.

## Installation

Install via pip.

```
pip install notebook-ok-extension
```

Install.

```
python setup.py install
```