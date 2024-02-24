from .db import db, environment, SCHEMA, add_prefix_for_prod
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import UserMixin
from datetime import datetime


class Symbol(db.Model, UserMixin):
    __tablename__ = 'symbols'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    flowchart_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('flowcharts.id')))
    type = db.Column(db.String(40), nullable=False)
    x_position = db.Column(db.Float, nullable=False)
    y_position = db.Column(db.Float, nullable=False)
    text = db.Column(db.String(255))
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)

    flowchart = db.relationship("Flowchart", back_populates='symbols')
    arrows_from = db.relationship('Arrow', back_populates='symbol_from', cascade="all, delete-orphan", primaryjoin="Symbol.id == Arrow.symbol_from_id")
    arrows_to = db.relationship('Arrow', back_populates='symbol_to', cascade="all, delete-orphan", primaryjoin="Symbol.id == Arrow.symbol_to_id")

    def to_dict(self):
        return {
            'id': self.id,
            'type': self.type,
            'x_position': self.x_position,
            'y_position': self.y_position,
            'text': self.text
            # 'flowchart_id': self.flowchart_id
        }
