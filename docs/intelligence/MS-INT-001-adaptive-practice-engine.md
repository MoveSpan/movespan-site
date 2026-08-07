---
Doc ID: MS-INT-001
Title: MoveSpan Adaptive Practice Engine
Status: Draft
Version: 0.1
Date: August 2026
---

# MS-INT-001 — MoveSpan Adaptive Practice Engine

## 1. Purpose

The MoveSpan Adaptive Practice Engine determines:

- what a person needs now,
- what they need to develop over time,
- how much practice is appropriate today,
- which exercises are suitable,
- how exercises should be sequenced,
- how the system should adapt from feedback and practice history.

The engine has two primary outputs:

### Reset
**Reset improves how you feel now.**

Short state-regulation practices designed to improve the person’s current physical, mental, emotional, breathing, or energy state.

Typical duration:
- 3–10 minutes

### Today’s Practice
**Today’s Practice builds strength, resilience, coordination and energy over time.**

Regular adaptive practice designed to create gradual functional change.

Typical duration:
- 10–60 minutes

---

# 2. Core Architecture

The engine contains two linked decision systems.

## 2.1 State Regulation Engine

Purpose:
Improve the person’s current state.

Primary inputs:
- mood
- mental overload
- current tension
- breathing state
- current energy
- current stiffness
- acute fatigue
- subjective stress

Primary output:
- Reset prescription

Examples:
- Break Reset
- Breath Reset
- Walking Reset
- Tree Pose Reset
- Body Release Reset
- Voice & Sound Reset

---

## 2.2 Long-Term Adaptation Engine

Purpose:
Gradually improve functional capacity and resilience.

Primary inputs:
- onboarding profile
- chronic pain profile
- assessments
- Functional Age
- breath pattern
- practice history
- movement limitations
- personal response history
- current readiness

Primary output:
- Today’s Practice

Today’s Practice may contain exercises from multiple MoveSpan practice libraries.

---

# 3. Input Layers

## 3.1 Baseline Profile

Collected primarily during onboarding.

Fields include:
- age
- sex
- goals
- body zones
- experience
- preferred practices
- preferred practice duration
- available time
- obstacles to regular practice
- known limitations

---

## 3.2 Chronic Pain Profile

Chronic or recurring pain must be treated as a persistent profile object and must not be represented only as a body-zone preference.

Suggested fields:

- chronic_pain_present
- pain_zones[]
- usual_pain_intensity_0_10
- duration_of_problem
- constant_or_intermittent
- known_triggers[]
- known_relief_factors[]
- notes

Chronic Pain Profile represents the person’s typical background condition.

It is separate from current pain today.

---

## 3.3 Functional Assessment Layer

Possible signals:

- Functional Age
- balance
- mobility
- strength
- sitting-rising ability
- cardiovascular response
- recovery after load
- future body assessments

The assessment layer answers:

**What can the body currently do?**

---

## 3.4 Breath Pattern Layer

Breathing is treated as a functional pattern, not only as a separate Breathwork practice category.

Possible signals:

- respiratory rate
- chest-dominant breathing
- diaphragm-dominant breathing
- lower-rib expansion
- ability to breathe slowly
- relaxed exhalation capacity
- breath coordination with movement
- breath-hold tolerance where appropriate
- breathing discomfort
- subjective breath restriction

Possible associated priorities:

- diaphragm mobility
- thoracic mobility
- thoracolumbar mobility
- lumbar relaxation
- pelvic mobility
- hip mobility
- hip flexor / psoas-related work
- walking mechanics
- nervous-system regulation
- slow rotational movement

These relationships are methodology-informed associations and should not automatically be presented to users as universal medical causation.

---

## 3.5 Daily Body State

A short current-state check should be available before Today’s Practice.

Suggested question:

**How does your body feel today?**

Options:
- Comfortable
- A little stiff
- Some pain
- More pain than usual

If pain is present:

- pain zone
- pain intensity 0–10

This is separate from Chronic Pain Profile.

---

## 3.6 Daily Mental / Emotional State

Current Home emotional check-in:

- Bad
- Not great
- Steady
- Good
- Amazing

This signal primarily influences State Regulation / Reset recommendations.

---

## 3.7 Energy State

Energy should be collected on a subjective 0–10 scale.

User-facing:
- 0–10

Initial internal interpretation:
- 0–3: Low
- 4–6: Moderate
- 7–8: Good
- 9–10: High

These thresholds may later be personalized relative to the person’s own baseline.

---

## 3.8 Tracker Layer

When available:

- sleep
- resting heart rate
- resting heart rate deviation from personal baseline
- HRV trend
- respiratory rate
- activity / load
- steps
- recovery trends
- SpO₂ trend where device data is available

Tracker values should be interpreted primarily relative to the person’s own baseline and trends.

### SpO₂ Safety Rule

Unexpected or unusually low SpO₂ should be treated primarily as a safety signal, not as an automatic trigger for breath-hold practice.

