"""
Rule-based rubric scoring engine for research proposals.

Scores proposals across 7 dimensions on a 1-4 scale:
1 = Needs Significant Improvement
2 = Developing
3 = Competent
4 = Exemplary

Dimensions:
- Thesis Clarity
- Scope Precision
- Evidence Integration
- Synthesis Depth
- Methodological Awareness
- Structural Completeness
- Citation Presence
"""

import re
from dataclasses import dataclass


@dataclass
class DimensionResult:
    score: int
    feedback: str


def score_thesis_clarity(title: str, purpose: str, background: str) -> DimensionResult:
    """Evaluate whether the proposal has a clear, focused thesis/research question."""
    score = 1
    issues = []

    # Check if purpose section exists and has content
    if not purpose or len(purpose.strip()) < 20:
        issues.append("Purpose/research question section is missing or too brief.")
        return DimensionResult(score=1, feedback=' '.join(issues))

    # Check for question marks (indicates a research question is stated)
    has_question = '?' in purpose
    # Check for purpose-related keywords
    purpose_keywords = ['purpose', 'aim', 'objective', 'goal', 'investigate', 'examine', 'explore', 'determine']
    has_purpose_keyword = any(kw in purpose.lower() for kw in purpose_keywords)

    if has_question or has_purpose_keyword:
        score += 1

    # Check specificity: longer, more detailed purpose text
    if len(purpose.strip()) > 100:
        score += 1

    # Check alignment with title
    if title:
        title_words = set(re.findall(r'\b\w{4,}\b', title.lower()))
        purpose_words = set(re.findall(r'\b\w{4,}\b', purpose.lower()))
        overlap = title_words & purpose_words
        if len(overlap) >= 2:
            score += 1

    score = min(score, 4)

    if score == 4:
        issues.append("Research question is clearly stated and well-aligned with the title.")
    elif score == 3:
        issues.append("Research question is present but could be more precisely stated.")
    elif score == 2:
        issues.append("A general purpose is indicated but lacks a specific, answerable research question.")
    else:
        issues.append("No clear research question or purpose statement found.")

    return DimensionResult(score=score, feedback=' '.join(issues))


def score_scope_precision(purpose: str, background: str, literature: str) -> DimensionResult:
    """Evaluate whether the scope is well-defined and consistent."""
    score = 1
    issues = []

    all_text = f"{purpose} {background} {literature}".lower()

    # Check for population specificity
    population_terms = ['students', 'patients', 'adults', 'children', 'adolescents',
                        'women', 'men', 'nurses', 'physicians', 'participants']
    has_population = any(term in all_text for term in population_terms)

    # Check for setting specificity
    setting_terms = ['university', 'hospital', 'clinic', 'school', 'community',
                     'urban', 'rural', 'college', 'primary care']
    has_setting = any(term in all_text for term in setting_terms)

    # Check for time/geographic boundaries
    boundary_terms = ['united states', 'u.s.', 'between', 'during', 'from', 'to',
                      'past decade', 'recent', 'current']
    has_boundaries = any(term in all_text for term in boundary_terms)

    if has_population:
        score += 1
    else:
        issues.append("Population is not clearly defined.")

    if has_setting:
        score += 1
    else:
        issues.append("Setting or context is not specified.")

    if has_boundaries:
        score += 1
    else:
        issues.append("Consider adding temporal or geographic boundaries to narrow scope.")

    score = min(score, 4)

    if score >= 3:
        issues.insert(0, "Scope is well-defined with clear boundaries.")
    elif score == 2:
        issues.insert(0, "Scope is partially defined but missing key boundaries.")

    return DimensionResult(score=score, feedback=' '.join(issues))


def score_evidence_integration(literature: str, included_count: int) -> DimensionResult:
    """Evaluate how well evidence from reviewed articles is integrated."""
    score = 1
    issues = []

    if not literature or len(literature.strip()) < 50:
        issues.append("Literature synthesis section is missing or too brief.")
        return DimensionResult(score=1, feedback=' '.join(issues))

    # Check for citation patterns (parenthetical references)
    citation_pattern = r'\([A-Z][a-z]+.*?\d{4}\)'
    citations_found = len(re.findall(citation_pattern, literature))

    # Check for integration language
    integration_terms = ['found that', 'demonstrated', 'showed', 'reported',
                         'concluded', 'suggested', 'indicated', 'revealed',
                         'according to', 'consistent with', 'in contrast']
    integration_count = sum(1 for term in integration_terms if term in literature.lower())

    if citations_found >= 3:
        score += 1
    elif citations_found >= 1:
        issues.append("More citations needed to support claims.")

    if integration_count >= 3:
        score += 1
    elif integration_count >= 1:
        issues.append("Add more evidence integration language to connect sources to claims.")

    # Check that enough included articles are being referenced
    if included_count >= 5 and citations_found >= included_count * 0.6:
        score += 1
    else:
        issues.append(f"You have {included_count} included articles — ensure most are referenced.")

    score = min(score, 4)

    if score >= 3:
        issues.insert(0, "Evidence is well-integrated with appropriate citations.")

    return DimensionResult(score=score, feedback=' '.join(issues))


