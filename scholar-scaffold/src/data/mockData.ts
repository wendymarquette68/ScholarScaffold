import { User, Article, ArticleReview, ProposalDraft, RubricResult, ResearchDesign, QuizQuestion } from '../types';

export const mockUsers: User[] = [
  {
    id: 'user-1',
    email: 'student@university.edu',
    name: 'Alex Johnson',
    consentFlag: true,
    designLiteracyComplete: true,
    searchStrategyComplete: true,
  },
  {
    id: 'user-2',
    email: 'student2@university.edu',
    name: 'Jordan Smith',
    consentFlag: false,
    designLiteracyComplete: false,
    searchStrategyComplete: false,
  },
  {
    id: 'user-3',
    email: 'test@university.edu',
    name: 'Test Student',
    consentFlag: null,
    designLiteracyComplete: false,
    searchStrategyComplete: false,
  },
];

const sampleReviewInclude1: ArticleReview = {
  researchQuestion: 'What is the effect of mindfulness-based interventions on anxiety in college students?',
  studyDesign: 'Randomized Controlled Trial',
  sample: '120 undergraduate students aged 18-24 from a large public university',
  keyFindings: 'Participants in the mindfulness group showed a statistically significant reduction in anxiety scores (p < 0.01) compared to the control group over 8 weeks.',
  significance: 'Demonstrates that structured mindfulness programs can be effective in reducing anxiety among college populations.',
  designStrengthRating: 4,
  internalValidityIssues: 'Self-reported anxiety measures may introduce reporting bias. No blinding of participants.',
  externalValidityIssues: 'Single university sample limits generalizability to other settings.',
  limitations: [
    'Small sample size relative to the population',
    'Self-reported outcome measures may introduce bias',
    'Short follow-up period (8 weeks) limits understanding of long-term effects',
  ],
  applicabilityToScope: 'Directly relevant as it examines a mental health intervention for the target population of college students.',
  relevanceScore: 5,
  evidenceStrengthScore: 4,
  argumentContributionScore: 5,
  whyIncludeExclude: 'This study directly addresses my research question about mental health interventions for college students and uses a strong experimental design.',
  biggestLimitation: 'The short follow-up period means we cannot conclude whether the benefits persist beyond 8 weeks.',
  intendedUse: 'Will use as primary evidence supporting the effectiveness of mindfulness-based interventions in the literature synthesis section.',
  inclusionDecision: 'include',
};

const sampleReviewInclude2: ArticleReview = {
  researchQuestion: 'How do college students perceive barriers to mental health service utilization?',
  studyDesign: 'Phenomenology',
  sample: '25 undergraduate students who self-identified as experiencing mental health challenges',
  keyFindings: 'Three major themes emerged: stigma, lack of awareness of services, and time constraints. Students preferred peer-led support over formal counseling.',
  significance: 'Provides rich qualitative insight into why students underutilize existing mental health resources.',
  designStrengthRating: 3,
  internalValidityIssues: 'Researcher bias in thematic coding. Single coder used for initial analysis.',
  externalValidityIssues: 'Purposive sampling limits representativeness.',
  limitations: [
    'Small purposive sample may not represent all student experiences',
    'Single coder for initial analysis introduces potential bias',
    'Study conducted at one institution only',
  ],
  applicabilityToScope: 'Helps frame the problem by explaining why interventions may not reach students who need them.',
  relevanceScore: 4,
  evidenceStrengthScore: 3,
  argumentContributionScore: 4,
  whyIncludeExclude: 'Provides essential qualitative context for understanding barriers, which complements the quantitative evidence in my proposal.',
  biggestLimitation: 'Reliance on a single coder without intercoder reliability check weakens trustworthiness of findings.',
  intendedUse: 'Will use to frame the problem statement and justify the need for accessible interventions.',
  inclusionDecision: 'include',
};

