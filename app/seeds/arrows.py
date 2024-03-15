from app.models import db, Flowchart, Symbol, Arrow, environment, SCHEMA
from sqlalchemy.sql import text


# Adds a demo user, you can add other users here if you want
def seed_arrows():

# Retrieve symbols from the seed symbol data

    flowchart_id_1 = Flowchart.query.filter_by(title="Sample Flowchart 1").first()
    flowchart_id_2 = Flowchart.query.filter_by(title="Sample Flowchart 2").first()
    flowchart_id_3 = Flowchart.query.filter_by(title="Sample Flowchart 3").first()

    flowchart1_t1 = Symbol.query.filter_by(text="Start").first()
    flowchart1_t2 = Symbol.query.filter_by(text="End").first()
    flowchart1_io1 = Symbol.query.filter_by(text="Read A").first()
    flowchart1_io2 = Symbol.query.filter_by(text="Read B").first()
    flowchart1_p1 = Symbol.query.filter_by(text="Calculate Sum as A + B").first()
    flowchart1_p2 = Symbol.query.filter_by(text="Print Sum").first()

    flowchart2_t1 = Symbol.query.filter_by(text="Leave Home").first()
    flowchart2_t2 = Symbol.query.filter_by(text="Reach Work").first()
    flowchart2_p1 = Symbol.query.filter_by(text="Take bus").first()
    flowchart2_p2 = Symbol.query.filter_by(text="Take subway").first()
    flowchart2_io1 = Symbol.query.filter_by(text="Check time").first()
    flowchart2_d1 = Symbol.query.filter_by(text="Before 7 am?").first()

    flowchart3_t1 = Symbol.query.filter_by(text="Start").first()
    flowchart3_t2 = Symbol.query.filter_by(text="Enjoy your day!").first()
    flowchart3_io1 = Symbol.query.filter_by(text="Check weather").first()
    flowchart3_d1 = Symbol.query.filter_by(text="Is it hot outside?").first()
    flowchart3_d2 = Symbol.query.filter_by(text="Is it raining?").first()
    flowchart3_p1 = Symbol.query.filter_by(text="Put on shorts").first()
    flowchart3_p2 = Symbol.query.filter_by(text="Put on pants").first()
    flowchart3_p3 = Symbol.query.filter_by(text="Grab umbrella").first()


    # Create arrows based on the relationships between symbols
    arrows = [
        Arrow(flowchart_id=flowchart_id_1.id, symbol_from_id=flowchart1_t1.id, symbol_to_id=flowchart1_io1.id, from_connector='mb', to_connector='mt'),
        Arrow(flowchart_id=flowchart_id_1.id, symbol_from_id=flowchart1_io1.id, symbol_to_id=flowchart1_io2.id, from_connector='mb', to_connector='mt'),
        Arrow(flowchart_id=flowchart_id_1.id, symbol_from_id=flowchart1_io2.id, symbol_to_id=flowchart1_p1.id, from_connector='mb', to_connector='mt'),
        Arrow(flowchart_id=flowchart_id_1.id, symbol_from_id=flowchart1_p1.id, symbol_to_id=flowchart1_p2.id, from_connector='mb', to_connector='mt'),
        Arrow(flowchart_id=flowchart_id_1.id, symbol_from_id=flowchart1_p2.id, symbol_to_id=flowchart1_t2.id, from_connector='mb', to_connector='mt'),

        Arrow(flowchart_id=flowchart_id_2.id, symbol_from_id=flowchart2_t1.id, symbol_to_id=flowchart2_io1.id, from_connector='mb', to_connector='mt'),
        Arrow(flowchart_id=flowchart_id_2.id, symbol_from_id=flowchart2_io1.id, symbol_to_id=flowchart2_d1.id, from_connector='mb', to_connector='mt'),
        Arrow(flowchart_id=flowchart_id_2.id, symbol_from_id=flowchart2_d1.id, symbol_to_id=flowchart2_p1.id, from_connector='ml', to_connector='mt'),
        Arrow(flowchart_id=flowchart_id_2.id, symbol_from_id=flowchart2_d1.id, symbol_to_id=flowchart2_p2.id, from_connector='mr', to_connector='mt'),
        Arrow(flowchart_id=flowchart_id_2.id, symbol_from_id=flowchart2_p1.id, symbol_to_id=flowchart2_t2.id, from_connector='mb', to_connector='mt'),
        Arrow(flowchart_id=flowchart_id_2.id, symbol_from_id=flowchart2_p2.id, symbol_to_id=flowchart2_t2.id, from_connector='mb', to_connector='mt'),

        Arrow(flowchart_id=flowchart_id_3.id, symbol_from_id=flowchart3_t1.id, symbol_to_id=flowchart3_io1.id),
        Arrow(flowchart_id=flowchart_id_3.id, symbol_from_id=flowchart3_io1.id, symbol_to_id=flowchart3_d1.id),
        Arrow(flowchart_id=flowchart_id_3.id, symbol_from_id=flowchart3_d1.id, symbol_to_id=flowchart3_p1.id),
        Arrow(flowchart_id=flowchart_id_3.id, symbol_from_id=flowchart3_d1.id, symbol_to_id=flowchart3_p2.id),
        Arrow(flowchart_id=flowchart_id_3.id, symbol_from_id=flowchart3_p1.id, symbol_to_id=flowchart3_d2.id),
        Arrow(flowchart_id=flowchart_id_3.id, symbol_from_id=flowchart3_p2.id, symbol_to_id=flowchart3_d2.id),
        Arrow(flowchart_id=flowchart_id_3.id, symbol_from_id=flowchart3_d2.id, symbol_to_id=flowchart3_p3.id),
        Arrow(flowchart_id=flowchart_id_3.id, symbol_from_id=flowchart3_d2.id, symbol_to_id=flowchart3_t2.id),
        Arrow(flowchart_id=flowchart_id_3.id, symbol_from_id=flowchart3_p3.id, symbol_to_id=flowchart3_t2.id)
    ]

    # Add arrows to the session
    db.session.bulk_save_objects(arrows)
    db.session.commit()

# Uses a raw SQL query to TRUNCATE or DELETE the users table. SQLAlchemy doesn't
# have a built in function to do this. With postgres in production TRUNCATE
# removes all the data from the table, and RESET IDENTITY resets the auto
# incrementing primary key, CASCADE deletes any dependent entities.  With
# sqlite3 in development you need to instead use DELETE to remove all data and
# it will reset the primary keys for you as well.
def undo_arrows():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.arrows RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM arrows"))

    db.session.commit()
