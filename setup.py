"""Setup script for Notebook Ok Extension"""

import sys
from setuptools import setup
from setuptools.command.test import test as TestCommand

install_requires = [
    
]

VERSION = '0.1.0'

setup(
    name = 'notebook-ok-extension',
    packages = ['notebook-ok-extension'],
    version = VERSION,
    install_requires = install_requires,
    description = """An extension of the Jupyter Notebook that integrates testing with OK client.""",
    author = 'Alvin Wan',
    author_email = 'hi@alvinwan.com',
    url = 'https://github.com/dsten/notebook-ok-extension',
    download_url = 'https://github.com/dsten/notebook-ok-extension/archive/%s.zip' % VERSION,
    keywords = ['data', 'tools', 'berkeley'],
    classifiers = []
)