const sampleReviewExclude: ArticleReview = {
  researchQuestion: 'What is the prevalence of smartphone addiction among high school students in South Korea?',
  studyDesign: 'Cross-Sectional',
  sample: '500 high school students from Seoul metropolitan area',
  keyFindings: '32% of students met criteria for problematic smartphone use, with significant correlations to sleep quality and academic performance.',
  significance: 'Highlights a growing concern about technology use in adolescent populations.',
  designStrengthRating: 2,
  internalValidityIssues: 'Cross-sectional design cannot establish causation. Self-reported measures of addiction.',
  externalValidityIssues: 'South Korean high school context differs significantly from US college populations.',
  limitations: [
    'Cross-sectional design prevents causal inference',
    'Population is high school students, not college-age',
    'Cultural context (South Korea) may not generalize to US settings',
  ],
  applicabilityToScope: 'While tangentially related to student well-being, the population and topic do not align with my research question about mental health interventions for college students.',
  relevanceScore: 2,
  evidenceStrengthScore: 2,
  argumentContributionScore: 1,
  whyIncludeExclude: 'Excluding because the population (high school students in South Korea) and topic (smartphone addiction) do not align with my focus on mental health interventions for US college students.',
  biggestLimitation: 'The population is fundamentally different from my target population.',
  intendedUse: 'N/A — excluded from proposal.',
  inclusionDecision: 'exclude',
};

export const mockArticles: Article[] = [
  {
    id: 'article-1',
    userId: 'user-1',
    title: 'Effectiveness of Mindfulness-Based Stress Reduction on Anxiety in College Students: A Randomized Controlled Trial',
    authors: 'Chen, L., Martinez, R., & Thompson, K.',
    year: 2023,
    journal: 'Journal of American College Health',
    doi: '10.1080/07448481.2023.1234567',
    abstract: 'This randomized controlled trial examined the effectiveness of an 8-week mindfulness-based stress reduction program on anxiety levels among 120 undergraduate students.',
    reviewComplete: true,
    review: sampleReviewInclude1,
  },
  {
    id: 'article-2',
    userId: 'user-1',
    title: 'Barriers to Mental Health Service Utilization Among Undergraduate Students: A Phenomenological Study',
    authors: 'Williams, D. & Patel, S.',
    year: 2022,
    journal: 'Journal of College Student Psychotherapy',
    doi: '10.1080/87568225.2022.9876543',
    abstract: 'Using a phenomenological approach, this study explored the lived experiences of 25 undergraduate students who faced barriers to accessing campus mental health services.',
    reviewComplete: true,
    review: sampleReviewInclude2,
  },
  {
    id: 'article-3',
    userId: 'user-1',
    title: 'Smartphone Addiction and Academic Performance Among High School Students in Seoul',
    authors: 'Kim, J., Lee, H., & Park, S.',
    year: 2021,
    journal: 'Asian Journal of Psychiatry',
    doi: '10.1016/j.ajp.2021.102789',
    abstract: 'A cross-sectional survey of 500 high school students in Seoul examining the prevalence of smartphone addiction and its correlation with academic performance and sleep quality.',
    reviewComplete: true,
    review: sampleReviewExclude,
  },
];

export const mockAnnotatedBibliography = [
  {
    articleId: 'article-1',
    apaCitation: 'Chen, L., Martinez, R., & Thompson, K. (2023). Effectiveness of mindfulness-based stress reduction on anxiety in college students: A randomized controlled trial. *Journal of American College Health*, 71(4), 345-356. https://doi.org/10.1080/07448481.2023.1234567',
    summary: 'Chen et al. (2023) conducted a randomized controlled trial examining the effectiveness of an 8-week mindfulness-based stress reduction (MBSR) program on anxiety levels among 120 undergraduate students. Participants in the MBSR group demonstrated a statistically significant reduction in anxiety scores compared to the waitlist control group.',
    criticalEvaluation: 'The study employed a strong experimental design with random assignment, enhancing internal validity. However, the reliance on self-reported anxiety measures and lack of participant blinding introduce potential bias. The sample, drawn from a single university, limits generalizability.',
    relevance: 'This study directly supports the proposed research by demonstrating that structured mindfulness interventions can effectively reduce anxiety in college populations, providing primary evidence for the literature synthesis.',
  },
];

