# Scoring Engine

MBA Decision OS uses transparent weighted scoring with editable admin weights.

## Score Families

### Profile Strength Score

Built from:

- academic consistency
- entrance exam performance
- work experience
- achievements and leadership
- goal clarity
- budget realism

### Admission Readiness Score

Built from:

- profile strength
- exam fit against college acceptance profiles
- selectivity adjustment

### College Match Score

Built from:

- specialization fit
- budget fit
- location fit
- placement quality
- sector fit
- risk alignment

### ROI Score

Built from:

- average salary
- median salary
- total investment
- payback period
- placement rate
- funding-mode adjustments

### Placement Strength Score

Built from:

- placement rate
- salary quality
- international placement contribution

### Career Alignment Score

Built from:

- preferred sector overlap
- target role fit
- recruiter depth

### Risk Compatibility Score

Built from:

- user risk appetite
- college risk level

### Final Recommendation Score

Built from:

- profile fit
- admission probability
- ROI
- placement strength
- career alignment
- risk compatibility
- budget fit
- location fit

## Explainability Text

Every recommendation includes plain-English rationale, for example:

- your profile aligns well with the program’s intake
- the investment fits your budget band
- payback is fast enough for your risk profile
- location and sector exposure match your preferences

## Admin Weight Tuning

Weights are stored in `ScoringWeight`.

Admin users can update them at runtime from `Admin > Scoring`.

## Recommended Practice

- Keep weights within the `0` to `1` band.
- Review changes by group rather than changing isolated values blindly.
- Re-test recommendations after each scoring update.
