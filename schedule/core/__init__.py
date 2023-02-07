import pathlib
DATA_DST = pathlib.Path(pathlib.Path.cwd(), 'schedule','core', 'database.db')
print(DATA_DST)
from . import database