export const mockProposalDraft: ProposalDraft = {
  version: 1,
  title: 'The Impact of Mindfulness-Based Interventions on Anxiety Reduction Among Undergraduate Students',
  background: 'Anxiety disorders are among the most prevalent mental health concerns on college campuses, affecting approximately 30% of undergraduate students (ACHA, 2023). Despite the availability of campus counseling services, many students face barriers to access including stigma, time constraints, and lack of awareness.',
  problemStatement: 'While mindfulness-based interventions have shown promise in clinical populations, there is limited research examining their effectiveness specifically within the undergraduate student population when delivered through accessible, peer-led formats.',
  purposeResearchQuestion: 'The purpose of this study is to examine the effectiveness of a peer-led mindfulness program on reducing anxiety symptoms among undergraduate students. Research Question: Does participation in a 10-week peer-led mindfulness program reduce self-reported anxiety scores compared to a control group?',
  literatureSynthesis: 'The existing literature demonstrates that mindfulness-based stress reduction programs can effectively reduce anxiety in college populations (Chen et al., 2023). However, barriers to mental health service utilization persist (Williams & Patel, 2022).',
  significance: 'This study addresses a critical gap by examining whether peer-led delivery of mindfulness interventions can overcome access barriers while maintaining effectiveness.',
  preliminaryQuestions: 'What is the optimal duration for a peer-led mindfulness program? How can we measure anxiety in a valid and reliable way? What training do peer facilitators need?',
};

export const mockRubricResult: RubricResult = {
  scores: {
    thesisClarity: 3,
    scopePrecision: 2,
    evidenceIntegration: 3,
    synthesisDepth: 2,
    methodologicalAwareness: 3,
    structuralCompleteness: 3,
    citationPresence: 2,
  },
  narrativeFeedback: {
    thesisClarity: 'Your research question is clearly stated. Consider specifying the population more precisely (e.g., age range, institution type).',
    scopePrecision: 'The scope could be narrowed. "Undergraduate students" is broad — consider specifying the discipline or demographic focus.',
    evidenceIntegration: 'Good use of sources in the literature synthesis. Add more citations to support claims in the background section.',
    synthesisDepth: 'The literature review summarizes individual studies but lacks synthesis across sources. Try identifying themes or contradictions.',
    methodologicalAwareness: 'You demonstrate awareness of study designs. Strengthen by discussing how design choices affect the evidence strength.',
    structuralCompleteness: 'All required sections are present. The significance section could be expanded with more detail about potential impact.',
    citationPresence: 'Several claims in the background and problem statement lack citations. Ensure every factual claim is supported.',
  },
  priorityFixes: [
    'Add citations to unsupported claims in the background section',
    'Synthesize across sources rather than summarizing each individually',
    'Narrow the scope by specifying your target population more precisely',
  ],
  revisionRoadmap: [
    'Review each sentence in the background — add a citation for every factual claim',
    'Create a synthesis paragraph that connects Chen et al. and Williams & Patel findings',
    'Revise the purpose statement to include specific population demographics',
    'Expand the significance section with potential implications for practice',
    'Add a transition between the problem statement and purpose that shows logical flow',
  ],
};