def score_synthesis_depth(literature: str) -> DimensionResult:
    """Evaluate whether the student synthesizes rather than just summarizes."""
    score = 1
    issues = []

    if not literature or len(literature.strip()) < 50:
        issues.append("Literature synthesis section is too brief to evaluate.")
        return DimensionResult(score=1, feedback=' '.join(issues))

    # Check for synthesis language (comparing, contrasting, connecting sources)
    synthesis_terms = ['however', 'in contrast', 'similarly', 'conversely',
                       'on the other hand', 'whereas', 'compared to',
                       'consistent with', 'contradicts', 'supports',
                       'taken together', 'collectively', 'overall',
                       'the literature suggests', 'across studies']
    synthesis_count = sum(1 for term in synthesis_terms if term in literature.lower())

    # Check for analytical language (interpretation beyond summary)
    analysis_terms = ['implies', 'suggests that', 'this indicates', 'therefore',
                      'consequently', 'as a result', 'the gap', 'limitation',
                      'future research', 'remains unclear', 'warrants']
    analysis_count = sum(1 for term in analysis_terms if term in literature.lower())

    # Check paragraph count (synthesis typically requires multiple paragraphs)
    paragraphs = [p.strip() for p in literature.split('\n') if len(p.strip()) > 50]

    if synthesis_count >= 3:
        score += 1
    else:
        issues.append("Writing appears more descriptive than synthetic. Compare and contrast sources.")

    if analysis_count >= 2:
        score += 1
    else:
        issues.append("Add analytical interpretation — what do the findings collectively mean?")

    if len(paragraphs) >= 3 and len(literature) > 500:
        score += 1
    else:
        issues.append("Literature synthesis needs more depth and development.")

    score = min(score, 4)

    if score >= 3:
        issues.insert(0, "Good synthesis with evidence of analytical thinking.")

    return DimensionResult(score=score, feedback=' '.join(issues))


def score_methodological_awareness(literature: str, background: str, purpose: str) -> DimensionResult:
    """Evaluate awareness of research methodology."""
    score = 1
    issues = []

    all_text = f"{literature} {background} {purpose}".lower()

    # Check for design-related terminology
    design_terms = ['randomized', 'controlled trial', 'cohort', 'cross-sectional',
                    'qualitative', 'quantitative', 'mixed method', 'meta-analysis',
                    'systematic review', 'case study', 'phenomeno', 'grounded theory',
                    'experimental', 'quasi-experimental', 'longitudinal', 'retrospective']
    design_count = sum(1 for term in design_terms if term in all_text)

    # Check for methodology critique language
    critique_terms = ['limitation', 'validity', 'reliability', 'bias', 'generalizab',
                      'sample size', 'confound', 'self-report', 'blinding',
                      'rigorous', 'robust', 'methodological']
    critique_count = sum(1 for term in critique_terms if term in all_text)

    if design_count >= 3:
        score += 1
    elif design_count >= 1:
        issues.append("Mention more specific research designs used in your sources.")

    if critique_count >= 2:
        score += 1
    else:
        issues.append("Demonstrate methodological awareness by discussing study limitations and validity.")

    if design_count >= 3 and critique_count >= 3:
        score += 1

    score = min(score, 4)

    if score >= 3:
        issues.insert(0, "Good methodological awareness demonstrated.")
    elif score <= 1:
        issues.append("No evidence of methodological awareness. Discuss the designs and limitations of cited studies.")

    return DimensionResult(score=score, feedback=' '.join(issues))


def score_structural_completeness(draft: dict) -> DimensionResult:
    """Evaluate whether all required proposal sections are present and substantive."""
    score = 1
    issues = []

    sections = {
        'Title': draft.get('title', ''),
        'Background': draft.get('background', ''),
        'Problem Statement': draft.get('problemStatement', ''),
        'Purpose / Research Question': draft.get('purposeResearchQuestion', ''),
        'Literature Synthesis': draft.get('literatureSynthesis', ''),
        'Significance': draft.get('significance', ''),
        'Preliminary Questions': draft.get('preliminaryQuestions', ''),
    }

    present = 0
    substantive = 0
    missing = []

    for name, content in sections.items():
        if content and len(content.strip()) > 0:
            present += 1
            if len(content.strip()) > 50:
                substantive += 1
            else:
                issues.append(f"'{name}' section needs more development.")
        else:
            missing.append(name)

    if missing:
        issues.append(f"Missing sections: {', '.join(missing)}.")

    if present == 7:
        score += 1
    if substantive >= 5:
        score += 1
    if substantive == 7:
        score += 1

    score = min(score, 4)

    if score >= 3:
        issues.insert(0, "All required sections are present and substantive.")

    return DimensionResult(score=score, feedback=' '.join(issues))


