#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""Setup script for Jupyter Notebook"""

#-----------------------------------------------------------------------------
#  Copyright (c) 2015-, Jupyter Development Team.
#  Copyright (c) 2008-2015, IPython Development Team.
#
#  Distributed under the terms of the Modified BSD License.
#
#  The full license is in the file COPYING.md, distributed with this software.
#-----------------------------------------------------------------------------

from __future__ import print_function

name = "notebook"

#-----------------------------------------------------------------------------
# Minimal Python version sanity check
#-----------------------------------------------------------------------------

import sys

v = sys.version_info
if v[:2] < (2,7) or (v[0] >= 3 and v[:2] < (3,3)):
    error = "ERROR: %s requires Python version 2.7 or 3.3 or above." % name
    print(error, file=sys.stderr)
    sys.exit(1)

PY3 = (sys.version_info[0] >= 3)

# At least we're on the python version we need, move on.


#-------------------------------------------------------------------------------
# Imports
#-------------------------------------------------------------------------------

import os

from glob import glob

# BEFORE importing distutils, remove MANIFEST. distutils doesn't properly
# update it when the contents of directories change.
if os.path.exists('MANIFEST'): os.remove('MANIFEST')

from distutils.core import setup

# Our own imports

from setupbase import (
    version,
    find_packages,
    find_package_data,
    check_package_data_first,
    CompileCSS,
    CompileJS,
    Bower,
    JavascriptVersion,
    css_js_prerelease,
)

isfile = os.path.isfile
pjoin = os.path.join

setup_args = dict(
    name = 'jupyter-notebook-student',
    description = """An extension of the Jupyter Notebook for UC Berkeley's Data Science 10 course.""",
    version         = '0.1.1',
    scripts         = glob(pjoin('scripts', '*')),
    packages        = find_packages(),
    package_data    = find_package_data(),
    author          = 'Alvin Wan',
    author_email    = 'alvinwan@berkeley.edu',
    url             = 'https://github.com/alvinwan/jupyter_notebook',
    license         = 'BSD',
    platforms       = "Linux, Mac OS X, Windows",
    keywords        = ['Interactive', 'Interpreter', 'Shell', 'Web'],
    classifiers     = [
        'Intended Audience :: Developers',
        'Intended Audience :: System Administrators',
        'Intended Audience :: Science/Research',
        'License :: OSI Approved :: BSD License',
        'Programming Language :: Python',
        'Programming Language :: Python :: 2.7',
        'Programming Language :: Python :: 3',
        'Programming Language :: Python :: 3.3',
    ],
)



#---------------------------------------------------------------------------
# Find all the packages, package data, and data_files
#---------------------------------------------------------------------------

packages = find_packages()
package_data = find_package_data()

#---------------------------------------------------------------------------
# custom distutils commands
#---------------------------------------------------------------------------
# imports here, so they are after setuptools import if there was one
from distutils.command.build_py import build_py
from distutils.command.sdist import sdist


setup_args['cmdclass'] = {
    'build_py': css_js_prerelease(
            check_package_data_first(build_py)),
    'sdist' : css_js_prerelease(sdist, strict=True),
    'css' : CompileCSS,
    'js' : CompileJS,
    'jsdeps' : Bower,
    'jsversion' : JavascriptVersion,
}



#---------------------------------------------------------------------------
# Handle scripts, dependencies, and setuptools specific things
#---------------------------------------------------------------------------

# For some commands, use setuptools.  Note that we do NOT list install here!
# If you want a setuptools-enhanced install, just run 'setupegg.py install'
needs_setuptools = set(('develop', 'release', 'bdist_egg', 'bdist_rpm',
           'bdist', 'bdist_dumb', 'bdist_wininst', 'bdist_wheel',
           'egg_info', 'easy_install', 'upload', 'install_egg_info',
            ))

if len(needs_setuptools.intersection(sys.argv)) > 0:
    import setuptools

# This dict is used for passing extra arguments that are setuptools
# specific to setup
setuptools_extra_args = {}

# setuptools requirements

pyzmq = 'pyzmq>=13'

setup_args['scripts'] = glob(pjoin('scripts', '*'))

install_requires = [
    'jinja2',
    'tornado>=4',
    'ipython_genutils',
    'traitlets',
    'jupyter_core',
    'jupyter_client',
    'nbformat',
    'nbconvert',
    'ipykernel', # bless IPython kernel for now
]
extras_require = {
    ':sys_platform != "win32"': ['terminado>=0.3.3'],
    'doc': ['Sphinx>=1.1'],
    'test:python_version == "2.7"': ['mock'],
    'test': ['nose', 'requests'],
}

if 'setuptools' in sys.modules:
    # setup.py develop should check for submodules
    from setuptools.command.develop import develop
    setup_args['cmdclass']['develop'] = css_js_prerelease(develop)
    if not PY3:
        setup_args['setup_requires'] = ['ipython_genutils']

    try:
        from wheel.bdist_wheel import bdist_wheel
    except ImportError:
        pass
    else:
        setup_args['cmdclass']['bdist_wheel'] = css_js_prerelease(bdist_wheel)

    setuptools_extra_args['zip_safe'] = False
    setup_args['extras_require'] = extras_require
    requires = setup_args['install_requires'] = install_requires

#---------------------------------------------------------------------------
# Do the actual setup now
#---------------------------------------------------------------------------

setup_args.update(setuptools_extra_args)

def main():
    setup(**setup_args)

if __name__ == '__main__':
    main()