export const researchDesigns: ResearchDesign[] = [
  {
    name: 'Randomized Controlled Trial',
    category: 'quantitative',
    description: 'An experimental study where participants are randomly assigned to treatment or control groups. The gold standard for testing cause-and-effect relationships.',
    whenUsed: 'When researchers want to determine if a specific intervention causes a particular outcome.',
    evidenceStrength: 'Very High — provides the strongest evidence for causation among individual study designs.',
  },
  {
    name: 'Cohort Study',
    category: 'quantitative',
    description: 'An observational study that follows a group of people over time to see how an exposure affects outcomes. Can be prospective (forward-looking) or retrospective (backward-looking).',
    whenUsed: 'When studying the long-term effects of exposures or risk factors that cannot be ethically randomized.',
    evidenceStrength: 'High — strong for identifying associations, but cannot definitively prove causation.',
  },
  {
    name: 'Case-Control Study',
    category: 'quantitative',
    description: 'Compares people with a condition (cases) to those without it (controls) and looks backward to identify differences in exposures.',
    whenUsed: 'When studying rare diseases or outcomes, or when a cohort study would take too long.',
    evidenceStrength: 'Moderate — useful for generating hypotheses but susceptible to recall bias.',
  },
  {
    name: 'Cross-Sectional Study',
    category: 'quantitative',
    description: 'A snapshot study that measures exposure and outcome at a single point in time in a defined population.',
    whenUsed: 'When measuring prevalence of a condition or generating hypotheses about associations.',
    evidenceStrength: 'Low-Moderate — cannot determine temporal sequence or causation.',
  },
  {
    name: 'Descriptive Study',
    category: 'quantitative',
    description: 'Describes characteristics of a population or phenomenon. Includes case reports, case series, and surveys.',
    whenUsed: 'When documenting new conditions, describing populations, or exploring topics with limited prior research.',
    evidenceStrength: 'Low — useful for hypothesis generation but cannot test associations.',
  },
  {
    name: 'Phenomenology',
    category: 'qualitative',
    description: 'Explores the lived experience of individuals who share a common phenomenon. Seeks to understand the essence of that experience.',
    whenUsed: 'When the goal is to deeply understand what it is like to experience a particular situation or condition.',
    evidenceStrength: 'Provides deep understanding of experience — not ranked on quantitative evidence hierarchies.',
  },
  {
    name: 'Grounded Theory — Classic (Glaserian)',
    category: 'qualitative',
    description: 'The original approach developed by Barney Glaser. Emphasizes emergence — the researcher lets theory arise from data without forcing preconceived frameworks. Uses constant comparative analysis, theoretical sampling, and memo-writing. The researcher remains objective and avoids imposing literature-based concepts early.',
    whenUsed: 'When the goal is to discover a core category and generate theory purely from data, with minimal researcher influence on what emerges.',
    evidenceStrength: 'Strong for theory development — generates parsimonious, data-driven frameworks that can later be tested.',
  },
  {
    name: 'Grounded Theory — Constructivist (Charmazian)',
    category: 'qualitative',
    description: 'Developed by Kathy Charmaz. Acknowledges that the researcher co-constructs meaning with participants. Emphasizes reflexivity, context, and multiple realities. Uses the same coding methods (initial, focused, theoretical) but views the resulting theory as an interpretive portrayal rather than an objective discovery.',
    whenUsed: 'When the researcher recognizes their own influence on data interpretation and wants to foreground participant voices and social context in theory building.',
    evidenceStrength: 'Strong for contextual, interpretive theory — valued in social science and nursing research for its reflexive rigor.',
  },
  {
    name: 'Grounded Theory — Straussian/Corbinian',
    category: 'qualitative',
    description: 'Developed by Anselm Strauss and Juliet Corbin. More structured than Classic GT, with a prescribed coding paradigm: open coding, axial coding (identifying relationships among categories), and selective coding. Uses a conditional matrix to map contextual conditions. More procedural and systematic in approach.',
    whenUsed: 'When the researcher wants a structured, step-by-step analytic framework for building theory, especially useful for novice qualitative researchers.',
    evidenceStrength: 'Strong for systematic theory development — the structured coding paradigm provides clear audit trails.',
  },
  {
    name: 'Case Study',
    category: 'qualitative',
    description: 'An in-depth investigation of a single case or small number of cases within their real-life context.',
    whenUsed: 'When studying complex phenomena in context, especially unique or revelatory situations.',
    evidenceStrength: 'Provides rich contextual understanding — limited generalizability.',
  },
  {
    name: 'Ethnography',
    category: 'qualitative',
    description: 'Studies culture and social interactions through prolonged immersion and observation in a community or group.',
    whenUsed: 'When seeking to understand cultural practices, beliefs, or social dynamics from an insider perspective.',
    evidenceStrength: 'Provides cultural and contextual understanding — not ranked on quantitative hierarchies.',
  },
  {
    name: 'Quasi-Experimental',
    category: 'quantitative',
    description: 'A study that tests the effect of an intervention but lacks random assignment. Uses pre-existing groups, matching, or statistical controls to approximate experimental conditions.',
    whenUsed: 'When random assignment is not feasible due to ethical, practical, or logistical constraints, but the researcher still wants to estimate causal effects.',
    evidenceStrength: 'Moderate-High — stronger than observational designs but weaker than RCTs due to potential selection bias.',
  },
  {
    name: 'Mixed Methods',
    category: 'quantitative',
    description: 'Combines quantitative and qualitative methods in a single study to provide a more complete understanding. Common designs include convergent parallel, explanatory sequential, and exploratory sequential.',
    whenUsed: 'When neither quantitative nor qualitative methods alone can fully address the research question, and integration of both provides richer insight.',
    evidenceStrength: 'Varies by design — strength depends on the rigor of both the quantitative and qualitative components and how well they are integrated.',
  },
  {
    name: 'Systematic Review',
    category: 'synthesis',
    description: 'A comprehensive, structured review of all available evidence on a specific question using predefined search and evaluation criteria.',
    whenUsed: 'When synthesizing all existing evidence on a topic to draw overall conclusions.',
    evidenceStrength: 'Very High — considered the highest level of evidence when well-conducted.',
  },
  {
    name: 'Meta-Analysis',
    category: 'synthesis',
    description: 'A statistical technique that combines results from multiple studies to produce an overall estimate of effect size.',
    whenUsed: 'When there are enough similar quantitative studies to statistically combine their results.',
    evidenceStrength: 'Very High — provides the most precise estimate of effect when studies are combinable.',
  },
];