def score_citation_presence(full_text: str) -> DimensionResult:
    """Evaluate whether claims are supported by citations."""
    score = 1
    issues = []

    if not full_text or len(full_text.strip()) < 100:
        issues.append("Proposal text is too brief to evaluate citation presence.")
        return DimensionResult(score=1, feedback=' '.join(issues))

    # Count citation patterns
    apa_pattern = r'\([A-Z][a-z]+.*?\d{4}\)'
    et_al_pattern = r'[A-Z][a-z]+\s+et\s+al\.\s*\(\d{4}\)'
    citations = len(re.findall(apa_pattern, full_text)) + len(re.findall(et_al_pattern, full_text))

    # Count sentences (rough estimate)
    sentences = len(re.findall(r'[.!?]+', full_text))

    if sentences > 0:
        citation_ratio = citations / max(sentences, 1)
    else:
        citation_ratio = 0

    if citations >= 8:
        score += 1
    elif citations >= 3:
        issues.append("Add more citations to support your claims.")

    if citation_ratio >= 0.3:
        score += 1
    else:
        issues.append("Many sentences lack citations. Ensure claims are evidence-backed.")

    if citations >= 12 and citation_ratio >= 0.4:
        score += 1

    score = min(score, 4)

    if score >= 3:
        issues.insert(0, "Citations are well-distributed throughout the proposal.")
    elif score <= 1:
        issues.append("Very few or no citations found. Academic proposals must cite sources.")

    return DimensionResult(score=score, feedback=' '.join(issues))


def generate_priority_fixes(results: dict[str, DimensionResult]) -> list[str]:
    """Return top 3 lowest-scoring dimensions as priority fixes."""
    sorted_dims = sorted(results.items(), key=lambda x: x[1].score)
    fixes = []
    for dim_name, result in sorted_dims[:3]:
        if result.score < 4:
            fixes.append(f"{dim_name} (Score: {result.score}/4): {result.feedback}")
    return fixes


def generate_revision_roadmap(results: dict[str, DimensionResult]) -> list[str]:
    """Generate ordered list of revision recommendations."""
    roadmap = []
    sorted_dims = sorted(results.items(), key=lambda x: x[1].score)

    for dim_name, result in sorted_dims:
        if result.score <= 2:
            roadmap.append(f"🔴 {dim_name}: {result.feedback}")
        elif result.score == 3:
            roadmap.append(f"🟡 {dim_name}: {result.feedback}")

    if not roadmap:
        roadmap.append("✅ All dimensions are strong. Consider refining for clarity and flow.")

    return roadmap


def score_proposal(draft_data: dict, included_count: int) -> dict:
    """
    Main scoring function. Takes proposal draft data and returns full rubric results.
    
    Args:
        draft_data: Dict with keys: title, background, problemStatement,
                    purposeResearchQuestion, literatureSynthesis, significance,
                    preliminaryQuestions
        included_count: Number of articles marked 'include'
    
    Returns:
        Dict with scores, narrativeFeedback, priorityFixes, revisionRoadmap
    """
    title = draft_data.get('title', '')
    background = draft_data.get('background', '')
    problem = draft_data.get('problemStatement', '')
    purpose = draft_data.get('purposeResearchQuestion', '')
    literature = draft_data.get('literatureSynthesis', '')
    significance = draft_data.get('significance', '')
    questions = draft_data.get('preliminaryQuestions', '')

    full_text = '\n\n'.join(
        s for s in [title, background, problem, purpose, literature, significance, questions] if s
    )

    results = {
        'Thesis Clarity': score_thesis_clarity(title, purpose, background),
        'Scope Precision': score_scope_precision(purpose, background, literature),
        'Evidence Integration': score_evidence_integration(literature, included_count),
        'Synthesis Depth': score_synthesis_depth(literature),
        'Methodological Awareness': score_methodological_awareness(literature, background, purpose),
        'Structural Completeness': score_structural_completeness(draft_data),
        'Citation Presence': score_citation_presence(full_text),
    }

    scores = {
        'thesisClarity': results['Thesis Clarity'].score,
        'scopePrecision': results['Scope Precision'].score,
        'evidenceIntegration': results['Evidence Integration'].score,
        'synthesisDepth': results['Synthesis Depth'].score,
        'methodologicalAwareness': results['Methodological Awareness'].score,
        'structuralCompleteness': results['Structural Completeness'].score,
        'citationPresence': results['Citation Presence'].score,
    }

    narrative_feedback = {
        'thesisClarity': results['Thesis Clarity'].feedback,
        'scopePrecision': results['Scope Precision'].feedback,
        'evidenceIntegration': results['Evidence Integration'].feedback,
        'synthesisDepth': results['Synthesis Depth'].feedback,
        'methodologicalAwareness': results['Methodological Awareness'].feedback,
        'structuralCompleteness': results['Structural Completeness'].feedback,
        'citationPresence': results['Citation Presence'].feedback,
    }

    priority_fixes = generate_priority_fixes(results)
    revision_roadmap = generate_revision_roadmap(results)

    return {
        'scores': scores,
        'narrativeFeedback': narrative_feedback,
        'priorityFixes': priority_fixes,
        'revisionRoadmap': revision_roadmap,
    }
