from app.models import db, User, Flowchart, environment, SCHEMA
from sqlalchemy.sql import text


# Adds a demo user, you can add other users here if you want
def seed_flowcharts():
    user_id_1 = User.query.filter_by(username="Demo").first()
    user_id_2 = User.query.filter_by(username="marnie").first()
    user_id_3 = User.query.filter_by(username="bobbie").first()

    flowchart1 = Flowchart(
        user_id=user_id_1.id,
        title="Sample Flowchart 1"
    )

    flowchart2 = Flowchart(
        user_id=user_id_2.id,
        title="Sample Flowchart 2"
    )

    flowchart3 = Flowchart(
        user_id=user_id_3.id,
        title="Sample Flowchart 3"
    )
    db.session.add(flowchart1)
    db.session.add(flowchart2)
    db.session.add(flowchart3)
    db.session.commit()


# Uses a raw SQL query to TRUNCATE or DELETE the users table. SQLAlchemy doesn't
# have a built in function to do this. With postgres in production TRUNCATE
# removes all the data from the table, and RESET IDENTITY resets the auto
# incrementing primary key, CASCADE deletes any dependent entities.  With
# sqlite3 in development you need to instead use DELETE to remove all data and
# it will reset the primary keys for you as well.
def undo_flowcharts():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.flowcharts RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM flowcharts"))

    db.session.commit()
