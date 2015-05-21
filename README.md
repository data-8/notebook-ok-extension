<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
# simplify
Jupyter notebook extension for simple mode and optional ok integration
=======
> This fork adds only one small script at /jupyter_notebook/static/notebook/js/ds10.js. Toggle button in toolbar to turn on/off DS10 Mode. In this special mode:
=======
> This fork contains one script, at /jupyter_notebook/static/notebook/js/ds10.js. With this script, DS10 Mode is the default; click on the checkmark in the toolbar to toggle this mode on/off. The following describes special features, in DS10 Mode.
>>>>>>> 65b8596... outlined all features of DS10 mode, code structure
=======
> This fork contains one script, at /jupyter_notebook/static/notebook/js/ds10.js. With this script, DS10 Mode is the default; click on the toolbar's checkmark to toggle this mode on/off. The following describes special features, in DS10 Mode.
>>>>>>> 5040e15... code shortened, clarified - fixed shift-enter scroll bug (different scheme)
- By default, shift-enter runs all, in place.
- Cells are selected upon hover.
=======
> This fork contains one script, at /jupyter_notebook/static/notebook/js/ds10.js. With this script, DS10 Mode is the default; click on the "DS10 Mode" button to toggle this mode on/off. The following describes special features, in DS10 Mode.
=======
> This fork contains one script, at /jupyter_notebook/static/notebook/js/ds10.js. With this script, Simple Mode is the default; click on the " Mode" button to toggle this mode on/off. The following describes special features, in Simple Mode.
>>>>>>> 0ebc47c... attempted forcibly removing 'command_mode' class and keyboard_manager.disable()
- By default, shift-enter runs all cells.
<<<<<<< HEAD
- Cells are editable upon hover.
>>>>>>> bca2cd4... ds10 button labeled, on/off state explicitly stated
=======
- Text cells are editable upon hover.
>>>>>>> 48d8bca... removed console.logs, small clarification
=======
> This fork contains one script, at /jupyter_notebook/static/notebook/js/ds10.js. With this script, Simple Mode is the default; click on the "Simple Mode" button to toggle this mode on/off. The following describes special features, in Simple Mode.
=======
> This fork contains one script, at /notebook/static/notebook/js/dsten.js. With this script, Simple Mode is the default; click on the "Simple Mode" button to toggle this mode on/off. The following describes special features, in Simple Mode.
>>>>>>> 5f99cae... moved dsten.js after merge with original repo
- By default, shift-enter runs all cells.
>>>>>>> b2b1749... removed all extraneous buttons, all edit+command 'shortcuts' in Simple Mode
- Only one mode -- edit mode -- exists, for simplicity.
- "Scratch cell" available as a sandbox environment to-go.

# Jupyter Notebook

The Jupyter HTML notebook is a web-based notebook environment for interactive computing.

Dev quickstart:

* Create a virtual env (ie jupyter-dev)
* ensure that you have node/npm installed (ie brew install node on OS X)
* Clone this repo and cd into it
* pip install -r requirements.txt -e .

_NOTE_: For Debian/Ubuntu systems, if you're installing the system node you need
to use the 'nodejs-legacy' package and not the 'node' package.

Launch with:

    jupyter notebook

For Ubuntu Trusty:
```
sudo apt-get install nodejs-legacy npm python-virtualenv python-dev
python2 -m virtualenv ~/.virtualenvs/jupyter_notebook
source ~/.virtualenvs/jupyter_notebook/bin/activate
pip install --upgrade setuptools pip
git clone https://github.com/jupyter/jupyter_notebook.git
cd jupyter_notebook
pip install -r requirements.txt -e .
jupyter notebook
```

>>>>>>> 590852a... description for DS10 Mode
