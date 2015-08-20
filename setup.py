"""Setup script for Notebook Ok Extension"""

from setuptools import setup

try:
    from jupyterpip import cmdclass
except:
    import pip, importlib
    pip.main(['install', 'jupyter-pip'])
    cmdclass = importlib.import_module('jupyterpip').cmdclass

install_requires = [
    'jupyter-pip'
]

EXT_NAME = 'notebook-ok-extension'
VERSION = '0.1.0'

setup(
    name                = EXT_NAME,
    packages            = [EXT_NAME],
    version             = VERSION,
    install_requires    = install_requires,
    description         = """An extension of the Jupyter Notebook that integrates testing with OK client.""",
    cmdclass            = cmdclass(EXT_NAME, '{}/ok'.format(EXT_NAME)),
    author              = 'Alvin Wan',
    author_email        = 'hi@alvinwan.com',
    url                 = 'https://github.com/dsten/notebook-ok-extension',
    download_url        = 'https://github.com/dsten/notebook-ok-extension/archive/%s.zip' % VERSION,
    keywords            = ['data', 'tools', 'berkeley'],
    classifiers         = []
)