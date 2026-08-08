# MoveSpan Global Design System

Status: CANONICAL
Scope: ALL MoveSpan product screens
Primary rule: REUSE BEFORE CREATE

## 1. One Product, One Design System

MoveSpan uses one global design system across the entire product.

Applies to:
- Home
- Onboarding
- Profile
- Settings
- Health
- Health Snapshot
- Assessments
- Functional Age
- Body Assessments
- Journal
- Reset Break
- Practice Player
- Exercise and Lesson Libraries
- Account, Subscription, Rewards, Referrals and Family Plan
- all future MoveSpan screens

Functional Age is NOT a separate design system.

Feature-specific screens may introduce new functional controls only when necessary.
They must not redefine existing MoveSpan typography, buttons, headers, navigation, cards, inputs or page geometry.

## 2. Reuse Before Create

Required implementation order:

REUSE -> EXTEND -> CREATE

Never:

CREATE -> PATCH -> OVERRIDE

Before creating a component, check whether an approved MoveSpan equivalent already exists.

## 3. Brand

Canonical MoveSpan green:
#2D7D52

Primary app background:
#F6F7F8

Wide-screen surrounding background:
#EEF1EF

Surface:
#FFFFFF

Primary text:
#1D1F1E

Secondary text:
#667085

Supporting text:
#475467

Standard border:
#E0E5E2

## 4. Mobile Shell

Canonical app width:
max-width: 430px

Horizontal padding:
16px

Mobile is the reference product geometry.

On larger screens center the shell.
Do not enlarge or stretch product screens simply because more viewport width is available.

## 5. Page Header

All equivalent MoveSpan screens use the same page-header geometry.

Structure:
- 44px Back area
- centered page title
- 44px balancing spacer

Header title:
- 16 to 17px
- bold
- centered
- dark text

Feature names may change.
Header geometry must not.

## 6. Back Navigation

Canonical Back icon:
- 24 x 24 SVG
- path M15 18l-6-6 6-6
- stroke width 2.2
- MoveSpan green
- round linecap
- round linejoin
- no fill

Hit area:
44 x 44

No:
- circle
- visible container
- border
- background
- shadow
- blue tap highlight

See:
docs/ui-standards/back-navigation.md

## 7. Eyebrow / Step Label

Canonical style:
- 12px
- weight 700
- uppercase
- MoveSpan green
- letter spacing approximately .06em

Examples:
FUNCTIONAL AGE PROFILE
ADDITIONAL MEASUREMENT · 2 OF 4
BODY ASSESSMENT

## 8. H1

MoveSpan has one product H1 family.

Canonical mobile geometry:
- approximately 28 to 30px
- line-height approximately 1.1 to 1.16
- bold
- dark
- left aligned
- consistent letter spacing

Equivalent screens in the same flow must use exactly the same H1 geometry.

No feature-specific H1 scale.

## 9. Supporting Copy

Subtitle:
- 15px
- line-height approximately 1.55
- secondary text
- left aligned

Instructional text:
- normally 14px
- line-height approximately 1.5 to 1.55

## 10. Primary Button

Canonical geometry:
- width 100%
- min-height 52px
- padding 10px 12px
- border 0
- radius 13px
- background #2D7D52
- white text
- font-size 14px
- line-height 1.4
- weight 700
- centered

Disabled:
- border #BFDCCB
- background #E6F2EB
- text #5F8E72
- no shadow

Existing canonical implementation:
.fa-primary-button

The component should be reused rather than recreated locally.

## 11. Secondary Button

Canonical geometry:
- width 100%
- min-height 52px
- radius 13px
- white background
- standard border
- MoveSpan green text
- 14px
- weight 700

## 12. Timer Buttons

Timer controls intentionally use terracotta instead of MoveSpan green.

Canonical timer color:
#B46F43

Used for:
- Start Timer
- Stop
- Continue Timer
- Start Breath Hold
- Start 60-second timer
- Start 5-minute rest
- equivalent active timing actions

IMPORTANT:
Timer buttons use the SAME canonical button dimensions as other MoveSpan buttons.

Only functional color changes.

