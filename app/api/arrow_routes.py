from flask import Blueprint, jsonify, request, session
from flask_login import login_required, current_user
from app.forms import ArrowForm
from app.models import Flowchart, Symbol, Arrow, db


arrow_routes = Blueprint('arrows', __name__)


@arrow_routes.route('/')
@login_required
def get_arrows(flowchart_id, symbol_id):

    flowchart = Flowchart.query.get(flowchart_id)
    symbol = Symbol.query.get(symbol_id)

    if symbol not in flowchart.symbols:
        # symbol does not exist or is not part of current flowchart
        return {"error": "flowchart symbol does not exist"}, 404


    return {'arrows': [arrow.to_dict() for arrow in symbol.arrows_from]}


@arrow_routes.route('/', methods=['POST'])
@login_required
def create_arrow(flowchart_id, symbol_id):

    flowchart = Flowchart.query.get(flowchart_id)
    symbol = Symbol.query.get(symbol_id)

    if symbol not in flowchart.symbols:
        # symbol does not exist or is not part of current flowchart
        return {"error": "flowchart symbol does not exist"}, 404

    form = ArrowForm()
    form['symbol_from_id'].data = symbol_id
    form['csrf_token'].data = request.cookies['csrf_token']

    if form.validate_on_submit():
        arrow = Arrow(
            symbol_from_id = form['symbol_from_id'].data,
            symbol_to_id = form['symbol_to_id'].data
        )

        db.session.add(arrow)
        db.session.commit()

        return arrow.to_dict()

    return form.errors, 401


@arrow_routes.route('/<int:id>', methods=['PUT', 'DELETE'])
@login_required
def delete_arrow(flowchart_id, symbol_id, id):

    flowchart = Flowchart.query.get(flowchart_id)

    if flowchart.user_id != int(current_user.get_id()):
        return {"error": "Unauthorized"}, 401

    symbol = Symbol.query.get(symbol_id)

    if symbol not in flowchart.symbols:
        # symbol does not exist or is not part of current flowchart
        return {"error": "flowchart symbol does not exist"}, 404

    arrow = Arrow.query.get(id)

    if arrow not in symbol.arrows_from:
        # arrow does not exist or is not part of current symbol
        return {"error": "symbol arrow does not exist"}, 404

    if request.method == 'DELETE':
        db.session.delete(arrow)
        db.session.commit()

        return {"message": "Symbol deleted successfully"}


    if request.method == 'PUT':
        form = ArrowForm()
        form['symbol_from_id'].data = symbol_id
        form['csrf_token'].data = request.cookies['csrf_token']

        if form.validate_on_submit():
            arrow.symbol_to_id = form['symbol_to_id'].data

            db.session.add(arrow)
            db.session.commit()

            return arrow.to_dict()

        return form.errors, 401
