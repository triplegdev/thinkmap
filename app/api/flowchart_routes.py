from flask import Blueprint, jsonify, request, current_app
from flask_login import login_required, current_user
from app.forms import FlowchartForm
from app.models import Flowchart, db

flowchart_routes = Blueprint('flowcharts', __name__)


@flowchart_routes.route('/')
@login_required
def post_flowchart():
    pass
    # form = FlowchartForm()
    # form['csrf_token'].data = request.cookies['csrf_token']
