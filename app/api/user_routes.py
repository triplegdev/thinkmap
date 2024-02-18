from flask import Blueprint, jsonify, request, current_app
from flask_login import login_required, current_user
from app.forms import AccountForm
from app.models import User, Flowchart, db
from sqlalchemy import desc

user_routes = Blueprint('users', __name__)


@user_routes.route('/')
@login_required
def users():
    """
    Query for all users and returns them in a list of user dictionaries
    """
    users = User.query.all()
    return {'users': [user.to_dict() for user in users]}


@user_routes.route('/<int:id>/flowcharts')
@login_required
def user_flowcharts(id):

    user = User.query.get(id)

    if not user:
        return 'User Not Found', 404

    """
        Query for users flowcharts and order by recently updated
    """
    flowcharts = db.session.query(Flowchart) \
                           .filter_by(user_id=user.id) \
                           .order_by(desc(Flowchart.updated_at)) \
                           .all()

    return {'flowcharts': [flowchart.to_dict() for flowchart in flowcharts]}


@user_routes.route('/<int:id>', methods=['GET', 'PUT'])
@login_required
def user(id):
    if request.method == 'GET':
        """
        Query for a user by id and returns that user in a dictionary
        """
        user = User.query.get(id)
        return user.to_dict()
    elif request.method == 'PUT':

        photos = current_app.config['UPLOADS_DEFAULT_SET']

        user = User.query.get(id)
        if current_user.get_id() != user.get_id():
            return {"error": "Unauthorized"}, 401

        form = AccountForm()
        form['csrf_token'].data = request.cookies['csrf_token']

        if form.validate_on_submit():
            user.username = form.username.data
            user.email = form.email.data
            filename = photos.save(request.files['avatar'])
            user.avatar = photos.path(filename)
            db.session.commit()
            return user.to_dict()

        return form.errors, 401
