from flask import Blueprint, jsonify, request, session, redirect
from flask_login import login_required, current_user
from app.forms import FlowchartForm, TitleExistsError
from app.models import Flowchart, db


flowchart_routes = Blueprint('flowcharts', __name__)


@flowchart_routes.route('/<int:id>', methods=['PUT', 'DELETE'])
@login_required
def edit_or_delete_flowchart(id):

    flowchart = Flowchart.query.get(id)

    if not flowchart:
        return {"error": "flowchart not found"}, 404

    if flowchart.user_id != int(current_user.get_id()):
        return {"error": "Unauthorized"}, 401

    if request.method == 'DELETE':
        db.session.delete(flowchart)
        db.session.commit()

        return {"message": "Flowchart deleted successfully"}

    if request.method == 'PUT':
        form = FlowchartForm()
        form['csrf_token'].data = request.cookies['csrf_token']

        title = form['title'].data


        try:
            form.validate_title(title)
        except TitleExistsError as e:
            form['title'].errors = (str(e),)
            return form.errors, 401

        if form.validate_on_submit():

            flowchart.title = title

            db.session.add(flowchart)
            db.session.commit()
            return flowchart.to_dict()

        return form.errors, 401



@flowchart_routes.route('/', methods=['POST'])
@login_required
def create_flowchart():
    form = FlowchartForm()
    form['title'].data = 'Untitled'
    form['csrf_token'].data = request.cookies['csrf_token']

    if form.validate_on_submit():
        title = form.data['title']
        existing_flowcharts = Flowchart.query.filter(Flowchart.title.like('Untitled%')).all()
        existing_titles = set(flowchart.title for flowchart in existing_flowcharts)
        # Find the lowest available number for the suffix starting from 2
        if title in existing_titles:
            for i in range(2, len(existing_flowcharts) + 2):
                if f'{title}_{i}' not in existing_titles:
                    title = f'{title}_{i}'
                    break

        flowchart = Flowchart(
            user_id=current_user.get_id(),
            title=title
        )
        db.session.add(flowchart)
        db.session.commit()
        return flowchart.to_dict()

    return form.errors, 401
