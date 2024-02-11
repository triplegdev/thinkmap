from flask_wtf import FlaskForm
from flask_login import current_user
from wtforms import StringField, IntegerField
from wtforms.validators import DataRequired
# from app.models import User, Flowchart


class SymbolForm(FlaskForm):
    text = StringField('title')
    type = StringField('type', validators=[DataRequired()])
    x_position = IntegerField('x_position', validators=[DataRequired()])
    y_position = IntegerField('y_position', validators=[DataRequired()])
