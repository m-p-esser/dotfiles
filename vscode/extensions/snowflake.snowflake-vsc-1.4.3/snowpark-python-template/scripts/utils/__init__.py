__all__ = [
    "get_session"
    "get_module_name_from_file"
]

from utils.session import get_session
from pathlib import Path
from re import sub

end_replace = lambda p, sub_str, s: sub('{0}$'.format(p), sub_str, s)
start_replace = lambda p, sub_str, s: sub('^{0}'.format(p), sub_str, s)

def get_module_name_from_file(file):
    name = start_replace(Path.cwd().joinpath("src"), '', file)
    name = start_replace('/', '', name)
    name = end_replace('.py', '', name)
    name = name.replace('/', '.')
    return name