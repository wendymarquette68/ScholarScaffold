from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

from .user import User
from .search_strategy import SearchStrategy
from .quiz_result import QuizResult
from .article import Article
from .article_review import ArticleReview
from .annotation import Annotation
from .proposal_draft import ProposalDraft
from .rubric_result import RubricResult
from .irb_log import IrbLog
