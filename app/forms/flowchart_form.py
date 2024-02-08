from flask_wtf import FlaskForm
from flask_login import current_user
from wtforms import StringField
from wtforms.validators import DataRequired, Email, ValidationError
from app.models import Flowchart


class FlowchartForm(FlaskForm):
    title = StringField('title', validators=[DataRequired()])
