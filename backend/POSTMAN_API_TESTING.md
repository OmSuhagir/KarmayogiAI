# Karmayogi AI Backend - Postman API Testing

## 1. Start the Backend

Open a terminal:

```powershell
cd "D:\SIH 26\Competency (101)\Prototype\Competency_Intelligence_Platform\backend"
npm run seed
npm start
```

The API should run at:

```text
http://localhost:5000
```

Keep the backend terminal running while testing.

## 2. Create a Postman Environment

Create an environment named `Karmayogi Local` with these variables:

| Variable | Initial value |
|---|---|
| `baseUrl` | `http://localhost:5000` |
| `userId` | Rahul Sharma `_id` |
| `assessmentId` | Assessment `_id` |
| `attemptId` | empty |
| `questionId` | empty |
| `gapId` | empty |
| `recommendationId` | empty |
| `resourceId` | empty |
| `progressId` | empty |
| `documentId` | empty |
| `generatedQuestionId` | empty |
| `competencyId` | Competency `_id` |

Get the IDs from MongoDB Compass after running `npm run seed`.

Rahul Sharma has email:

```text
rahul@example.com
```

The seeded assessment title is:

```text
Statistical Officer Competency Assessment
```

The seeded role is:

```text
Statistical Analysis and Reporting
```

> Current backend note: JWT authentication and admin authorization are not yet implemented. Requests currently do not need a Bearer token.

## 3. Common Postman Settings

For JSON requests:

- Method: select the method shown below.
- URL: paste the URL shown below.
- Headers: add `Content-Type: application/json`.
- Body: select `raw` and `JSON`.

## 4. Health

### Health Check

```text
GET {{baseUrl}}/api/health
```

Expected response:

```json
{
  "status": "OK",
  "database": "connected"
}
```

## 5. User APIs

### Get User

```text
GET {{baseUrl}}/api/users/{{userId}}
```

Verify that the response includes populated `departmentId`, `positionId`, `roleId`, and `competencyProfile.competencyId`.

Verify that `password` is not present.

### Get User Competencies

```text
GET {{baseUrl}}/api/users/{{userId}}/competencies
```

### Get User Skill Gaps

```text
GET {{baseUrl}}/api/users/{{userId}}/skill-gaps
```

### Get User Recommendations

```text
GET {{baseUrl}}/api/users/{{userId}}/recommendations
```

### Get User Learning Progress

```text
GET {{baseUrl}}/api/users/{{userId}}/learning-progress
```

## 6. Assessment APIs

### List Active Assessments

```text
GET {{baseUrl}}/api/assessments
```

Copy the returned assessment `_id` into the `assessmentId` environment variable.

### Get Assessment

```text
GET {{baseUrl}}/api/assessments/{{assessmentId}}
```

### Get Assessment Questions

```text
GET {{baseUrl}}/api/assessments/{{assessmentId}}/questions
```

Verify that `correctAnswer` is not returned.

### Start Assessment

```text
POST {{baseUrl}}/api/assessments/{{assessmentId}}/start
```

Body:

```json
{
  "userId": "{{userId}}"
}
```

Expected response contains:

```json
{
  "success": true,
  "data": {
    "attemptId": "...",
    "questions": []
  }
}
```

Save `data.attemptId` as `attemptId`.

Use only the questions returned by this request for submission. Do not use the separately randomized `/questions` response.

Verify every returned question does not contain `correctAnswer`.

### Submit Assessment

Replace `QUESTION_ID_1`, etc. with IDs from the start response.

```text
POST {{baseUrl}}/api/assessments/{{assessmentId}}/submit
```

Body:

```json
{
  "attemptId": "{{attemptId}}",
  "userId": "{{userId}}",
  "answers": [
    {
      "questionId": "QUESTION_ID_1",
      "selectedAnswer": "A"
    },
    {
      "questionId": "QUESTION_ID_2",
      "selectedAnswer": "B"
    },
    {
      "questionId": "QUESTION_ID_3",
      "selectedAnswer": "A"
    },
    {
      "questionId": "QUESTION_ID_4",
      "selectedAnswer": "C"
    },
    {
      "questionId": "QUESTION_ID_5",
      "selectedAnswer": "A"
    },
    {
      "questionId": "QUESTION_ID_6",
      "selectedAnswer": "B"
    }
  ]
}
```