Secondary timer:
- background #F4E7DD
- text #B46F43
- border #D8B7A0

Do not create oversized timer buttons.

## 13. Save Directly in the Button

Canonical save interaction:

Save Result
-> 
Saved ✓

After successful save:
- the same button changes to Saved ✓
- it becomes disabled
- the next action becomes enabled

Do NOT display redundant confirmation copy such as:
Result saved
Saved successfully
Result has been saved

The confirmation belongs directly in the button whenever practical.

This is a global MoveSpan interaction rule.

The same pattern applies to other actions when appropriate:

Record Resting Pulse
->
Resting Pulse Recorded ✓

## 14. Cards

Standard cards:
- white surface
- radius approximately 13 to 16px
- subtle border
- minimal shadow
- clear information hierarchy

Approved instruction card:
- background #E6F2EB
- border #BFDCCB
- radius 16px
- high-contrast text

## 15. Inputs

Inputs use the same visual family as cards and buttons:
- width 100%
- touch-friendly height
- approximately 13px radius
- standard border
- white background
- dark readable text
- green focus state

No feature-specific input design without a documented reason.

## 16. Progress

Progress track:
neutral light gray / green-gray

Progress fill:
#2D7D52

Equivalent flows use the same thickness and radius.

## 17. Functional Age

Functional Age uses the GLOBAL MoveSpan system.

It is not allowed to create a separate Functional Age design language.

Core:
1. Breathing Rate
2. Resting Heart Rate
3. Forward Flexibility
4. Balance
5. Shoulder Mobility
6. Sitting-Rising Test

Additional:
7. Breath Hold — After Inhale
8. Orthostatic Response
9. Squat + Heart Rate Recovery
10. Push-up Test

All ten measurements must look and behave as parts of one product flow.

Functional Age header:
Functional Age Test

Measurement identity belongs in the screen content.

## 18. Functional Age Result Actions

Canonical stack:

Save Result
Next Measurement →
Back to Functional Age Profile

After save:

Saved ✓
Next Measurement → enabled
Back to Functional Age Profile enabled

No measurement may invent a different result action layout.

## 19. Specialized Measurement Controls

Timers, pulse fields, counters and other measurement-specific controls may be specialized.

They must NOT redefine:
- page shell
- Back
- header
- H1
- standard button geometry
- cards
- navigation
- typography scale
- result actions

## 20. Status Palette

Excellent:
foreground #2D7D52
background #E7F3EC

Good:
foreground #347A8A
background #E8F2F4

Fair:
foreground #A87922
background #FBF3DF

Needs attention:
foreground #B76638
background #FBEDE5

Not measured:
foreground #7A817D
background #F1F3F2

## 21. 45+ Accessibility

MoveSpan prioritizes:
- readable typography
- strong contrast
- large touch targets
- clear selected states
- clear disabled states
- simple hierarchy
- obvious primary action
- no tiny critical controls
- no unnecessary visual noise

## 22. Interaction Consistency

Same action = same visual language.

Primary continuation = green.
Timer action = terracotta.
Secondary navigation = white outlined.
Save confirmation = inside the initiating button.
Back = canonical MoveSpan Back.
Disabled = canonical disabled treatment.
Selected = canonical green selected treatment.

## 23. Source of Truth

Priority:

1. docs/ui-standards/movespan-design-system.md
2. canonical shared MoveSpan CSS
3. documented feature-specific functional rules
4. local page CSS

Local CSS must not silently replace the global visual standard.

## 24. Development Requirement

Every new or modified MoveSpan screen must first map its UI to existing components:

- shell
- header
- Back
- eyebrow
- H1
- subtitle
- cards
- buttons
- inputs
- progress
- statuses

Only genuinely new functionality receives a new component.

## 25. Product Principle

MoveSpan must feel like ONE product.

Moving between Home, Health, Assessments, Functional Age, Journal, Reset Break, Settings and Practice Player must not feel like moving between separately designed applications.

Visual consistency is a product requirement.

<!-- MOVESPAN MOBILE MEASUREMENT STANDARD START -->

## MoveSpan Mobile Measurement UI

Status: CANONICAL

