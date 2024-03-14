from flask import Blueprint, jsonify, request, session
from flask_login import login_required, current_user
from app.forms import SymbolForm
from app.models import Flowchart, Symbol, db


symbol_routes = Blueprint('symbols', __name__)


@symbol_routes.route('/')
@login_required
def get_symbols(flowchart_id):

    flowchart = Flowchart.query.get(flowchart_id)
    symbols = flowchart.symbols

    return {'symbols': [symbol.to_dict() for symbol in symbols]}


@symbol_routes.route('/', methods=['POST'])
@login_required
def create_symbol(flowchart_id):

    flowchart = Flowchart.query.get(flowchart_id)

    if not flowchart:
        return {"error": "flowchart not found"}, 404

    if flowchart.user_id != int(current_user.get_id()):
        return {"error": "Unauthorized"}, 401

    form = SymbolForm()
    form['csrf_token'].data = request.cookies['csrf_token']

    types = ['Terminal', 'Data', 'Process', 'Decision']
    type = form['type'].data
    if type not in types:
        return { "Error": "Symbol type does not exist"}, 400

    if form.validate_on_submit():
        symbol = Symbol(
            text = form['text'].data,
            type = type,
            x_position = form['x_position'].data,
            y_position = form['y_position'].data,
            flowchart_id = flowchart_id
        )

        db.session.add(symbol)
        db.session.commit()

        return symbol.to_dict()

    return form.errors, 401


@symbol_routes.route('/<int:id>', methods=['PUT', 'DELETE'])
@login_required
def edit_or_delete_symbol(flowchart_id, id):

    flowchart = Flowchart.query.get(flowchart_id)

    if flowchart.user_id != int(current_user.get_id()):
        return {"error": "Unauthorized"}, 401

    symbol = Symbol.query.get(id)

    if symbol not in flowchart.symbols:
        # symbol does not exist or is not part of current flowchart
        return {"error": "flowchart symbol does not exist"}, 404


    if request.method == 'DELETE':
        db.session.delete(symbol)
        db.session.commit()

        return {"message": "Symbol deleted successfully"}


    if request.method == 'PUT':
        type = symbol.type

        form = SymbolForm()

        if type != form['type'].data:
            #preventing type to be edited since it should not change
            return {"error": "Symbol type mismatch"}, 400

        form['csrf_token'].data = request.cookies['csrf_token']

        if form.validate_on_submit():
            symbol.text = form['text'].data,
            symbol.type = form['type'].data,
            symbol.x_position = form['x_position'].data,
            symbol.y_position = form['y_position'].data

            db.session.add(symbol)
            db.session.commit()

            return symbol.to_dict()

        return form.errors, 401
