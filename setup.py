"""Setup script for Notebook Ok Extension"""
from setuptools import setup

try:
    from jupyterpip import cmdclass
except:
    import pip, importlib
    pip.main(['install', 'jupyter-pip'])
    cmdclass = importlib.import_module('jupyterpip').cmdclass

VERSION = '0.1.2'

setup(
    name                = 'notebook-ok-extension',
    version             = VERSION,
    install_requires    = ['jupyter-pip'],
    description         = """An extension of the Jupyter Notebook that integrates testing with OK client.""",
    cmdclass            = cmdclass('ok', 'ok/ok'),
    author              = 'Alvin Wan',
    author_email        = 'hi@alvinwan.com',
    url                 = 'https://github.com/dsten/notebook-ok-extension',
    download_url        = 'https://github.com/dsten/notebook-ok-extension/archive/%s.zip' % VERSION,
    keywords            = ['data', 'tools', 'berkeley'],
    classifiers         = ['Programming Language :: Python']
)
