from flask_wtf import FlaskForm
from flask_login import current_user
from wtforms import IntegerField
from wtforms.validators import DataRequired,  ValidationError
from app.models import Symbol


def check_symbol(form, field):
    symbol_to_id = field.data
    symbol_from_id =  form['symbol_from_id'].data
    if symbol_from_id == symbol_to_id:
        raise ValidationError('Symbol cannot connect to itself.')

    symbol_from = Symbol.query.get(symbol_from_id)
    symbol_to = Symbol.query.get(symbol_to_id)

    if symbol_from.type == 'Terminal' and symbol_to.type == 'Terminal':
        raise ValidationError('Terminal symbols cannot connect to each other')


class ArrowForm(FlaskForm):
    symbol_to_id = IntegerField('symbol_to_id', validators=[DataRequired(), check_symbol])
    symbol_from_id = IntegerField('symbol_to_id', validators=[DataRequired()])
