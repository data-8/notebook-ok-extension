<<<<<<< HEAD
# simplify
Jupyter notebook extension for simple mode and optional ok integration
=======
> This fork adds only one small script at /jupyter_notebook/static/notebook/js/ds10.js. Toggle button in toolbar to turn on/off DS10 Mode. In this special mode:
- By default, shift-enter runs all, in place.

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