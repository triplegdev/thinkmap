from app.models import db, Flowchart, Symbol, environment, SCHEMA
from sqlalchemy.sql import text


# Adds a demo user, you can add other users here if you want
def seed_symbols():

    flowchart_id_1 = Flowchart.query.filter_by(title="Sample Flowchart 1").first()
    flowchart_id_2 = Flowchart.query.filter_by(title="Sample Flowchart 2").first()
    flowchart_id_3 = Flowchart.query.filter_by(title="Sample Flowchart 3").first()

    flowchart1_t1 = Symbol(
        flowchart_id=flowchart_id_1.id,
        type="Terminal",
        x_position=100,
        y_position=100,
        text="Start"
    )
    flowchart1_t2 = Symbol(
        flowchart_id=flowchart_id_1.id,
        type="Terminal",
        x_position=200,
        y_position=200,
        text="End"
    )

    flowchart1_io1 = Symbol(
        flowchart_id=flowchart_id_1.id,
        type="Data",
        x_position=300,
        y_position=300,
        text="Read A"
    )
    flowchart1_io2 = Symbol(
        flowchart_id=flowchart_id_1.id,
        type="Data",
        x_position=400,
        y_position=400,
        text="Read B"
    )

    flowchart1_p1 = Symbol(
        flowchart_id=flowchart_id_1.id,
        type="Process",
        x_position=500,
        y_position=500,
        text="Calculate Sum as A + B"
    )

    flowchart1_p2 = Symbol(
        flowchart_id=flowchart_id_1.id,
        type="Process",
        x_position=600,
        y_position=600,
        text="Print Sum"
    )

    flowchart2_t1 = Symbol(
        flowchart_id=flowchart_id_2.id,
        type="Terminal",
        x_position=100,
        y_position=100,
        text="Leave Home"
    )

    flowchart2_t2 = Symbol(
        flowchart_id=flowchart_id_2.id,
        type="Terminal",
        x_position=200,
        y_position=200,
        text="Reach Work"
    )

    flowchart2_p1 = Symbol(
        flowchart_id=flowchart_id_2.id,
        type="Process",
        x_position=300,
        y_position=300,
        text="Take bus"
    )
    flowchart2_p2 = Symbol(
        flowchart_id=flowchart_id_2.id,
        type="Process",
        x_position=400,
        y_position=400,
        text="Take subway"
    )

    flowchart2_io1 = Symbol(
        flowchart_id=flowchart_id_2.id,
        type="Data",
        x_position=500,
        y_position=500,
        text="Check time"
    )

    flowchart2_d1 = Symbol(
        flowchart_id=flowchart_id_2.id,
        type="Decision",
        x_position=600,
        y_position=600,
        text="Before 7 am?"
    )

    flowchart3_t1 = Symbol(
        flowchart_id=flowchart_id_3.id,
        type="Terminal",
        x_position=100,
        y_position=100,
        text="Start"
    )

    flowchart3_t2 = Symbol(
        flowchart_id=flowchart_id_3.id,
        type="Terminal",
        x_position=200,
        y_position=200,
        text="Enjoy your day!"
    )

    flowchart3_io1 = Symbol(
        flowchart_id=flowchart_id_3.id,
        type="Data",
        x_position=300,
        y_position=300,
        text="Check weather"
    )

    flowchart3_d1 = Symbol(
        flowchart_id=flowchart_id_3.id,
        type="Decision",
        x_position=400,
        y_position=400,
        text="Is it hot outside?"
    )

    flowchart3_d2 = Symbol(
        flowchart_id=flowchart_id_3.id,
        type="Decision",
        x_position=500,
        y_position=500,
        text="Is it raining?"
    )

    flowchart3_p1 = Symbol(
        flowchart_id=flowchart_id_3.id,
        type="Process",
        x_position=600,
        y_position=600,
        text="Put on shorts"
    )

    flowchart3_p2 = Symbol(
        flowchart_id=flowchart_id_3.id,
        type="Process",
        x_position=700,
        y_position=700,
        text="Put on pants"
    )

    flowchart3_p3 = Symbol(
        flowchart_id=flowchart_id_3.id,
        type="Process",
        x_position=800,
        y_position=800,
        text="Grab umbrella"
    )

    db.session.bulk_save_objects(
        [
            flowchart1_t1,
            flowchart1_t2,
            flowchart1_io1,
            flowchart1_io2,
            flowchart1_p1,
            flowchart1_p2,
            flowchart2_t1,
            flowchart2_t2,
            flowchart2_p1,
            flowchart2_p2,
            flowchart2_io1,
            flowchart2_d1,
            flowchart3_t1,
            flowchart3_t2,
            flowchart3_io1,
            flowchart3_d1,
            flowchart3_d2,
            flowchart3_p1,
            flowchart3_p2,
            flowchart3_p3
        ]
    )
    db.session.commit()


# Uses a raw SQL query to TRUNCATE or DELETE the users table. SQLAlchemy doesn't
# have a built in function to do this. With postgres in production TRUNCATE
# removes all the data from the table, and RESET IDENTITY resets the auto
# incrementing primary key, CASCADE deletes any dependent entities.  With
# sqlite3 in development you need to instead use DELETE to remove all data and
# it will reset the primary keys for you as well.
def undo_symbols():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.symbols RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM symbols"))

    db.session.commit()