Breathing practices should target breathing function, regulation, tolerance, and coordination rather than attempt to directly “treat low oxygen saturation”.

---

## 3.9 Practice History

The engine should learn from:

- practice frequency
- practice duration
- completion rate
- skipped exercises
- repeated exercises
- replay events
- chosen modifications
- support usage
- exercise duration
- pain events
- difficulty feedback
- post-practice state
- long-term adherence

---

# 4. Needs Engine

Needs are divided into two different categories.

## 4.1 Immediate Needs

Immediate Needs describe what should improve now.

Examples:
- anxiety
- mental overload
- low mood
- agitation
- fatigue
- stiffness
- shallow breathing
- difficulty focusing
- low subjective energy

Output:
- Reset Prescription

---

## 4.2 Deep Needs

Deep Needs describe what should gradually improve through regular practice.

Examples:
- mobility
- balance
- coordination
- strength
- connective-tissue capacity
- breathing function
- foot function
- hip mobility
- spinal mobility
- shoulder mobility
- walking mechanics
- ability to relax
- body awareness
- nervous-system resilience

Output:
- Today’s Practice Prescription

---

# 5. Safety Filter

Safety filtering occurs before exercise selection.

The engine may:

- exclude an exercise
- regress an exercise
- substitute an exercise
- reduce range
- reduce duration
- reduce repetitions
- introduce support
- change position
- change breathing strategy

Potential signals include:

- acute pain
- increased chronic pain
- knee pain
- lumbar pain
- shoulder pain
- thoracic or cervical pain
- inadequate mobility
- inadequate stability
- high fall risk
- exercise contraindication
- unsuitable complexity
- missing required equipment

Core principles:

**Do no harm.**

**Practice is not abandoned; the form of practice is changed whenever a safe alternative exists.**

---

# 6. Readiness / Dose Engine

Readiness does not determine what the person fundamentally needs.

Readiness determines:

**How much and how hard should the person practice today?**

Needs = WHAT.

Readiness = HOW MUCH / HOW HARD TODAY.

Three initial dose modes:

## Gentle
Possible signals:
- low energy
- poor sleep
- increased pain
- reduced recovery
- high stiffness
- nervous-system overload

## Normal
Possible signals:
- typical energy
- stable recovery
- no meaningful increase in pain

## Progressive
Possible signals:
- good recovery
- high energy
- no significant pain
- recent sessions tolerated well

Readiness may change:
- duration
- repetitions
- static hold duration
- exercise complexity
- balance demand
- strength demand
- recovery intervals
- number of exercises

---

# 7. Practice Capacity

Practice Capacity estimates how much quality practice the person can realistically perform.

Inputs may include:
- preferred duration
- available time today
- actual historical duration
- completion behavior
- frequency of early exits
- use of Continue
- difficulty feedback
- readiness

Practice Capacity is adaptive.

Example:
A person who repeatedly completes only 18–20 minutes of a prescribed 30-minute session should not continuously receive unrealistic 30-minute prescriptions.

Practice Capacity is not increased indefinitely.

It is constrained by:
- safety
- methodology
- readiness
- previous confirmed adaptation

---

# 8. Session Goal

Each Today’s Practice should have one primary session goal.

Example:

**Restore hip and spinal mobility while maintaining balance and lower-body strength.**

A shorter version may be shown as the user-facing Practice Focus.

---

# 9. Session Mode

Primary modes:

- Restore
- Reset
- Expand

A session may have:
- one primary mode
- optional secondary mode

---

# 10. Session Structure

General session architecture:

1. Arrival
2. Preparation
3. Mobilize
4. Activate
5. Main Challenge
6. Compensation
7. Integrate
8. Downshift
9. Body Scan / Relaxation

Not every stage is mandatory in every practice.

---

# 11. Climate Rules

## Cold Climate

- longer warm-up
- more dynamic movement early
- avoid demanding static work before adequate preparation

## Warm / Hot Climate

- shorter warm-up may be sufficient
- slow and static movement may be introduced earlier

## Joint Recovery

Joint Recovery is considered broadly climate-neutral and may be used as preparation in most environments.

---

# 12. Start From the Feet

General preparation priority:

**Feet → Hips → Shoulders**

Joint Recovery sequence:

**Feet → Pelvis → Thorax → Shoulders → Neck**

Core MoveSpan principle:

**Health begins from the feet.**

---

# 13. Compensation Rules

The engine should consider compensatory movement and antagonist relationships.

Examples:

- strong stretch → activation / stabilization
- posterior-line emphasis → anterior-line balance
- hip opening → stabilization / single-leg work
- strong backbend → compensation
- high muscular effort → subsequent lengthening or breathing recovery

---

# 14. Breath Rules

Breath is a primary regulatory tool.

Rules:

- controlled breathing is the first regression strategy
- range or complexity should decrease if breathing becomes uncontrolled
- breathing should coordinate with movement when appropriate
- recovery of breathing should follow demanding blocks
- meditation after intense work should begin after breathing has stabilized

