from flask_wtf import FlaskForm
from flask_login import current_user
from wtforms import StringField
from wtforms.validators import DataRequired, Email, ValidationError
from app.models import User, Flowchart


class FlowchartForm(FlaskForm):
    title = StringField('title', validators=[DataRequired()])

    #Custom handling for the edit flowchart route since I don't want the validation error triggering for create flowchart
    def validate_title(self, title):
        if not is_valid_title(title):
            raise TitleExistsError("Title already exists.")

def is_valid_title(title):
    user = User.query.get(current_user.get_id())
    flowcharts = user.flowcharts
    existing_titles = set(flowchart.title for flowchart in flowcharts)

    if title in existing_titles:
        return False
    else:
        return True

class TitleExistsError(ValidationError):
    pass
