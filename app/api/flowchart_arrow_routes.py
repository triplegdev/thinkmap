from flask import Blueprint, jsonify, request, session
from flask_login import login_required, current_user
from app.forms import ArrowForm
from app.models import Flowchart, Arrow, db


flowchart_arrow_routes = Blueprint('flowchart_arrows', __name__)


@flowchart_arrow_routes.route('/')
@login_required
def get_flowchart_arrows(flowchart_id):

    flowchart = Flowchart.query.get(flowchart_id)
    arrows = flowchart.arrows

    return {'arrows': [arrow.to_dict() for arrow in arrows]}

@flowchart_arrow_routes.route('/', methods=['POST'])
@login_required
def create_arrow(flowchart_id):

    flowchart = Flowchart.query.get(flowchart_id)
    # symbol = Symbol.query.get(symbol_id)

    # if symbol not in flowchart.symbols:
    #     # symbol does not exist or is not part of current flowchart
    #     return {"error": "flowchart symbol does not exist"}, 404
    if not flowchart:
        return {"error": "flowchart not found"}, 404

    if flowchart.user_id != int(current_user.get_id()):
        return {"error": "Unauthorized"}, 401

    form = ArrowForm()
    # form['symbol_from_id'].data = symbol_id
    form['csrf_token'].data = request.cookies['csrf_token']

    if form.validate_on_submit():
        arrow = Arrow(
            symbol_from_id = form['symbol_from_id'].data,
            symbol_to_id = form['symbol_to_id'].data,
            from_connector = form['from_connector'].data,
            to_connector = form['to_connector'].data,
            flowchart_id = flowchart_id
        )

        db.session.add(arrow)
        db.session.commit()

        return arrow.to_dict()

    return form.errors, 401

@flowchart_arrow_routes.route('/<int:id>', methods=['DELETE'])
@login_required
def delete_arrow(flowchart_id, id):

    flowchart = Flowchart.query.get(flowchart_id)

    if flowchart.user_id != int(current_user.get_id()):
        return {"error": "Unauthorized"}, 401

    # symbol = Symbol.query.get(symbol_id)

    # if symbol not in flowchart.symbols:
    #     # symbol does not exist or is not part of current flowchart
    #     return {"error": "flowchart symbol does not exist"}, 404

    arrow = Arrow.query.get(id)

    if arrow not in flowchart.arrows:
        # arrow does not exist or is not part of current symbol
        return {"error": "flowchart arrow does not exist"}, 404

    if request.method == 'DELETE':
        db.session.delete(arrow)
        db.session.commit()

        return {"message": "Arrow deleted successfully"}


    # if request.method == 'PUT':
    #     form = ArrowForm()
    #     form['symbol_from_id'].data = symbol_id
    #     form['csrf_token'].data = request.cookies['csrf_token']

    #     if form.validate_on_submit():
    #         arrow.symbol_to_id = form['symbol_to_id'].data

    #         db.session.add(arrow)
    #         db.session.commit()

    #         return arrow.to_dict()

    #     return form.errors, 401