The exact number of answers must match the questions returned by `/start`.

Expected response contains:

- `overallScore`
- `competencies`
- `attemptId`

### Duplicate Submission Test

Send the same submit request again.

Expected HTTP status: `400`

Expected message:

```text
Attempt already submitted or not in started state
```

### Invalid Question Assignment Test

Start a new assessment and submit a question ID that was not returned by that attempt.

Expected HTTP status: `400`

Expected response:

```json
{
  "success": false,
  "message": "Question was not assigned to this assessment attempt"
}
```

## 7. Competency History APIs

### Get Complete History

```text
GET {{baseUrl}}/api/competency-history/{{userId}}
```

### Filter History by Competency

```text
GET {{baseUrl}}/api/competency-history/{{userId}}?competencyId={{competencyId}}
```

After assessment submission, verify a history record exists with `level`, `score`, `source`, and `recordedAt`.

After another assessment, verify a new record is added. Existing history must remain.

## 8. Skill Gap APIs

### Get User Skill Gaps

```text
GET {{baseUrl}}/api/skill-gaps/user/{{userId}}
```

Copy a returned gap `_id` into `gapId`.

### Get One Skill Gap

```text
GET {{baseUrl}}/api/skill-gaps/{{gapId}}
```

Verify the gap follows:

```text
gap = expectedLevel - assessedLevel
```

### Update Skill Gap Status

```text
PATCH {{baseUrl}}/api/skill-gaps/{{gapId}}/status
```

Body:

```json
{
  "status": "in_progress"
}
```

Allowed values:

```text
open
in_progress
resolved
```

Do not manually set a gap to `resolved` for the normal learning-loop test. Reassessment should resolve a gap when the expected level is reached.

## 9. Recommendation APIs

### Generate Recommendations

```text
POST {{baseUrl}}/api/recommendations/generate/{{userId}}
```

This uses the user's open skill gaps and matching active learning resources.

### Get Recommendations

```text
GET {{baseUrl}}/api/recommendations/user/{{userId}}
```

Copy the recommendation document `_id` into `recommendationId`.

Copy one recommendation item's `resource._id` into `resourceId`.

Verify each recommendation contains:

- `score`
- `rank`
- `reason`

### Select Recommendation

```text
POST {{baseUrl}}/api/recommendations/{{recommendationId}}/select
```

Body:

```json
{
  "userId": "{{userId}}",
  "resourceId": "{{resourceId}}"
}
```

Expected result is a LearningProgress record with:

```json
{
  "progress": 0,
  "status": "in_progress"
}
```

Copy `data._id` into `progressId`.

## 10. Learning Progress APIs

### Start Learning Directly

```text
POST {{baseUrl}}/api/learning-progress
```

Body:

```json
{
  "userId": "{{userId}}",
  "resourceId": "{{resourceId}}"
}
```

Calling the same request twice must return the same record, not create a duplicate.

### Update Progress to 50

```text
PATCH {{baseUrl}}/api/learning-progress/{{progressId}}
```

Body:

```json
{
  "userId": "{{userId}}",
  "progress": 50
}
```

Expected status:

```text
in_progress
```

### Complete Learning

```text
PATCH {{baseUrl}}/api/learning-progress/{{progressId}}
```

Body:

```json
{
  "userId": "{{userId}}",
  "progress": 100
}
```

Expected:

```json
{
  "progress": 100,
  "status": "completed",
  "completedAt": "..."
}
```

### Invalid Progress Test

```text
PATCH {{baseUrl}}/api/learning-progress/{{progressId}}
```

Body:

```json
{
  "userId": "{{userId}}",
  "progress": 101
}
```

Expected HTTP status: `400`

Expected response:

```json
{
  "success": false,
  "message": "Progress must be between 0 and 100"
}
```

### Unauthorized User ID Test

Use a different valid user's ID in the body.

Expected HTTP status: `400`

Expected message:

```text
User not authorized to modify this record
```

## 11. Document APIs

### Create Document

```text
POST {{baseUrl}}/api/documents
```

Body:

```json
{
  "uploadedBy": "{{userId}}",
  "fileName": "statistics-guide.txt",
  "fileType": "text/plain",
  "storageUrl": "https://example.com/statistics-guide.txt",
  "extractedText": "Statistical analysis uses methods to collect, analyze, and interpret data.",
  "competencyIds": ["{{competencyId}}"]
}
```

Copy the returned document `_id` into `documentId`.

### Get Document

```text
GET {{baseUrl}}/api/documents/{{documentId}}
```

### Get Documents by User

```text
GET {{baseUrl}}/api/documents/user/{{userId}}
```

## 12. Generated Question APIs

Gemini generation requires a working `GEMINI_API_KEY` and available quota.

### Generate Questions from Document

```text
POST {{baseUrl}}/api/generated-questions/generate
```

Body:

```json
{
  "documentId": "{{documentId}}",
  "numQuestions": 1,
  "competencyId": "{{competencyId}}",
  "difficulty": 2
}
```

Expected behavior:

- Reads `Document.extractedText`.
- Validates question text.
- Requires exactly four options with IDs A, B, C, and D.
- Validates `correctAnswer`.
- Validates difficulty from 1 to 5.
- Validates the competency exists.
- Saves results as `GeneratedQuestion` with `validation.status = "pending"`.
- Does not automatically create a `Question`.

Copy the returned `_id` into `generatedQuestionId`.

### List Generated Questions

```text
GET {{baseUrl}}/api/generated-questions
```

### Get Generated Question

```text
GET {{baseUrl}}/api/generated-questions/{{generatedQuestionId}}
```

### Approve Generated Question

```text
PATCH {{baseUrl}}/api/generated-questions/{{generatedQuestionId}}/review
```

Body:

```json
{
  "status": "approved",
  "reviewedBy": "{{userId}}"
}
```

A valid generated question is copied into the `Question` collection only after approval.

### Reject Generated Question

```text
PATCH {{baseUrl}}/api/generated-questions/{{generatedQuestionId}}/review
```

Body:

```json
{
  "status": "rejected",
  "reviewedBy": "{{userId}}"
}
```

## 13. Admin APIs

> These routes currently have no admin authentication middleware. Test them only with local development data.

### Dashboard

```text
GET {{baseUrl}}/api/admin/dashboard
```

### Employee Competencies

```text
GET {{baseUrl}}/api/admin/employees/{{userId}}/competencies
```

### Skill Gap Analytics

```text
GET {{baseUrl}}/api/admin/skill-gaps
```

### Assessment Statistics

```text
GET {{baseUrl}}/api/admin/assessments/{{assessmentId}}/statistics
```

## 14. Complete Test Order

Run the requests in this order:

1. Health check.
2. Get Rahul's user record.
3. List active assessments.
4. Start an assessment.
5. Submit the exact questions returned by start.
6. Submit again and verify HTTP 400.
7. Check competency history.
8. Check skill gaps.
9. Generate and retrieve recommendations.
10. Select a recommendation.
11. Update learning progress to 50.
12. Update learning progress to 100.
13. Start a second assessment.
14. Submit the reassessment.
15. Verify a new history record was added.
16. Verify a gap resolves only when assessed level reaches expected level.
17. Create a document with `extractedText`.
18. Generate AI questions.
19. Approve a valid generated question.
20. Verify the approved question exists in the Question collection.

## 15. Existing Automated Smoke Test

The backend also includes a MongoDB-backed smoke test:

```powershell
cd "D:\SIH 26\Competency (101)\Prototype\Competency_Intelligence_Platform\backend"
node scripts/integrationTest.js
```

This verifies health, assessment start, fixed assigned questions, submission, user retrieval, skill gaps, recommendations, and absence of `correctAnswer` in the start response.

## 16. Useful Negative Tests

### Missing Document Text

Create a document with:

```json
{
  "uploadedBy": "{{userId}}",
  "fileName": "empty.txt",
  "fileType": "text/plain",
  "extractedText": ""
}
```

Then try generation. Expected error:

```text
Document has no extracted text to generate questions from
```

### Invalid Generated Question

If testing the validator directly, invalid cases include:

- Empty `question`.
- Three options.
- Five options.
- Duplicate option IDs.
- Missing A, B, C, or D.
- `correctAnswer` equal to `E`.
- Difficulty equal to `0` or `6`.
- Nonexistent `competencyId`.

Invalid generated questions must not be approved into the Question collection.
