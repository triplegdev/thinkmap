from flask.cli import AppGroup
from .users import seed_users, undo_users
from .flowcharts import seed_flowcharts, undo_flowcharts
from .symbols import seed_symbols, undo_symbols
from .arrows import seed_arrows, undo_arrows

from app.models.db import db, environment, SCHEMA

# Creates a seed group to hold our commands
# So we can type `flask seed --help`
seed_commands = AppGroup('seed')


# Creates the `flask seed all` command
@seed_commands.command('all')
def seed():
    if environment == 'production':
        # Before seeding in production, you want to run the seed undo
        # command, which will  truncate all tables prefixed with
        # the schema name (see comment in users.py undo_users function).
        # Make sure to add all your other model's undo functions below
        undo_arrows()
        undo_symbols()
        undo_flowcharts()
        undo_users()
    seed_users()
    seed_flowcharts()
    seed_symbols()
    seed_arrows()
    # Add other seed functions here


# Creates the `flask seed undo` command
@seed_commands.command('undo')
def undo():
    undo_arrows()
    undo_symbols()
    undo_flowcharts()
    undo_users()
    # Add other undo functions here
