"""Quick API smoke test."""
import json
from app import create_app
from models import db


def test_api():
    app = create_app()
    client = app.test_client()

    print("=== ScholarScaffold API Tests ===\n")

    # 1. Health check
    r = client.get('/api/health')
    assert r.status_code == 200
    print(f"✓ Health check: {r.get_json()['status']}")

    # 2. Login
    r = client.post('/api/auth/login', json={
        'email': 'test@university.edu',
        'password': 'password123',
    })
    assert r.status_code == 200
    data = r.get_json()
    assert data['success']
    token = data['token']
    user = data['user']
    print(f"✓ Login: {user['name']} ({user['email']})")
    headers = {'Authorization': f'Bearer {token}'}

    # 3. Get current user
    r = client.get('/api/auth/me', headers=headers)
    assert r.status_code == 200
    print(f"✓ Get me: {r.get_json()['user']['name']}")

    # 4. Save consent
    r = client.post('/api/auth/consent', headers=headers, json={'consent': True})
    assert r.status_code == 200
    print(f"✓ Save consent: {r.get_json()['consentFlag']}")

    # 5. Save search strategy
    r = client.post('/api/strategy', headers=headers, json={
        'topic': 'Mental health interventions',
        'population': 'College students',
        'keywords': ['mindfulness', 'anxiety', 'college students'],
        'selectedDatabases': ['PubMed', 'CINAHL'],
    })
    assert r.status_code == 200
    print(f"✓ Save strategy: {r.get_json()['strategy']['topic']}")

    # 6. Get strategy
    r = client.get('/api/strategy', headers=headers)
    assert r.status_code == 200
    print(f"✓ Get strategy: {r.get_json()['strategy']['topic']}")

    # 7. Mark strategy complete
    r = client.post('/api/strategy/complete', headers=headers)
    assert r.status_code == 200
    print(f"✓ Mark strategy complete")

    # 8. Save quiz result (pass)
    r = client.post('/api/literacy/quiz', headers=headers, json={
        'score': 80,
        'responses': {'q1': 1, 'q2': 2, 'q3': 0},
    })
    assert r.status_code == 200
    data = r.get_json()
    print(f"✓ Quiz result: score={data['score']}, passed={data['passed']}")

    # 9. Get literacy status
    r = client.get('/api/literacy/status', headers=headers)
    assert r.status_code == 200
    print(f"✓ Literacy status: complete={r.get_json()['complete']}")

    # 10. Create article
    r = client.post('/api/articles', headers=headers, json={
        'title': 'Test Article',
        'authors': 'Smith, J., & Doe, A.',
        'year': 2023,
        'journal': 'Test Journal',
        'doi': '10.1234/test',
        'abstract': 'This is a test abstract.',
    })
    assert r.status_code == 201
    article = r.get_json()['article']
    article_id = article['id']
    print(f"✓ Create article: {article['title']} (id: {article_id})")

    # 11. Get articles
    r = client.get('/api/articles', headers=headers)
    assert r.status_code == 200
    print(f"✓ Get articles: {len(r.get_json()['articles'])} found")

    # 12. Get single article
    r = client.get(f'/api/articles/{article_id}', headers=headers)
    assert r.status_code == 200
    print(f"✓ Get article by ID: {r.get_json()['article']['title']}")

    # 13. Save article review
    r = client.post(f'/api/articles/{article_id}/review', headers=headers, json={
        'researchQuestion': 'What is the effect of X on Y?',
        'studyDesign': 'Randomized Controlled Trial',
        'sample': '120 undergraduate students',
        'keyFindings': 'Significant reduction found.',
        'significance': 'Adds to the evidence base.',
        'designStrengthRating': 4,
        'internalValidityIssues': 'Self-reported measures.',
        'externalValidityIssues': 'Single university.',
        'limitations': ['Small sample', 'Self-reported', 'Short follow-up'],
        'applicabilityToScope': 'Directly relevant.',
        'relevanceScore': 5,
        'evidenceStrengthScore': 4,
        'argumentContributionScore': 5,
        'whyIncludeExclude': 'Strong design and relevant topic.',
        'biggestLimitation': 'Short follow-up period.',
        'intendedUse': 'Primary evidence source.',
        'inclusionDecision': 'include',
    })
    assert r.status_code == 200
    print(f"✓ Save review: decision={r.get_json()['review']['inclusionDecision']}")

    # 14. Get review progress
    r = client.get('/api/articles/progress', headers=headers)
    assert r.status_code == 200
    progress = r.get_json()['progress']
    print(f"✓ Progress: {progress['total']} total, {progress['included']} included, {progress['excluded']} excluded")

    # 15. Get bibliography
    r = client.get('/api/bibliography', headers=headers)
    assert r.status_code == 200
    print(f"✓ Bibliography: {len(r.get_json()['bibliography'])} entries")

    # 16. Update annotation
    r = client.put(f'/api/bibliography/{article_id}/annotation', headers=headers, json={
        'summary': 'Test summary paragraph.',
        'evaluation': 'Test evaluation paragraph.',
        'relevance': 'Test relevance paragraph.',
    })
    assert r.status_code == 200
    print(f"✓ Update annotation: saved")

    # 17. Proposal status (should be locked - only 1 review)
    r = client.get('/api/proposal/status', headers=headers)
    assert r.status_code == 200
    status = r.get_json()
    print(f"✓ Proposal status: unlocked={status['unlocked']}, progress={status['progress']}")

    # 18. IRB logging
    r = client.post('/api/irb/log', headers=headers, json={
        'eventType': 'article_review_submitted',
        'payload': {'articleId': article_id, 'decision': 'include'},
    })
    assert r.status_code == 200
    print(f"✓ IRB log: logged={r.get_json()['logged']}")

    # 19. Get IRB logs
    r = client.get('/api/irb/logs', headers=headers)
    assert r.status_code == 200
    print(f"✓ IRB logs: {len(r.get_json()['logs'])} entries")

    print("\n=== All 19 tests passed! ===")


if __name__ == '__main__':
    test_api()
