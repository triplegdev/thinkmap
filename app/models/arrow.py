from .db import db, environment, SCHEMA, add_prefix_for_prod
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import UserMixin
from datetime import datetime


class Arrow(db.Model, UserMixin):
    __tablename__ = 'arrows'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    symbol_from_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('symbols.id')))
    symbol_to_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('symbols.id')))
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)

    symbol_from = db.relationship('Symbol', foreign_keys=[symbol_from_id], back_populates='arrows_from', primaryjoin="Symbol.id == Arrow.symbol_from_id")
    symbol_to = db.relationship('Symbol', foreign_keys=[symbol_to_id], back_populates='arrows_to', primaryjoin="Symbol.id == Arrow.symbol_to_id")

    def to_dict(self):
        return {
            'id': self.id,
            'symbol_from_id': self.symbol_from_id,
            'symbol_to_id': self.symbol_to_id
        }
