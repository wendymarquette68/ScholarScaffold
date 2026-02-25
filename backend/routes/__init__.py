from .auth import auth_bp
from .research_strategy import strategy_bp
from .design_literacy import literacy_bp
from .articles import articles_bp
from .bibliography import bibliography_bp
from .proposal import proposal_bp
from .rubric import rubric_bp
from .irb import irb_bp

all_blueprints = [
    (auth_bp, '/api/auth'),
    (strategy_bp, '/api/strategy'),
    (literacy_bp, '/api/literacy'),
    (articles_bp, '/api/articles'),
    (bibliography_bp, '/api/bibliography'),
    (proposal_bp, '/api/proposal'),
    (rubric_bp, '/api/rubric'),
    (irb_bp, '/api/irb'),
]