---

# 15. Runtime Adaptation

The session may branch after preparation.

Possible prompt:

**How do you feel now?**

Options:
- Ready for more
- Keep it gentle

### Ready for more
Continue with planned challenge.

### Keep it gentle
Switch to lower-load branch.

The session should therefore support:

**Session Skeleton + Adaptive Branches**

---

# 16. Exercise Selection Model

Exercise selection may use:

- practice
- mode
- body zones
- goal
- level
- movement type
- movement pattern
- primary joints
- position
- equipment
- contraindications
- precautions
- modifications
- pain safety
- preparation requirements
- compensation requirements
- exercise relationships

Additional machine-scoring fields:

- mobility_load: 0–3
- strength_load: 0–3
- balance_load: 0–3
- coordination_load: 0–3
- cardio_load: 0–3
- nervous_system_load: 0–3
- recovery_cost: 0–3

---

# 17. Exercise Player Telemetry

Each exercise may generate:

- session_id
- exercise_id
- started_at
- completed_at
- prescribed_duration
- actual_duration
- prescribed_reps
- selected_variant
- support_used
- replay_count
- previous_count
- skipped
- completed

---

# 18. Exercise Feedback

Do not ask for feedback after every exercise by default.

Use event-triggered feedback.

Possible question:

**How was that?**

- Easy
- Good
- Hard
- Pain

If Pain:
- body zone
- intensity 0–10

If repeated difficulty signals are detected:

**What made this difficult?**

- Balance
- Strength
- Mobility
- Pain
- Instructions

Possible trigger signals:
- repeated replay
- skip
- repeated Previous
- unusually long completion time
- modification usage

---

# 19. Post-Practice Reflection

After each practice:

### How do you feel now?
- Worse
- Same
- Better
- Much better

### How was the practice?
- Too easy
- Right
- Too hard

### Any pain?
- No
- Yes

The interaction should require only a few seconds.

---

# 20. Deep Reflection

Periodic deeper reflection may include:

- Easier movement
- Better balance
- Less stiffness
- Better breathing
- More energy
- More relaxed
- Nothing noticeable

Optional:
**Anything you noticed?**

Text or voice response.

---

# 21. Personal Response Model

MoveSpan should gradually learn the person’s individual response patterns.

Possible learned variables:

- exercise_response_score
- practice_response_score
- preferred_duration
- effective_duration
- pain_response
- mood_response
- energy_response
- completion_probability
- difficulty_tolerance
- recovery_response

The goal is to learn:

**What works best for this person?**

---

# 22. Adaptation Limits

Personalization must have limits.

## Safety Ceiling

The engine must not exceed limits defined by pain, contraindications, stability, or risk.

## Methodology Ceiling

The engine must not violate MoveSpan methodology:
- gradual progression
- preparation
- compensation
- controlled breathing
- appropriate sequencing

## Adaptation Ceiling

Load progression must remain within reasonable bounds relative to the person’s confirmed prior capacity.

---

# 23. Learning Loop

The engine continuously learns from:

- baseline
- assessments
- breath pattern
- daily state
- tracker data
- practice behavior
- exercise feedback
- post-practice reflection

Core loop:

**Understand → Assess → Check State → Prescribe → Practice → Reflect → Adapt**

---

# 24. User Communication Principle

MoveSpan should make personalization understandable.

Key messages:

**Reset improves how you feel now.**

**Today’s Practice builds strength, resilience, coordination and energy over time.**

**The more you practice and give feedback, the better MoveSpan understands what works for your body.**

**Every practice teaches the system something about you.**

The system should communicate that personalization improves through consistent interaction, but progress still requires regular practice and effort.

---

# 25. Core Philosophy of Personalization

There is no single perfect exercise for everyone.

The engine should not search for a universal “magic exercise”.

Its purpose is to identify the most appropriate combination of:

- practice type
- exercise
- sequence
- dose
- difficulty
- recovery
- feedback

for a specific person at a specific time while maintaining a long-term direction of development.

---

# 26. Relationship to MoveSpan Practice Libraries

Today’s Practice may combine exercises from:

- Joint Recovery
- Body Release
- Neuro Gym
- Tai Chi & Flow
- Walking Therapy
- Breathwork & Meditation
- Strong Body Yoga
- AquaBreath
- Voice & Sound

Practice libraries are method libraries.

Today’s Practice is the adaptive prescription assembled from those libraries.

---

# 27. Future Development

Future versions may incorporate:

- gait analysis
- posture analysis
- camera-based movement quality
- wearable-derived trends
- long-term response correlations
- contextual signals
- environment
- climate
- time of day
- long-term Functional Age trajectories
- population-level anonymized pattern discovery

Any new intelligence must remain subordinate to:
- Safety Filter
- MoveSpan methodology
- approved Exercise Passports
- adaptation limits

