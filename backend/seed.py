"""Seed the database with test data for the demo student account."""

import uuid
import bcrypt
from app import create_app
from models import db
from models.user import User
from models.search_strategy import SearchStrategy
from models.quiz_result import QuizResult
from models.article import Article
from models.article_review import ArticleReview
from models.annotation import Annotation
from models.proposal_draft import ProposalDraft


def seed():
    app = create_app()
    with app.app_context():
        db.create_all()

        if User.query.first() is not None:
            print('Database already has users — skipping seed to preserve data.')
            return

        pw_hash = bcrypt.hashpw('password123'.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

        # ── Users ────────────────────────────────────────────────────────────
        user1 = User(
            id='user-1',
            email='student@university.edu',
            password_hash=pw_hash,
            name='Demo Student',
            consent_flag=True,
            design_literacy_complete=True,
            search_strategy_complete=True,
        )
        user2 = User(
            id='user-2',
            email='test@university.edu',
            password_hash=pw_hash,
            name='Test Student',
            consent_flag=None,
            design_literacy_complete=False,
            search_strategy_complete=False,
        )
        db.session.add_all([user1, user2])
        db.session.flush()

        # ── Search Strategy ───────────────────────────────────────────────────
        strategy = SearchStrategy(
            id=str(uuid.uuid4()),
            user_id='user-1',
            topic='Mindfulness-based interventions for anxiety in college students',
            population='Undergraduate students aged 18–24 in health professions programs',
            keywords=['mindfulness', 'anxiety', 'college students', 'MBSR', 'stress reduction', 'intervention'],
            boolean_operators=['AND'],
            filters=['Peer-reviewed only', 'Last 10 years', 'English language'],
            selected_databases=['PubMed', 'PsycINFO', 'CINAHL'],
            search_string='"mindfulness" AND "anxiety" AND "college students" AND "intervention"',
            research_question='Among undergraduate health professions students aged 18–24, does participation in a structured mindfulness-based stress reduction program compared to no intervention reduce self-reported anxiety scores over an 8-week period?',
        )
        db.session.add(strategy)

        # ── Quiz Result ───────────────────────────────────────────────────────
        quiz = QuizResult(
            id=str(uuid.uuid4()),
            user_id='user-1',
            score=85.0,
            passed=True,
            responses={'q1': 'RCT', 'q2': 'Phenomenology', 'q3': 'Systematic Review', 'q4': 'Cohort', 'q5': 'Grounded Theory'},
        )
        db.session.add(quiz)

        # ── Articles + Reviews + Annotations ─────────────────────────────────
        articles_data = [
            # ── INCLUDE 1 ──
            {
                'id': 'art-1',
                'title': 'Effects of an 8-Week Mindfulness-Based Stress Reduction Program on Anxiety in Undergraduate Health Professions Students',
                'authors': 'Chen, L., Martinez, R., & Thompson, K.',
                'year': 2023,
                'journal': 'Journal of Allied Health',
                'doi': '10.1016/j.jalliedhealth.2023.01.004',
                'abstract': 'This RCT examined the effectiveness of MBSR on anxiety in 120 undergraduate health professions students.',
                'review': {
                    'research_question': 'Does an 8-week MBSR program reduce anxiety in undergraduate health professions students compared to a waitlist control?',
                    'study_design': 'Randomized Controlled Trial',
                    'sample': '120 undergraduate health professions students at a mid-Atlantic university, randomly assigned to MBSR (n=60) or waitlist control (n=60)',
                    'key_findings': 'The MBSR group showed a statistically significant reduction in GAD-7 anxiety scores (mean decrease 4.2 points, p<0.001) compared to controls. Effect size was moderate (d=0.62). Benefits were maintained at 3-month follow-up.',
                    'significance': 'Provides strong evidence that MBSR can effectively reduce anxiety in health professions students, a population with high burnout risk.',
                    'design_strength_rating': 5,
                    'internal_validity_issues': 'Random assignment reduces selection bias. Blinded outcome assessment minimizes detection bias. Attrition was low (8%).',
                    'external_validity_issues': 'Sample drawn from single university limits generalizability. Voluntary participation may introduce self-selection bias toward motivated students.',
                    'limitations': [
                        'Self-reported anxiety measures subject to social desirability bias',
                        'Sample limited to one university, restricting generalizability',
                        'No active control condition — hard to rule out non-specific effects',
                        'Short follow-up period (3 months) limits conclusions about long-term effects',
                    ],
                    'applicability_to_scope': 'Directly applicable — same population, intervention, and outcome measures as the proposed study.',
                    'relevance_score': 5,
                    'evidence_strength_score': 5,
                    'argument_contribution_score': 5,
                    'why_include_exclude': 'Including because this is the highest-quality evidence directly matching my population and intervention. RCT design strengthens causal claims.',
                    'biggest_limitation': 'Single-site sample limits how broadly findings can be applied.',
                    'intended_use': 'Primary evidence for the effectiveness of MBSR in my target population. Will anchor the literature synthesis section.',
                    'inclusion_decision': 'include',
                },
                'annotation': {
                    'summary': 'Chen et al. (2023) examined whether an 8-week MBSR program reduces anxiety among undergraduate health professions students using a randomized controlled trial design with 120 participants. The study found significant reductions in GAD-7 anxiety scores in the intervention group (mean decrease 4.2 points, p<0.001), with moderate effect sizes maintained at 3-month follow-up.',
                    'evaluation': 'The RCT design with random assignment and blinded outcome assessment represents the strongest evidence hierarchy for intervention research. Internal validity is high; the primary limitation is single-site recruitment, which constrains external validity. The 8% attrition rate is acceptable and does not threaten the integrity of findings.',
                    'relevance': 'This study is directly applicable to the proposed research. It uses an identical target population (undergraduate health professions students), the same intervention type (MBSR), and the same outcome measure (GAD-7). Findings will anchor the literature synthesis and support the theoretical rationale for the proposed study.',
                }
            },
            # ── INCLUDE 2 ──
            {
                'id': 'art-2',
                'title': 'Perceived Stress and Academic Burnout Among Health Professions Students: A Longitudinal Cohort Study',
                'authors': 'Williams, J., & Patel, S.',
                'year': 2022,
                'journal': 'Academic Medicine',
                'doi': '10.1097/ACM.0000000000004812',
                'abstract': 'This longitudinal cohort study tracked stress and burnout trajectories across 4 years in health professions students.',
                'review': {
                    'research_question': 'How do stress and burnout levels change over the 4-year undergraduate health professions curriculum?',
                    'study_design': 'Cohort',
                    'sample': '245 health professions students tracked across 4 years of undergraduate training at three universities',
                    'key_findings': 'Anxiety symptoms increased significantly from Year 1 to Year 3 (p<0.01). 41% of students met clinical threshold for anxiety disorder by Year 2. Students with access to wellness interventions showed slower anxiety escalation.',
                    'significance': 'Demonstrates that anxiety is a progressive problem throughout the health professions curriculum, not an isolated event, arguing for early preventive intervention.',
                    'design_strength_rating': 4,
                    'internal_validity_issues': 'Longitudinal design allows temporal tracking. Self-report measures introduce potential bias. Some unmeasured confounders (e.g., personal life events).',
                    'external_validity_issues': 'Multi-site sample (3 universities) improves generalizability compared to single-site studies. All sites were mid-sized regional universities.',
                    'limitations': [
                        'Self-report measures susceptible to recall bias and social desirability',
                        'No control over external stressors affecting participants across years',
                        'Attrition of 18% over 4 years may introduce survivor bias',
                        'All sites were similar institutional types, limiting diversity of context',
                    ],
                    'applicability_to_scope': 'Establishes the scope and prevalence of the anxiety problem my intervention aims to address.',
                    'relevance_score': 4,
                    'evidence_strength_score': 4,
                    'argument_contribution_score': 4,
                    'why_include_exclude': 'Including to establish the problem statement. Demonstrates anxiety is pervasive and escalating in health professions students without intervention.',
                    'biggest_limitation': 'Attrition over 4 years and self-report measures limit the strength of longitudinal conclusions.',
                    'intended_use': 'Will be used in the Background section to justify the need for early preventive intervention in this population.',
                    'inclusion_decision': 'include',
                },
                'annotation': {
                    'summary': 'Williams and Patel (2022) conducted a 4-year longitudinal cohort study tracking stress and burnout in 245 health professions students across three universities. The study found that anxiety symptoms increased significantly from Year 1 to Year 3, with 41% of students meeting clinical anxiety thresholds by Year 2, and that access to wellness interventions moderated anxiety escalation.',
                    'evaluation': 'The cohort design provides strong longitudinal evidence appropriate for tracking developmental trajectories. Multi-site recruitment improves generalizability. The 18% attrition rate introduces potential survivor bias, and reliance on self-report measures limits objectivity. No causal claims can be drawn from cohort data.',
                    'relevance': 'This study provides essential epidemiological context for the proposed research by documenting the prevalence and trajectory of anxiety in the target population. The finding that wellness interventions moderate anxiety escalation supports the theoretical rationale for proposing a preventive mindfulness program.',
                }
            },
            # ── INCLUDE 3 ──
            {
                'id': 'art-3',
                'title': 'Mindfulness Meditation and Cognitive Flexibility: A Randomized Pilot Study in Pre-Clinical Medical Students',
                'authors': 'Johnson, A., Lee, B., & Nguyen, C.',
                'year': 2021,
                'journal': 'Medical Education',
                'doi': '10.1111/medu.14512',
                'abstract': 'This pilot RCT examined mindfulness meditation effects on cognitive flexibility and anxiety in pre-clinical medical students.',
                'review': {
                    'research_question': 'Does a 4-week daily mindfulness meditation practice improve cognitive flexibility and reduce anxiety symptoms in pre-clinical medical students?',
                    'study_design': 'Randomized Controlled Trial',
                    'sample': '48 pre-clinical medical students (Year 1–2) randomized to mindfulness meditation (n=24) or relaxation control (n=24)',
                    'key_findings': 'Mindfulness group showed significant improvements in cognitive flexibility (Trail Making Test, p=0.02) and reductions in State-Trait Anxiety Inventory scores (p=0.04). Control group showed no significant change.',
                    'significance': 'Extends anxiety reduction findings to cognitive performance outcomes, suggesting mindfulness may benefit academic functioning beyond emotional well-being.',
                    'design_strength_rating': 4,
                    'internal_validity_issues': 'Active control condition (relaxation) controls for non-specific attention effects. Small sample limits statistical power.',
                    'external_validity_issues': 'Medical students may not generalize to allied health programs. Single institution limits scope.',
                    'limitations': [
                        'Small sample size (n=48) limits statistical power and generalizability',
                        'Short intervention duration (4 weeks) compared to standard MBSR protocol (8 weeks)',
                        'Medical students differ from allied health students in several important ways',
                        'No follow-up assessment to evaluate sustainability of effects',
                    ],
                    'applicability_to_scope': 'Useful evidence for cognitive and emotional benefits of mindfulness in health professions students, though population differs slightly.',
                    'relevance_score': 4,
                    'evidence_strength_score': 4,
                    'argument_contribution_score': 3,
                    'why_include_exclude': 'Including because it provides evidence of mechanism (cognitive flexibility) and uses an active control condition, which strengthens the argument for mindfulness specifically.',
                    'biggest_limitation': 'Small sample size severely limits generalizability and statistical power.',
                    'intended_use': 'Will be cited in the Theoretical Framework section to support the cognitive-emotional mechanisms through which mindfulness reduces anxiety.',
                    'inclusion_decision': 'include',
                },
                'annotation': {
                    'summary': 'Johnson et al. (2021) conducted a pilot RCT with 48 pre-clinical medical students to examine whether 4 weeks of daily mindfulness meditation improves cognitive flexibility and reduces anxiety. The mindfulness group demonstrated significant improvements in cognitive flexibility and state-trait anxiety compared to an active relaxation control group.',
                    'evaluation': 'The use of an active control condition is a methodological strength, controlling for non-specific effects of focused attention. However, the small sample size (n=48) severely limits statistical power and generalizability. The 4-week intervention is shorter than standard MBSR protocols, and the medical student population may not fully generalize to allied health contexts.',
                    'relevance': 'This study supports the theoretical framework for the proposed research by identifying cognitive flexibility as a mechanism through which mindfulness reduces anxiety. The active control design strengthens the specificity argument for mindfulness-based approaches over general relaxation techniques.',
                }
            },
            # ── INCLUDE 4 ──
            {
                'id': 'art-4',
                'title': 'Barriers to Mental Health Service Utilization Among Undergraduate Students: A Mixed-Methods Study',
                'authors': 'Rodriguez, M., & Kim, H.',
                'year': 2022,
                'journal': 'Journal of College Student Mental Health',
                'doi': '10.1080/07448481.2022.2031840',
                'abstract': 'This mixed-methods study examined barriers to mental health service utilization in undergraduate students.',
                'review': {
                    'research_question': 'What barriers prevent undergraduate students from utilizing available mental health services on campus?',
                    'study_design': 'Descriptive',
                    'sample': '312 undergraduate students surveyed quantitatively; 24 selected for follow-up interviews; diverse institutional sample across 4 universities',
                    'key_findings': 'Primary barriers included stigma (67%), perceived lack of time (58%), long wait times (52%), and lack of awareness of available services (44%). Students with high anxiety were paradoxically less likely to seek help due to stigma.',
                    'significance': 'Reveals why anxiety rates remain high even when services exist, arguing for embedded, low-stigma interventions rather than referral-based models.',
                    'design_strength_rating': 3,
                    'internal_validity_issues': 'Mixed-methods design allows triangulation of quantitative and qualitative findings. Survey response rate was 71%. Self-report introduces bias.',
                    'external_validity_issues': 'Multi-university sample improves generalizability across institutional types. Voluntary participation may underrepresent highly stigmatized students.',
                    'limitations': [
                        'Self-report bias may cause underreporting of stigma-related barriers',
                        'Cross-sectional design cannot establish causal pathways',
                        'Qualitative sample (n=24) may not represent full range of experiences',
                        'All four universities were located in the same geographic region',
                    ],
                    'applicability_to_scope': 'Directly justifies the need for a class-embedded, low-stigma intervention format like the one I am proposing.',
                    'relevance_score': 4,
                    'evidence_strength_score': 3,
                    'argument_contribution_score': 5,
                    'why_include_exclude': 'Including because it directly justifies the format of my proposed intervention. If stigma prevents students from seeking traditional services, embedded classroom-based programs become essential.',
                    'biggest_limitation': 'Cross-sectional design and self-report measures limit causal interpretation.',
                    'intended_use': 'Will be used in the Problem Statement and Significance sections to argue that traditional mental health services fail to reach high-anxiety students due to structural and stigma-related barriers.',
                    'inclusion_decision': 'include',
                },
                'annotation': {
                    'summary': 'Rodriguez and Kim (2022) investigated barriers to mental health service utilization among 312 undergraduates using a mixed-methods design across four universities. Key barriers identified included stigma (67%), perceived time constraints (58%), long wait times (52%), and service unawareness (44%), with highly anxious students being paradoxically least likely to seek help.',
                    'evaluation': 'The mixed-methods design provides complementary quantitative breadth and qualitative depth, strengthening credibility through triangulation. Limitations include self-report bias, cross-sectional design precluding causal inference, and potential underrepresentation of the most stigmatized students. The 71% survey response rate is acceptable.',
                    'relevance': 'This study provides critical justification for the format of the proposed intervention. By documenting that stigma prevents high-anxiety students from accessing traditional services, it supports the rationale for an embedded, classroom-based mindfulness program that bypasses the help-seeking barrier entirely.',
                }
            },
            # ── INCLUDE 5 ──
            {
                'id': 'art-5',
                'title': 'Social Cognitive Theory as a Framework for Mindfulness Interventions in Health Education',
                'authors': 'Thompson, R., & Garcia, E.',
                'year': 2020,
                'journal': 'Health Education Research',
                'doi': '10.1093/her/cyaa018',
                'abstract': 'This theoretical paper applies Social Cognitive Theory to explain mechanisms of mindfulness-based interventions in health education contexts.',
                'review': {
                    'research_question': 'How does Social Cognitive Theory explain the mechanisms through which mindfulness-based interventions reduce anxiety and improve self-efficacy in health professions students?',
                    'study_design': 'Descriptive',
                    'sample': 'Theoretical review drawing on 42 empirical studies and foundational SCT literature (Bandura, 1977, 1986)',
                    'key_findings': 'Mindfulness interventions operate through SCT mechanisms: enhanced self-efficacy (observational learning of coping models), behavioral self-regulation (self-monitoring of anxiety triggers), and outcome expectations (recognition that anxiety is manageable). The paper proposes a conceptual model linking SCT constructs to mindfulness outcomes.',
                    'significance': 'Provides a theoretically grounded explanation for why mindfulness works in health education contexts, which is essential for designing theory-driven interventions.',
                    'design_strength_rating': 3,
                    'internal_validity_issues': 'Theoretical review with systematic selection criteria for included studies. Argument is logically coherent but not empirically tested in this paper.',
                    'external_validity_issues': 'Theoretical frameworks are inherently generalizable if the underlying theory is valid. SCT has extensive empirical support across health contexts.',
                    'limitations': [
                        'No original empirical data — theoretical argument cannot be tested within this paper',
                        'Selective citation may favor studies supporting the SCT-mindfulness link',
                        'Proposed conceptual model has not been empirically validated',
                        'Health professions literature is heavily weighted toward medical education vs. allied health',
                    ],
                    'applicability_to_scope': 'Provides the theoretical framework I will use to anchor my proposal.',
                    'relevance_score': 4,
                    'evidence_strength_score': 3,
                    'argument_contribution_score': 5,
                    'why_include_exclude': 'Including because it provides the theoretical grounding for my intervention design. My proposal will use SCT as its conceptual framework, making this a foundational citation.',
                    'biggest_limitation': 'No original empirical data; the SCT-mindfulness link is argued rather than directly tested.',
                    'intended_use': 'Primary citation for the Theoretical/Conceptual Framework section. Will use the SCT construct mapping to explain why mindfulness works in this population.',
                    'inclusion_decision': 'include',
                },
                'annotation': {
                    'summary': 'Thompson and Garcia (2020) synthesized 42 empirical studies through a Social Cognitive Theory lens to explain the mechanisms through which mindfulness-based interventions reduce anxiety and improve self-efficacy in health professions students. They propose a conceptual model linking SCT constructs (self-efficacy, behavioral self-regulation, outcome expectations) to mindfulness outcomes.',
                    'evaluation': 'As a theoretical synthesis rather than an empirical study, this work contributes conceptual clarity rather than causal evidence. The systematic selection of 42 studies and grounding in Bandura\'s extensively validated SCT framework strengthen the argument\'s credibility. The primary limitation is the absence of original data testing the proposed conceptual model.',
                    'relevance': 'This source is essential for the Theoretical/Conceptual Framework section of the proposed research. The SCT-mindfulness conceptual model it proposes will serve as the guiding framework, allowing the proposed study to be explicitly theory-driven and to explain why mindfulness should work for the target population rather than simply asserting that it does.',
                }
            },
            # ── EXCLUDE 1 ──
            {
                'id': 'art-6',
                'title': 'The Effect of Yoga Nidra on Sleep Quality in Nursing Students',
                'authors': 'Park, S., & Ahmed, N.',
                'year': 2021,
                'journal': 'Holistic Nursing Practice',
                'doi': '10.1097/HNP.0000000000000468',
                'abstract': 'This quasi-experimental study examined yoga nidra effects on sleep quality in nursing students.',
                'review': {
                    'research_question': 'Does a 6-week yoga nidra practice improve sleep quality scores in undergraduate nursing students?',
                    'study_design': 'Descriptive',
                    'sample': '62 undergraduate nursing students in a convenience sample; single intervention group with pre-post design',
                    'key_findings': 'Significant improvement in Pittsburgh Sleep Quality Index scores after 6 weeks (p<0.05). No control group was used.',
                    'significance': 'Suggests mind-body practices may benefit sleep in nursing students, but cannot rule out maturation or regression to the mean.',
                    'design_strength_rating': 2,
                    'internal_validity_issues': 'No control group means any observed improvement could be due to maturation, regression to the mean, or history effects. Pre-post design is weak for causal inference.',
                    'external_validity_issues': 'Nursing students only; outcome is sleep quality rather than anxiety; intervention is yoga nidra rather than MBSR.',
                    'limitations': [
                        'No control group — cannot rule out alternative explanations for improvement',
                        'Convenience sample with no randomization',
                        'Outcome (sleep quality) does not directly measure anxiety',
                        'Intervention (yoga nidra) is not directly comparable to MBSR',
                        'Short follow-up, no sustainability data',
                    ],
                    'applicability_to_scope': 'Limited applicability — different intervention, different outcome variable, and weak design.',
                    'relevance_score': 2,
                    'evidence_strength_score': 1,
                    'argument_contribution_score': 1,
                    'why_include_exclude': 'Excluding because the intervention (yoga nidra) and outcome (sleep quality) do not align with my research question. The absence of a control group also makes evidence quality too weak to support causal claims about anxiety reduction.',
                    'biggest_limitation': 'No control group makes it impossible to attribute changes to the intervention.',
                    'intended_use': 'Not applicable — excluded from the proposal.',
                    'inclusion_decision': 'exclude',
                },
            },
            # ── EXCLUDE 2 ──
            {
                'id': 'art-7',
                'title': 'Burnout Prevalence in Physicians: A Systematic Review Across Specialties',
                'authors': 'Shanafelt, T., Dyrbye, L., & West, C.',
                'year': 2019,
                'journal': 'JAMA Internal Medicine',
                'doi': '10.1001/jamainternmed.2019.1318',
                'abstract': 'This systematic review synthesized burnout prevalence data across physician specialties.',
                'review': {
                    'research_question': 'What is the prevalence of burnout among U.S. physicians across clinical specialties, and how has it changed over time?',
                    'study_design': 'Systematic Review',
                    'sample': '47 studies included; combined sample of over 20,000 physicians across all major specialties',
                    'key_findings': 'Overall physician burnout prevalence of 44%. Emergency medicine and primary care had highest rates. Burnout increased 9% from 2011 to 2014. Female physicians showed higher burnout rates.',
                    'significance': 'Establishes burnout as a systemic problem across medicine requiring organizational-level responses beyond individual interventions.',
                    'design_strength_rating': 5,
                    'internal_validity_issues': 'Systematic review methodology with explicit inclusion criteria reduces selection bias. Heterogeneity in burnout measurement instruments across studies is a notable limitation.',
                    'external_validity_issues': 'Physicians only — findings do not directly apply to undergraduate health professions students. Career stage differs substantially.',
                    'limitations': [
                        'Focuses on physicians rather than students — different career stage and stressors',
                        'Heterogeneous burnout measures across included studies limit comparability',
                        'Studies vary in response rates and recruitment methods',
                        'Population (practicing physicians) does not match my target population',
                    ],
                    'applicability_to_scope': 'Not applicable to my research question about undergraduate students.',
                    'relevance_score': 1,
                    'evidence_strength_score': 5,
                    'argument_contribution_score': 1,
                    'why_include_exclude': 'Excluding because the population (practicing physicians) does not match my target population (undergraduate students). Despite high methodological quality, the mismatch in career stage makes this evidence inapplicable to my proposal.',
                    'biggest_limitation': 'Population mismatch — this study is about practicing physicians, not undergraduate students.',
                    'intended_use': 'Not applicable — excluded from the proposal.',
                    'inclusion_decision': 'exclude',
                },
            },
        ]

        for adata in articles_data:
            article = Article(
                id=adata['id'],
                user_id='user-1',
                title=adata['title'],
                authors=adata['authors'],
                year=adata['year'],
                journal=adata['journal'],
                doi=adata.get('doi'),
                abstract=adata.get('abstract'),
                review_complete=True,
            )
            db.session.add(article)
            db.session.flush()

            r = adata['review']
            review = ArticleReview(
                id=str(uuid.uuid4()),
                article_id=adata['id'],
                research_question=r['research_question'],
                study_design=r['study_design'],
                sample=r['sample'],
                key_findings=r['key_findings'],
                significance=r['significance'],
                design_strength_rating=r['design_strength_rating'],
                internal_validity_issues=r['internal_validity_issues'],
                external_validity_issues=r['external_validity_issues'],
                limitations=r['limitations'],
                applicability_to_scope=r['applicability_to_scope'],
                relevance_score=r['relevance_score'],
                evidence_strength_score=r['evidence_strength_score'],
                argument_contribution_score=r['argument_contribution_score'],
                why_include_exclude=r['why_include_exclude'],
                biggest_limitation=r['biggest_limitation'],
                intended_use=r['intended_use'],
                inclusion_decision=r['inclusion_decision'],
            )
            db.session.add(review)

            if 'annotation' in adata:
                ann = adata['annotation']
                annotation = Annotation(
                    id=str(uuid.uuid4()),
                    article_id=adata['id'],
                    summary=ann['summary'],
                    evaluation=ann['evaluation'],
                    relevance=ann['relevance'],
                )
                db.session.add(annotation)

        # ── Proposal Draft ────────────────────────────────────────────────────
        proposal = ProposalDraft(
            id=str(uuid.uuid4()),
            user_id='user-1',
            version=1,
            title='The Effect of a Structured Mindfulness-Based Stress Reduction Program on Anxiety Among Undergraduate Health Professions Students',
            background=(
                'Anxiety disorders are among the most prevalent mental health concerns on college campuses, '
                'affecting approximately 30% of undergraduate students nationwide (ACHA, 2023). Health professions '
                'students face compounded stressors including clinical training demands, high academic stakes, and '
                'patient care responsibilities that begin early in their programs. Williams and Patel (2022) found '
                'that 41% of health professions students met clinical anxiety thresholds by their second year, with '
                'anxiety levels escalating progressively through the curriculum.\n\n'
                'Despite the availability of campus counseling services, utilization remains low. Rodriguez and Kim '
                '(2022) identified stigma (67%), perceived lack of time (58%), and long wait times (52%) as primary '
                'barriers to help-seeking. Students with the highest anxiety were paradoxically least likely to seek '
                'services. This pattern suggests that referral-based models are insufficient and that embedded, '
                'low-stigma interventions are needed.\n\n'
                'Mindfulness-based stress reduction (MBSR), developed by Kabat-Zinn (1990), is an 8-week structured '
                'program combining meditation, body awareness, and yoga. Meta-analyses consistently demonstrate '
                'MBSR\'s effectiveness for anxiety reduction across clinical and non-clinical populations. However, '
                'evidence specific to undergraduate health professions students remains limited.'
            ),
            problem_statement=(
                'Health professions students experience disproportionately high anxiety rates compared to the general '
                'undergraduate population, yet are less likely to access traditional mental health services due to '
                'stigma, time constraints, and structural barriers (Rodriguez & Kim, 2022). Without intervention, '
                'anxiety escalates progressively through the curriculum, contributing to burnout, academic '
                'underperformance, and early attrition from health professions programs (Williams & Patel, 2022).\n\n'
                'While mindfulness-based interventions have demonstrated effectiveness in reducing anxiety in general '
                'college populations (Chen et al., 2023), there is limited research examining whether structured '
                'MBSR programs — embedded within the health professions curriculum to bypass help-seeking barriers — '
                'can produce measurable anxiety reduction in this specific high-risk group. This gap in the literature '
                'represents an important opportunity for evidence-based program development.'
            ),
            purpose_research_question=(
                'The purpose of this study is to examine the effectiveness of an 8-week, curriculum-embedded '
                'mindfulness-based stress reduction program on self-reported anxiety symptoms among undergraduate '
                'health professions students.\n\n'
                'Primary Research Question: Among undergraduate health professions students aged 18–24, does '
                'participation in an 8-week curriculum-embedded MBSR program, compared to a waitlist control '
                'condition, produce a significant reduction in GAD-7 anxiety scores at post-intervention?\n\n'
                'Hypothesis: Students in the MBSR condition will demonstrate significantly greater reductions in '
                'GAD-7 anxiety scores from baseline to post-intervention compared to students in the waitlist '
                'control condition (d ≥ 0.50).'
            ),
            theoretical_framework=(
                'This study is grounded in Social Cognitive Theory (SCT; Bandura, 1977, 1986), which posits that '
                'behavior change results from the dynamic interaction of personal cognition, behavioral patterns, '
                'and environmental influences. Three SCT constructs are particularly relevant to understanding how '
                'MBSR reduces anxiety in health professions students.\n\n'
                'First, self-efficacy — the belief in one\'s capacity to manage challenging situations — is a central '
                'determinant of anxiety. MBSR builds self-efficacy through mastery experiences (successfully '
                'completing meditation practices) and observational learning (seeing peers manage anxiety). Thompson '
                'and Garcia (2020) demonstrate that enhanced self-efficacy is a primary mechanism through which '
                'mindfulness reduces anxiety in health education contexts.\n\n'
                'Second, behavioral self-regulation enables students to identify anxiety triggers and apply '
                'mindfulness techniques as coping strategies, interrupting automatic anxiety escalation cycles.\n\n'
                'Third, outcome expectations — beliefs about the likely results of one\'s actions — shift through '
                'MBSR as students experience that anxiety is manageable and temporary rather than overwhelming.\n\n'
                'This SCT framework explains not only why MBSR should reduce anxiety but also why curriculum '
                'embedding matters: structured group delivery creates the social modeling and shared mastery '
                'experiences that SCT identifies as essential for self-efficacy development.'
            ),
            literature_synthesis=(
                'Three converging themes emerge from the reviewed literature.\n\n'
                'Theme 1: Anxiety is a pervasive, escalating problem in health professions education. '
                'Williams and Patel (2022) documented progressive anxiety escalation across all four years of '
                'health professions training, with 41% of students meeting clinical thresholds by Year 2. This '
                'trajectory suggests the problem is structural rather than episodic, requiring preventive '
                'intervention rather than crisis response.\n\n'
                'Theme 2: Traditional mental health services fail to reach the highest-risk students. '
                'Rodriguez and Kim (2022) found that stigma and access barriers prevent students with the highest '
                'anxiety from seeking help, creating a paradox where services exist but are unused by those who '
                'need them most. This evidence directly challenges referral-based intervention models and supports '
                'the case for embedded, universal approaches.\n\n'
                'Theme 3: Mindfulness-based interventions demonstrate evidence-based effectiveness for anxiety '
                'reduction in proximate populations. Chen et al. (2023) demonstrated significant GAD-7 reductions '
                '(d=0.62) in health professions students through RCT methodology. Johnson et al. (2021) extended '
                'findings to cognitive outcomes using an active control design. Across studies, effect sizes are '
                'moderate and clinically meaningful.\n\n'
                'A critical gap remains: no study has examined whether curriculum-embedded MBSR — specifically '
                'designed to bypass the help-seeking barrier — produces anxiety reduction equivalent to '
                'clinic-administered protocols in health professions students.'
            ),
            proposed_methodology=(
                'Research Design: A randomized controlled trial will be employed to evaluate the effectiveness of '
                'an 8-week curriculum-embedded MBSR program on GAD-7 anxiety scores. RCT methodology was selected '
                'because it provides the strongest evidence for causal inference and aligns with the existing '
                'literature base (Chen et al., 2023).\n\n'
                'Sampling Strategy: Participants will be recruited from first- and second-year undergraduate health '
                'professions courses at Towson University. Inclusion criteria: enrolled in a health professions '
                'program, aged 18 or older, English proficiency. Exclusion criteria: current enrollment in '
                'psychotherapy, current psychiatric medication changes. Target sample: 120 participants (60 per '
                'condition), based on power analysis using Chen et al.\'s (2023) effect size (d=0.62, alpha=0.05, '
                'power=0.80) with 15% attrition buffer.\n\n'
                'Intervention: The 8-week MBSR curriculum (Kabat-Zinn, 1990) will be embedded within existing '
                'professional development coursework. Sessions will occur once weekly (2 hours) with 20 minutes '
                'of daily home practice. Control participants will receive MBSR after the study concludes '
                '(waitlist control).\n\n'
                'Outcome Measurement: Primary outcome: GAD-7 (Generalized Anxiety Disorder Scale, 7-item) '
                'administered at baseline, post-intervention (Week 8), and follow-up (Week 20). The GAD-7 '
                'demonstrates strong validity (Spitzer et al., 2006) and has been used consistently in comparable '
                'studies.\n\n'
                'Analysis: Intent-to-treat analysis using mixed-effects ANCOVA controlling for baseline anxiety '
                'scores. Between-group differences at post-intervention will serve as the primary endpoint.'
            ),
            significance=(
                'Theoretical Contribution: This study will extend the evidence base for MBSR effectiveness to '
                'curriculum-embedded delivery formats, testing whether the mechanism of change (SCT self-efficacy '
                'development) operates equivalently when MBSR bypasses the help-seeking barrier. A positive '
                'finding would support the theoretical argument that the active ingredient is the MBSR content '
                'itself rather than the clinic context.\n\n'
                'Practical Contribution: If effective, curriculum-embedded MBSR provides a scalable, low-cost '
                'model for anxiety prevention in health professions programs that does not require students to '
                'self-identify as needing mental health support. This addresses the structural barrier Rodriguez '
                'and Kim (2022) identified as the primary obstacle to reach high-anxiety students.\n\n'
                'Institutional Contribution: Findings will directly inform Towson University\'s student wellness '
                'programming within the College of Health Professions and contribute to the institution\'s R1 '
                'research mission by generating IRB-approved empirical data in an understudied population.'
            ),
            preliminary_questions=(
                'Limitations: This study has several potential limitations that should be considered when '
                'interpreting findings. First, curriculum embedding limits randomization purity — students in '
                'control sections may receive informal MBSR exposure through social contact with intervention '
                'peers (contamination bias). Second, reliance on GAD-7 as a self-report measure introduces '
                'social desirability bias, particularly in a clinical training context where anxiety may be '
                'stigmatized. Third, the single-university setting limits external validity, though the use of '
                'multiple course sections will improve within-institution representativeness.\n\n'
                'Future Directions: If results demonstrate efficacy, future research should examine: (1) the '
                'minimum effective dose of MBSR for anxiety reduction (full 8 weeks vs. abbreviated protocols); '
                '(2) long-term effects on clinical performance and patient care outcomes in graduating health '
                'professions students; and (3) scalability across diverse institutional types, including '
                'community colleges and minority-serving institutions with distinct student population '
                'characteristics.'
            ),
            submitted_for_rubric=False,
        )
        db.session.add(proposal)
        db.session.commit()

        print('Database seeded successfully!')
        print(f'  student@university.edu — Demo account: strategy, quiz, 7 articles (5 include, 2 exclude), annotations, proposal')
        print(f'  test@university.edu    — Fresh account: no pipeline data')
        print(f'  Password for both: password123')


if __name__ == '__main__':
    seed()