export const analyticStrategies = [
  {
    name: 'Manual Coding',
    description: 'Researchers read through data and assign codes (labels) to segments of text that represent meaningful concepts. This is the foundation of most qualitative analysis.',
    whenUsed: 'In qualitative studies when the researcher wants close engagement with the data.',
  },
  {
    name: 'Intercoder Reliability',
    description: 'A process where multiple coders independently code the same data, then compare their results to measure agreement. Enhances trustworthiness of qualitative findings.',
    whenUsed: 'When establishing reliability and reducing individual bias in qualitative coding.',
  },
  {
    name: 'CAQDAS',
    description: 'Computer-Assisted Qualitative Data Analysis Software (e.g., NVivo, Atlas.ti). Tools that help organize, code, and analyze qualitative data more efficiently.',
    whenUsed: 'When managing large qualitative datasets or when systematic organization of codes is needed.',
  },
  {
    name: 'Computational Bias Mitigation',
    description: 'Using algorithms or statistical techniques to identify and reduce bias in data analysis. Can include techniques for balancing datasets or adjusting for confounders.',
    whenUsed: 'When there are concerns about systematic bias in data collection or analysis.',
  },
  {
    name: 'Frequency Analysis',
    description: 'Counting the occurrence of specific codes, themes, or variables in the data. Can be used in both qualitative and quantitative analysis.',
    whenUsed: 'When identifying the most common patterns or when quantifying qualitative themes.',
  },
  {
    name: 'Algorithmic Triangulation',
    description: 'Using multiple computational methods or algorithms to analyze the same data, then comparing results to strengthen confidence in findings.',
    whenUsed: 'When seeking to validate computational analysis results through multiple approaches.',
  },
];

export const quizQuestions: QuizQuestion[] = [
  {
    id: 'q1',
    question: 'A researcher randomly assigns 200 patients to either receive a new drug or a placebo, then measures blood pressure after 12 weeks. What type of study design is this?',
    options: ['Cohort Study', 'Randomized Controlled Trial', 'Case-Control Study', 'Cross-Sectional Study'],
    correctAnswer: 1,
    explanation: 'This is a Randomized Controlled Trial (RCT) because participants are randomly assigned to treatment and control groups, and the outcome is measured prospectively.',
  },
  {
    id: 'q2',
    question: 'A researcher interviews 15 nurses about their lived experience of workplace burnout, seeking to understand the essence of that experience. What type of study design is this?',
    options: ['Grounded Theory', 'Ethnography', 'Phenomenology', 'Case Study'],
    correctAnswer: 2,
    explanation: 'This is Phenomenology because the goal is to understand the lived experience and essence of a specific phenomenon (workplace burnout) from the perspective of those who experience it.',
  },
  {
    id: 'q3',
    question: 'A study surveys 1,000 college students at one point in time to measure the prevalence of depression and its association with sleep habits. What type of study design is this?',
    options: ['Cohort Study', 'Descriptive Study', 'Cross-Sectional Study', 'Case-Control Study'],
    correctAnswer: 2,
    explanation: 'This is a Cross-Sectional Study because it measures exposure (sleep habits) and outcome (depression) at a single point in time in a defined population.',
  },
  {
    id: 'q4',
    question: 'When multiple researchers independently code the same qualitative data and compare their results, this process is called:',
    options: ['CAQDAS', 'Manual Coding', 'Algorithmic Triangulation', 'Intercoder Reliability'],
    correctAnswer: 3,
    explanation: 'Intercoder Reliability is the process where multiple coders independently analyze the same data and compare results to establish consistency and reduce individual bias.',
  },
  {
    id: 'q5',
    question: 'A comprehensive review that searches all available databases using predefined criteria to synthesize every relevant study on whether exercise reduces anxiety is called:',
    options: ['Meta-Analysis', 'Systematic Review', 'Cohort Study', 'Literature Review'],
    correctAnswer: 1,
    explanation: 'A Systematic Review uses a structured, comprehensive approach with predefined search and evaluation criteria to synthesize all available evidence on a specific question.',
  },
];