Reference implementation:
`measure.html` — Breath Snapshot measurement flows.

This standard applies to:

- Breath Snapshot
- Functional Age measurements
- Body Assessments where measurements are interactive
- future pulse, breathing, timer, repetition and tap-based measurements

### Mobile Shell

- max app width: 430px
- horizontal page padding: 16px
- centered on larger screens
- safe-area aware
- mobile geometry remains canonical on desktop

### Circular Measurement Control

Canonical responsive size:

- normal maximum: approximately 310–320px
- width controlled responsively with viewport units
- aspect-ratio: 1 / 1
- border-radius: 50%

Small-screen fallback:

- approximately 282–286px at <=390px where needed

The circle is a primary touch target, not decoration.

### Circular Measurement Typography

Primary measurement value:

- font-size: clamp(64px, 18vw, 92px)
- heavy weight approximately 780
- line-height approximately .92
- tight negative letter-spacing

Measurement unit:

- 17px
- weight 700

Secondary timer/time value:

- 17px
- tabular numerals where appropriate

Instruction inside or below circle:

- 13px
- weight 700
- approximately 1.25 line-height

### Circle State Colors

Ready / inactive:

- MoveSpan green: #2D7D52

Active timing:

- MoveSpan timer terracotta: #B46F43

When a timed measurement starts:

green -> terracotta

When timing stops:

terracotta -> green / result state

Color changes indicate state.
Geometry does not change.


### Circular Control State Semantics

The circular measurement control keeps the MoveSpan green structure visible in all states.

**Ready**
- green outer structure
- no orange active ring

**Running / active measurement**
- green outer structure remains
- a terracotta/orange ring appears inside the green circle
- active measurement value/instruction may use the same terracotta accent

Canonical active timer color:
`#B46F43`

**Paused**
- when a measurement supports pause, the orange inner ring remains visible
- this communicates that the current measurement session has not ended

**Stopped / completed attempt**
- orange active ring disappears
- circular control returns to green
- result is presented for review/save

Orange therefore means:

`measurement session is active`

It is a state indicator, not a decorative alternate theme.

### Measurement Cards

Typical interactive/result cards:

- radius: approximately 20–22px
- padding: approximately 18–21px
- white surface
- subtle MoveSpan green border where appropriate
- restrained shadow

Canonical result card example:

- padding: 21px
- radius: 22px
- subtle green-tinted border/shadow

### Result Typography

Primary result value:

- approximately 54px
- weight approximately 780
- tight negative tracking

Result unit:

- approximately 14px
- strong readable weight

Result detail:

- 14px
- weight approximately 650

Supporting result note:

- 13px
- line-height approximately 1.42

### Primary Measurement Buttons

Measurement flows use large mobile touch targets.

Canonical target:

- minimum height approximately 54–56px
- radius approximately 17–18px
- readable 15–16px text
- full width where the action is primary

Green:
normal primary continuation

Terracotta:
active timer action where a circular control is not used

### Restart Pattern

A failed or unwanted attempt must be repeatable without leaving the measurement flow.

Canonical label:

`Start again`

Restart:

- clears the current unsaved attempt
- resets timer/count
- returns the measurement control to ready green
- does not erase a previously saved result unless explicitly requested

### Save Pattern

Canonical:

`Save Result`

after success:

`Saved ✓`

Confirmation appears inside the initiating button.

Do not add redundant saved-confirmation text below the button.

### Result Navigation

After saving:

1. `Saved ✓`
2. continuation to the next measurement
3. return to the parent measurement/profile menu

For Functional Age:

- `Next Measurement →` or explicit next measurement name
- `Back to Functional Age Profile`

### Functional Age Relationship

Functional Age does not define a separate visual measurement system.

Functional Age uses this MoveSpan Mobile Measurement UI.

Its measurement-specific differences are limited to:

- measurement instructions
- type of control
- result logic
- status interpretation

It must reuse the same:

- mobile shell
- header
- Back
- typography hierarchy
- circular controls
- cards
- buttons
- result presentation
- restart interaction
- save interaction

<!-- MOVESPAN MOBILE MEASUREMENT STANDARD END -->
