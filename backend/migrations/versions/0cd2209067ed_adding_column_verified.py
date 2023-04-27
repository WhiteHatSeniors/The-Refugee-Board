"""Adding column verified

Revision ID: 0cd2209067ed
Revises: a76885f27a22
Create Date: 2023-04-27 21:15:24.004374

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '0cd2209067ed'
down_revision = 'a76885f27a22'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('camp', schema=None) as batch_op:
        batch_op.add_column(sa.Column('verified', sa.Boolean(), nullable=True))

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('camp', schema=None) as batch_op:
        batch_op.drop_column('verified')

    # ### end Alembic commands ###